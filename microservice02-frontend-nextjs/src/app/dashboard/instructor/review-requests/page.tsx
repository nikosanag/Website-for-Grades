'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/app/ui/common/Button';

export interface InstructorReviewRequest {
  _id: string;
  professorId: string;
  professorName: string;
  studentId: string;
  studentName: string;
  period: string;
  classSection: string;
  gradingScale: string;
  originalGrade: number;
  newGrade: number;
  reviewStatus: string;
  comments: string[];
}

export default function ReviewRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<InstructorReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');        const response = await fetch('http://localhost:3005/api/viewInstructorReviews', {
          method: "GET",
          headers: {
            'x-observatory-auth': token || '',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch review requests: ${response.status} ${response.statusText}`);
        }
          const data = await response.json();
        console.log('Fetched review requests:', data);
        
        // Handle different API response formats
        let reviewsArray = [];
        
        // If data is directly an array
        if (Array.isArray(data)) {
          reviewsArray = data;
        } 
        // If data has a reviews property that is an array
        else if (data && data.reviews && Array.isArray(data.reviews)) {
          reviewsArray = data.reviews;
        } 
        // If data has another structure containing reviews
        else if (data && typeof data === 'object') {
          // Try to find any array in the response that might contain reviews
          const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
          if (possibleArrays.length > 0) {
            // Use the first array found
            reviewsArray = possibleArrays[0];
          }
        }
        
        console.log('Processed reviews array:', reviewsArray);
        setRequests(reviewsArray);      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Could not load review requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  const handleReply = (id: string) => {
    if (!id) {
      console.error("Cannot navigate to reply page: Review ID is missing");
      return;
    }
    
    // Log the navigation for debugging
    console.log(`Navigating to reply page for review ID: ${id}`);
    
    // Navigate to the reply page with the review ID
    router.push(`/dashboard/instructor/reply-reviews?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">🔍 Review Requests</h1>
        <p>See and answer your review requests.</p>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (        <div className="bg-white rounded-md shadow-md p-4">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Course Name</th>
                <th className="p-2 border">Exam Period</th>
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No reviews yet.</td>
                </tr>
              ) : (                requests.map((req) => {
                  // Use safe access with fallbacks for missing data
                  const id = req._id || '';
                  const courseName = req.classSection || 'Unknown Course';
                  const period = req.period || 'Unknown Period';
                  const studentName = req.studentName || 'Unknown Student';
                  
                  return (
                    <tr key={id} className="border-t">
                      <td className="p-2 border">{courseName}</td>
                      <td className="p-2 border">{period}</td>
                      <td className="p-2 border capitalize">{studentName}</td>                      <td className="p-2 border">                        <Button 
                          onClick={() => {
                            console.log(`Replying to review: ${id}`);
                            handleReply(id);
                          }} 
                          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Reply to Review
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
