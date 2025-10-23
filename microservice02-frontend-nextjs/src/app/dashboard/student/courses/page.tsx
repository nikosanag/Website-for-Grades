// filepath: /app/dashboard/student/courses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/common/Button';
import styles from './styles.module.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 14,
          weight: 'bold' as const
        }
      }
    },
    x: {
      ticks: {
        font: {
          size: 14,
          weight: 'bold' as const
        }
      }
    }
  }
};

type ActiveView = {
  type: 'grades' | 'review' | 'status' | null;
  course: string | null;
  period: string | null;
  courseId?: string | null;
};

type CourseDetail = {
  course: string;
  period: string;
  courseId: string;
  status: string;
  reviewRequest?: {
    messages?: Message[];
  };
  studentReviewSubmitted?: boolean;
  hasReviewMessages?: boolean; // Added for review status logic
};

type Message = {
  sender: string;
  message: string;
  timestamp: string;
};

type GradeBreakdown = {
  [key: string]: number;
};

type GradeItem = {
  finalScore: number;
  breakdown?: GradeBreakdown;
  [key: string]: number | GradeBreakdown | undefined;
};

type GradeDistribution = {
  finalScoreDistribution: [number, number][];
  questionDistributions: {
    [key: string]: [number, number][];
  };
  totalStudents: number;
  courseId: string;
};

// Review comment types removed since we're using string-based comments

type Review = {
  _id: string;
  professorName: string;
  professorId: string;
  studentName: string;
  studentId: string;
  period: string;
  classSection: string;
  gradingScale: string;
  originalGrade: number;
  reviewStatus: string;
  newGrade: number;
  comments: string[]; // Comments are stored as strings in the backend model
};

// Helper function to safely parse JWT tokens
const parseJwt = (token: string) => {
  try {
    // Split the token and get the payload (second part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Replace characters for base64 URL encoding
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and parse the JSON
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

export default function StudentCoursesPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>({ type: null, course: null, period: null, courseId: null });
  const [selectedGradeView, setSelectedGradeView] = useState<'total' | 'q1' | 'q2' | 'q3' | 'q4'>('total');
  const [formData, setFormData] = useState<{ reviewMessage?: string }>({});
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [detailedGrades, setDetailedGrades] = useState<GradeItem[]>([]);
  const [gradeDistributions, setGradeDistributions] = useState<GradeDistribution>({} as GradeDistribution);
  const [isLoading, setIsLoading] = useState(false);
  const [studentReviews, setStudentReviews] = useState<Review[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<{success?: string; error?: string}>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch student courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const token = localStorage.getItem('token') ?? '';
        if (!token) {
          setAuthError('You are not logged in. Please log in to view your courses.');
          setCourses([]);
          return;
        }
        const res = await fetch('http://localhost:3008/api/courses', {
          headers: { 'x-observatory-auth': token }
        });
        if (res.status === 401 || res.status === 403) {
          setAuthError('Your session has expired or you are not authorized. Please log in again.');
          setCourses([]);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        // Ensure data is always an array
        const coursesArray = Array.isArray(data) ? data : [];
        // For each course, check if the user has grades
        const coursesWithGrades = await Promise.all(
          coursesArray.map(async (course) => {
            const gradesRes = await fetch(`http://localhost:3008/api/grades/student/${course.courseId}`, {
              headers: { 'x-observatory-auth': token }
            });
            if (gradesRes.status === 401 || gradesRes.status === 403) {
              setAuthError('Your session has expired or you are not authorized. Please log in again.');
              return null;
            }
            if (!gradesRes.ok) return null;
            const grades = await gradesRes.json();
            if (grades && grades.length > 0) {
              // If course is closed, check for review messages
              if (course.status !== 'open') {
                try {
                  const reviewsRes = await fetch('http://localhost:3005/api/viewStudentReviews', {
                    headers: { 'x-observatory-auth': token }
                  });
                  if (reviewsRes.status === 401 || reviewsRes.status === 403) {
                    setAuthError('Your session has expired or you are not authorized. Please log in again.');
                    return { ...course, hasReviewMessages: false };
                  }
                  if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    let reviewsArray: Review[] = [];
                    if (Array.isArray(reviewsData)) {
                      reviewsArray = reviewsData;
                    } else if (reviewsData && Array.isArray(reviewsData.reviews)) {
                      reviewsArray = reviewsData.reviews;
                    } else if (reviewsData && typeof reviewsData === 'object') {
                      const possibleArrays = Object.values(reviewsData).filter(value => Array.isArray(value));
                      if (possibleArrays.length > 0) {
                        reviewsArray = possibleArrays[0] as Review[];
                      }
                    }
                    // Find reviews for this course and period with at least one comment
                    const hasReviewMessages = reviewsArray.some((review: Review) =>
                      review.classSection === course.course &&
                      review.period === course.period &&
                      Array.isArray(review.comments) &&
                      review.comments.length > 0 &&
                      review.comments.some((msg: string) => typeof msg === 'string' && msg.trim() !== '')
                    );
                    return { ...course, hasReviewMessages };
                  }
                } catch {
                  return { ...course, hasReviewMessages: false };
                }
                return { ...course, hasReviewMessages: false };
              }
              // For open courses, always allow
              return { ...course, hasReviewMessages: true };
            }
            return null;
          })
        );
        setCourses(coursesWithGrades.filter(Boolean));
      } catch {
        setCourses([]);
        setAuthError('An error occurred while fetching your courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch grades and distributions when viewing grades
  const handleViewGrades = async (course: string, period: string, courseId?: string) => {
    setActiveView({ type: 'grades', course, period, courseId });
    setSelectedGradeView('total');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') ?? '';
      // Fetch grades for this course (personal grades)
      const gradesRes = await fetch(`http://localhost:3008/api/grades/student/${courseId}`, {
        headers: { 'x-observatory-auth': token }
      });
      const grades = gradesRes.ok ? await gradesRes.json() : [];
      setDetailedGrades(grades); // This is the student's personal grades
      // Fetch distribution for this course (for the plot)
      const distRes = await fetch(`http://localhost:3008/api/grades/distribution/${courseId}`);
      const dist = distRes.ok ? await distRes.json() : {};
      setGradeDistributions(dist); // This is the distribution for the plot
    } catch {
      setDetailedGrades([]);
      setGradeDistributions({} as GradeDistribution);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskReview = (course: string, period: string) => {
    setActiveView({ type: 'review', course, period });
  };

  const handleViewReviewStatus = async (course: string, period: string) => {
    setActiveView({ type: 'status', course, period });
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token') ?? '';
      // Fetch student reviews
      const reviewsRes = await fetch('http://localhost:3005/api/viewStudentReviews', {
        headers: {
          'x-observatory-auth': token
        }
      });
      
      if (!reviewsRes.ok) {
        const text = await reviewsRes.text();
        throw new Error('Failed to fetch reviews: ' + text);
      }
      
      const reviewsData = await reviewsRes.json();
      // Support both { reviews: [...] } and [...] formats
      let reviewsArray: Review[] = [];
      if (Array.isArray(reviewsData)) {
        reviewsArray = reviewsData;
      } else if (reviewsData && Array.isArray(reviewsData.reviews)) {
        reviewsArray = reviewsData.reviews;
      } else if (reviewsData && typeof reviewsData === 'object') {
        // Try to find any array in the response that might contain reviews
        const possibleArrays = Object.values(reviewsData).filter(value => Array.isArray(value));
        if (possibleArrays.length > 0) {
          reviewsArray = possibleArrays[0];
        }
      }
      // Filter reviews for the specific course
      const courseReviews = reviewsArray.filter((review: Review) => 
        review.classSection === course && review.period === period
      );
      setStudentReviews(courseReviews);
    } catch {
      // Error fetching reviews, set empty reviews (no alert)
      setStudentReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReviewRequest = async () => {
    // Clear previous submission status
    setSubmissionStatus({});
    
    if (!activeView.course || !activeView.period || !formData.reviewMessage) {
      setSubmissionStatus({error: 'Please provide a message for your review request'});
      return;
    }

    setIsLoading(true);
    try {
      // Find the current course details to get necessary info
      const currentCourse = courses.find(course => 
        course.course === activeView.course && course.period === activeView.period
      );
      
      if (!currentCourse) {
        throw new Error('Course information not found');
      }
      
      // Get authentication token
      const token = localStorage.getItem('token') ?? '';
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Get user info from the token or from a separate API call
      // since localStorage.getItem('user') is not reliable
      let studentId = '';
      let studentName = '';
      
      try {        // First try to get user info from grade data for this course        console.log(`Fetching initial grades data for courseId: ${currentCourse.courseId}`);
        const gradesRes = await fetch(`http://localhost:3008/api/grades/student/${currentCourse.courseId}`, {
          method: 'GET',
          headers: { 
            'x-observatory-auth': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        console.log(`Initial grades API response status: ${gradesRes.status}`);
        
        if (!gradesRes.ok) {
          // Try to get more details from the error response
          const errorText = await gradesRes.text();
          console.error("Error response from initial grades API:", errorText);
          console.error(`Headers: ${JSON.stringify(Array.from(gradesRes.headers.entries()))}`);
          throw new Error(`Failed to fetch grade data: ${gradesRes.status} ${gradesRes.statusText}`);
        }
          
        const grades = await gradesRes.json();
        console.log("Initial grades data received:", grades);
        
        if (!grades || (Array.isArray(grades) && grades.length === 0)) {
          console.error("No grade data in response:", grades);
          throw new Error('No grade data found for this course');
        }
          // Ensure grades is always an array
        const gradesArray = Array.isArray(grades) ? grades : [grades];
        
        // Try to get student info from grades API response
        // The grades API might include student info in the response
        studentId = gradesArray[0].studentId || '';
        studentName = gradesArray[0].studentName || '';
          // If we couldn't get student info from grades, try to get user info from token
        if (!studentId || !studentName) {
          // Try to decode the JWT token to get user information
          const tokenPayload = parseJwt(token);
          if (tokenPayload) {
            console.log("Token payload:", tokenPayload);
            studentId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub || '';
            studentName = tokenPayload.name || tokenPayload.username || '';
          }
          
          // If token parsing didn't work, try to fetch from user info endpoint
          if (!studentId || !studentName) {
            // Fetch the user info using the token (an API endpoint that returns user details)
            const userInfoRes = await fetch('http://localhost:3001/api/user-info', {
              headers: { 'x-observatory-auth': token }
            }).catch(() => null);
            
            if (userInfoRes && userInfoRes.ok) {
              const userData = await userInfoRes.json();
              studentId = userData.id || '';
              studentName = userData.name || userData.username || '';
            }
          }
        }
        
        // If we still don't have user info, use fallback values
        if (!studentId || !studentName) {
          // Last attempt - try to parse from localStorage if it exists
          const userInfoStr = localStorage.getItem('user');
          if (userInfoStr) {
            try {
              const userInfo = JSON.parse(userInfoStr);
              studentId = userInfo.id || '';
              studentName = userInfo.name || userInfo.username || '';
            } catch (e) {
              console.error("Error parsing user info from localStorage:", e);
            }
          }
        }
        
        // Use fallbacks if all attempts failed
        studentId = studentId || localStorage.getItem('userId') || 'unknown';
        studentName = studentName || localStorage.getItem('username') || 'Student';
        
        console.log("Using student info for review:", { studentId, studentName });
      } catch (error) {
        console.error("Error getting student information:", error);
        // Use fallback values
        studentId = localStorage.getItem('userId') || 'unknown';
        studentName = localStorage.getItem('username') || 'Student';
      }        // Get the student's grade for this course again
      // (we need it for the review data)
      console.log("Fetching grades for course ID:", currentCourse.courseId);      // Define professorId and professorName in the outer scope
      let professorName = '';
      let professorId = '';
      
      try {        const gradesRes = await fetch(`http://localhost:3008/api/grades/student/${currentCourse.courseId}`, {
          method: 'GET',
          headers: { 
            'x-observatory-auth': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        // Log response status and details for debugging
        console.log("Grades API response status:", gradesRes.status);
        
        if (!gradesRes.ok) {
          // Try to get more details from the error response
          const errorText = await gradesRes.text();
          console.error("Error response from grades API:", errorText);
          throw new Error(`Failed to fetch grade data: ${gradesRes.status} ${gradesRes.statusText}`);
        }
          const grades = await gradesRes.json();
        console.log("Grades data received:", grades);
        
        // Add detailed inspection of grades data to help debugging
        if (grades && Array.isArray(grades) && grades.length > 0) {
          console.log("First grade document fields:", Object.keys(grades[0]));
          console.log("Grade contains instructorId:", grades[0].instructorId ? "Yes" : "No");
          console.log("Grade contains studentId:", grades[0].studentId ? "Yes" : "No");
          console.log("Grade contains fullName:", grades[0].fullName ? "Yes" : "No");
        }
        
        if (!grades || (Array.isArray(grades) && grades.length === 0)) {
          throw new Error('No grade data found for this course');
        }
        
        // Ensure grades is always an array
        const gradesArray = Array.isArray(grades) ? grades : [grades];
          // Extract instructor info directly from the grades data
        try {
          // The grades data already has instructorId from the Grade model
          if (gradesArray && gradesArray.length > 0 && gradesArray[0].instructorId) {
            professorId = gradesArray[0].instructorId;
            // Use a placeholder for professor name since we don't have it in the grade model
            professorName = 'Instructor';
            console.log('Found instructor ID in grades data:', professorId);
          }
          
          if (!professorId) {
            console.error('No instructor ID found in grades data');
            setSubmissionStatus({error: 'Cannot submit review: Instructor information is missing for this course. Please contact support or try again later.'});
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error fetching instructor info:', e);
          setSubmissionStatus({error: 'Cannot submit review: Failed to fetch instructor information. Please try again later.'});
          setIsLoading(false);
          return;
        }
          // Prepare review request data with the grades we retrieved
        const gradeDoc = gradesArray[0];
        
        // Log the grade document to see what fields are available
        console.log("Grade document used for review submission:", gradeDoc);
        
        const reviewData = {
          professorName: professorName, // This will be 'Instructor' as a placeholder
          professorId: professorId, // This comes directly from the grade document
          studentName: gradeDoc.fullName || studentName, // Grade model includes fullName
          studentId: gradeDoc.studentId || studentId, // Grade model includes studentId
          period: gradeDoc.period || currentCourse.period,
          classSection: gradeDoc.course || currentCourse.course,
          gradingScale: gradeDoc.scale || '0-10',          originalGrade: gradeDoc.finalScore || 0,
          newGrade: gradeDoc.finalScore || 0,
          reviewStatus: 'Δημιουργήθηκε αίτηση',
          comment: formData.reviewMessage,
          sender: 'Student' // Explicitly set the sender as Student
        };
        // Log the exact JSON string being sent
        const reviewDataJson = JSON.stringify(reviewData);
        console.log('Exact JSON payload being sent to API:', reviewDataJson);
        
        console.log('Sending review request to API:', reviewData);
        
        // Submit the review request to the correct API endpoint
        const reviewRes = await fetch('http://localhost:3005/api/postReview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-observatory-auth': token
          },
          body: JSON.stringify(reviewData)
        });
        
        // Parse response data (could be JSON or text)
        let responseData;
        const contentType = reviewRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await reviewRes.json();
        } else {
          responseData = await reviewRes.text();
        }
        console.log('Review API response:', responseData);
        
        if (!reviewRes.ok) {
          console.error('Review submission failed:', responseData);
          throw new Error(typeof responseData === 'string' ? responseData : 'Failed to submit review request');
        }
        
        console.log('Review request submitted successfully:', responseData);
        
        // Set success message and reset form
        setSubmissionStatus({success: 'Your review request has been submitted successfully!'});
        setFormData({});
        
        // Update the courses data to reflect that a review has been submitted for this course
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.course === currentCourse.course && course.period === currentCourse.period
              ? { ...course, studentReviewSubmitted: true }
              : course
          )
        );
        
        // Wait 2 seconds before navigating back to show the success message
        setTimeout(() => {
          setActiveView({ type: null, course: null, period: null });
          
          // Refresh the reviews list for this course in the background
          handleViewReviewStatus(currentCourse.course, currentCourse.period);
        }, 2000);
        
        setIsLoading(false);
        return; // Exit function early since we've handled everything
      } catch (error) {
        console.error("Error fetching grades:", error);
        
        // Let's try a fallback approach - attempt to use the grades we fetched earlier
        // during the first part of this function
        console.log("Attempting to use previously fetched grades...");
          // Continue with review submission without re-fetching grades
        // Check if we already have professorId from before
        if (!professorId) {
          console.error("No professor ID available, cannot submit review");
          setSubmissionStatus({error: 'Cannot submit review: Instructor information is missing for this course. Please contact support or try again later.'});
          setIsLoading(false);
          return;
        }
        
        const reviewData = {
          professorName: 'Instructor',
          professorId: professorId, // Use the professor ID we got earlier
          studentName: studentName,
          studentId: studentId,
          period: currentCourse.period,
          classSection: currentCourse.course,
          gradingScale: '0-10',          originalGrade: 0, // Use fallback value since we couldn't get the actual grade
          newGrade: 0, // Use fallback value
          reviewStatus: 'Δημιουργήθηκε αίτηση',
          comment: formData.reviewMessage,
          sender: 'Student' // Explicitly set the sender as Student
        };
        
        console.log('Using fallback review data:', reviewData);
        
        // Submit the review request to the correct API endpoint
        const reviewRes = await fetch('http://localhost:3005/api/postReview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-observatory-auth': token
          },
          body: JSON.stringify(reviewData)
        });
        
        // Handle response
        if (!reviewRes.ok) {
          const responseText = await reviewRes.text();
          console.error('Review submission failed:', responseText);
          throw new Error(`Failed to submit review: ${responseText}`);
        }
        
        console.log('Review request submitted successfully with fallback data');
        setSubmissionStatus({success: 'Your review request has been submitted successfully!'});
        setFormData({});
        
        // Update courses and navigate back
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.course === currentCourse.course && course.period === currentCourse.period
              ? { ...course, studentReviewSubmitted: true }
              : course
          )
        );
        
        setTimeout(() => {
          setActiveView({ type: null, course: null, period: null });
          handleViewReviewStatus(currentCourse.course, currentCourse.period);
        }, 2000);
        
        setIsLoading(false);
        return; // Exit function early since we've handled everything
      }      // This section has been replaced by the code in the try block above
    } catch (error) {
      // Show error message in the UI with more details
      console.error('Error submitting review:', error);
      
      let errorMessage = (error as Error).message || 'Failed to submit review request';
      
      // Add more context if it's a known error
      if (errorMessage.includes('token') || errorMessage.includes('Authentication')) {
        errorMessage = 'Authentication error: Your session may have expired. Please try logging out and logging back in.';
      } else if (errorMessage.includes('not found') || errorMessage.includes('missing')) {
        errorMessage = 'Missing information: Could not find required details to submit your review request.';
      }
      
      setSubmissionStatus({error: errorMessage});
    } finally {
      setIsLoading(false);
    }
  };

  // sort courses: open grading statuses first, then closed
  const sortedCourseDetails = [...courses].sort((a, b) => {
    const aClosed = a.status !== 'open';
    const bClosed = b.status !== 'open';
    return aClosed === bClosed ? 0 : aClosed ? 1 : -1;
  });

  // Helper to get current course grades (first grade object)
  const getCurrentCourseGrades = (): GradeItem | undefined => {
    if (Array.isArray(detailedGrades) && detailedGrades.length > 0) {
      // If the API returns an array, use the first object
      return detailedGrades[0];
    } else if (detailedGrades && typeof detailedGrades === 'object') {
      // If the API returns an object
      return detailedGrades as unknown as GradeItem;
    }
    return undefined;
  };

  // Helper to get grade distribution data
  const getGradeDistributionData = (type: 'total' | 'q1' | 'q2' | 'q3' | 'q4') => {
    if (!gradeDistributions) return { labels: [], datasets: [] };
    
    let distribution: [number, number][] = [];
    
    if (type === 'total') {
      // Backend returns finalScoreDistribution as array of [score, count] pairs
      distribution = gradeDistributions.finalScoreDistribution || [];
    } else {
      // Backend returns questionDistributions as object with keys like Q1, Q2, etc.
      const qKey = type.toUpperCase();
      distribution = gradeDistributions.questionDistributions?.[qKey] || [];
    }
    
    // Ensure distribution is an array of [score, count] pairs
    if (!Array.isArray(distribution)) distribution = [];
    
    return {
      labels: distribution.map(d => (d[0] !== undefined ? d[0].toString() : '')),
      datasets: [
        {
          data: distribution.map(d => d[1] || 0), // d[1] is the count
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 1,
        },
      ],
    };
  };

  // Helper to get current course status by course and period
  const getCourseStatus = (course: string | null, period: string | null) => {
    const found = courses.find(
      (c) => c.course === course && c.period === period
    );
    return found ? found.status : null;
  };

  return (
    <div className="space-y-6">
      {/* Go Back Button */}
      <div className="absolute top-21 left-310">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">📚 My Courses</h1>

      {/* Auth error message */}
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center mt-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-red-700">Authentication Required</h2>
            <p className="text-red-600 max-w-md">{authError}</p>
            <Button
              onClick={() => router.push('/login')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}

      {/* No courses message */}
      {!authError && sortedCourseDetails.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700">No courses found</h2>
            <p className="text-gray-500 max-w-md">
              You don&apos;t have any courses with grades available at the moment. Please check back later or contact your instructor if you believe this is an error.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      ) : !authError && isLoading ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700">Loading your courses...</h2>
            <p className="text-gray-500">Please wait while we fetch your course data.</p>
          </div>
        </div>
      ) : !authError && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-200">Course Name</th>
                <th className="px-6 py-4 text-left text-lg font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-200">Exam Period</th>
                <th className="px-6 py-4 text-left text-lg font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-200">Grading Status</th>
                <th className="px-6 py-4 text-left text-lg font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">{sortedCourseDetails.map((detail) => {
                const courseName = detail.course;
                const examPeriod = detail.period;
                const status = detail.status;
                const isDisabled = status !== 'open';
                const canViewReview = status === 'open' || detail.hasReviewMessages;
                return (
                  <tr key={`${courseName}-${examPeriod}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base font-semibold text-gray-900">{courseName}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-900">{examPeriod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                      ${status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}`}>
                      {status}                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                          <Button 
                            onClick={() => handleViewGrades(courseName, examPeriod, detail.courseId)}
                            variant={activeView.type === 'grades' && activeView.course === courseName && activeView.period === examPeriod ? 'primary' : 'outline'}
                            style={{
                              backgroundColor: activeView.type === 'grades' && activeView.course === courseName && activeView.period === examPeriod 
                                ? '' 
                                : 'NavajoWhite' 
                            }}
                            className={`shadow-md hover:shadow-xl transition-all duration-300 font-semibold bg-red-600
                              ${activeView.type === 'grades' && activeView.course === courseName && activeView.period === examPeriod
                              ? 'text-red-700 border-red-800'
                              : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-800 hover:text-white text-blue-800 border-blue-500'
                              } border hover:-translate-y-0.5 bg-red-400 active:translate-y-0`}
                          >
                            📊 View My Grades
                          </Button>                      <Button
                        variant={activeView.type === 'review' && activeView.course === courseName && activeView.period === examPeriod ? 'primary' : 'outline'}
                        onClick={() => !isDisabled && handleAskReview(courseName, examPeriod)}
                        disabled={isDisabled}
                        style={isDisabled ? { opacity: 0.4 } : {}}
                        className={`shadow-md transition-all duration-300 font-semibold
                          ${isDisabled 
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white border-0 cursor-not-allowed pointer-events-none' 
                            : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0'
                          }`}
                      >
                        ✏️ Ask for Review
                      </Button>                      <Button
                        variant="outline"
                        onClick={() => canViewReview && handleViewReviewStatus(courseName, examPeriod)}
                        disabled={!canViewReview}
                        className={`mt-0 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700
                          text-white border-0 shadow-md hover:shadow-xl transition-all duration-300
                          transform hover:-translate-y-0.5 active:translate-y-0 font-semibold
                          ${!canViewReview ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                      >
                        📝 View Review Status
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* Dynamic Content Section */}
      {activeView.type === 'grades' && (
        <div className={`mt-8 ${styles.slideDown}`}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Grades for {activeView.course} - {activeView.period}
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setActiveView({ type: null, course: null, period: null })}
                className="hover:bg-red-100 hover:text-red-700 rounded-full p-2 transition-all duration-300 transform hover:rotate-90"
              >
                <span className="text-xl">✕</span>
              </Button>
            </div>
              {/* Grade details rendering */}
            {function renderGrades() {
              const courseGrades = getCurrentCourseGrades();
              if (!courseGrades) return null;
              
              // Extract grades from the API response
              // First check for finalScore (for total)
              // Then check for breakdown object for Q1, Q2, etc.
              const gradeData: Record<string, number> = {
                total: courseGrades.finalScore
              };
              
              // Add breakdown grades if they exist
              if (courseGrades.breakdown) {
                Object.entries(courseGrades.breakdown).forEach(([key, value]) => {
                  // Convert key to lowercase to match our internal format (q1, q2, etc.)
                  gradeData[key.toLowerCase()] = value as number;
                });
              }
              
              // Filter for available grades that have values
              const availableGrades = Object.entries(gradeData)
                .filter(([, value]) => value !== null && value !== undefined)
                .map(([key, value]) => ({
                  key: key as 'total' | 'q1' | 'q2' | 'q3' | 'q4',
                  value
                }));

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    {availableGrades.map(({ key, value }) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-xl font-bold text-gray-900 capitalize">
                          {key === 'total' ? 'Total' : key.toUpperCase()}
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={value?.toString() ?? '-'}
                          className="w-full p-3 border-2 border-gray-300 rounded-md text-gray-900 text-lg font-bold bg-gray-50"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8 mb-4">
                    {availableGrades.map(({ key }) => (
                      <Button
                        key={key}
                        onClick={() => setSelectedGradeView(key)}
                        variant={selectedGradeView === key ? 'primary' : 'outline'}
                        className="capitalize"
                      >
                        {key === 'total' ? 'Total' : key.toUpperCase()}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                      {selectedGradeView === 'total' ? 'Total' : selectedGradeView.toUpperCase()} Distribution
                    </h3>
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <Bar 
                        data={getGradeDistributionData(selectedGradeView)}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                </div>              );
            }()}
          </div>
        </div>
      )}

      {activeView.type === 'review' && (
        <div className={`mt-8 ${styles.slideDown}`}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">NEW REVIEW REQUEST</h2>
              <div className="text-gray-600">{activeView.course} - {activeView.period}</div>
            </div>
            
            <div className="space-y-4 text-blue-700">
              <div>
                <label className="block mb-2 text-gray-900">Message to instructor</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-900 rounded-md p-2"
                  placeholder="Please explain why your grade should be reviewed..."
                  value={formData.reviewMessage || ''}
                  onChange={(e) => handleFormChange('reviewMessage', e.target.value)}                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitReviewRequest}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-md 
                    hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-xl transition-all duration-300 
                    transform hover:-translate-y-0.5 active:translate-y-0 font-bold uppercase tracking-wider text-sm"
                  disabled={getCourseStatus(activeView.course, activeView.period) !== 'open'}
                >
                  📤 Submit Grade Review Request
                </Button>
              </div>
            </div>            {/* Submission status message */}
            {submissionStatus.success && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{submissionStatus.success}</span>
              </div>
            )}
            {submissionStatus.error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold mb-1">Error:</div>
                  <div>{submissionStatus.error}</div>
                  {submissionStatus.error.includes('Authentication') && (
                    <div className="mt-2 text-sm">
                      Try refreshing the page or logging out and logging back in.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView.type === 'status' && (
        <div className={`mt-8 ${styles.slideDown}`}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Review Status for {activeView.course} - {activeView.period}
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setActiveView({ type: null, course: null, period: null })}
                className="hover:bg-red-100 hover:text-red-700 rounded-full p-2 transition-all duration-300 transform hover:rotate-90"
              >
                <span className="text-xl">✕</span>
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center p-8">
                <p>Loading review status...</p>
              </div>
            ) : studentReviews.length > 0 ? (
              <div className="space-y-10">
                {studentReviews.map((review, reviewIdx) => (
                  <div key={review._id || reviewIdx} className="space-y-6 border-b pb-8 last:border-b-0 last:pb-0">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold text-blue-800">Current Status: {review.reviewStatus}</h3>
                      <p className="text-sm text-blue-600">
                        {review.newGrade !== undefined && review.newGrade !== null && review.newGrade !== review.originalGrade ? (
                          <>
                            Original Grade: {review.originalGrade} &rarr; <span className="font-bold">{review.newGrade}</span>
                          </>
                        ) : (
                          <>Original Grade: {review.originalGrade}</>
                        )}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {review.comments && review.comments.length > 0 ? (
                        review.comments.map((comment, idx) => {
                          // Parse role from [Student] or [Instructor] prefix in the comment string
                          let sender: 'Student' | 'Instructor' = 'Student';
                          let commentText: string = String(comment);
                          if (typeof comment === 'string') {
                            const match = comment.match(/^\[(Student|Instructor)]\s*(.*)$/i);
                            if (match) {
                              sender = match[1] === 'Instructor' ? 'Instructor' : 'Student';
                              commentText = match[2];
                            }
                          }
                          return (
                            <div 
                              key={idx} 
                              className={`flex ${sender === 'Student' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`p-4 rounded-lg max-w-[80%] shadow-sm
                                ${sender === 'Student'
                                  ? 'bg-blue-100 text-blue-900' 
                                  : 'bg-gray-100 text-gray-900'}`}
                              >
                                <div className="text-sm font-semibold mb-1 flex justify-between items-center gap-4">
                                  <span className="capitalize">{sender}</span>
                                </div>
                                <p className="whitespace-pre-wrap">{commentText}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-gray-500">No comments yet</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">No review requests or messages available.</p>
                {/* Allow submitting a review request only if status is open */}
                <Button 
                  variant="outline"
                  onClick={() => handleAskReview(activeView.course!, activeView.period!)}
                  className="mt-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700
                    text-white border-0 shadow-md hover:shadow-xl transition-all duration-300
                    transform hover:-translate-y-0.5 active:translate-y-0 font-semibold"
                  disabled={getCourseStatus(activeView.course, activeView.period) !== 'open'}
                >
                  ✉️ Submit a Review Request
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
