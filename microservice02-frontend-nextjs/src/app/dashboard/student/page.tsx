'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

// Define types matching what we expect from the grade-service
export interface CourseStats {
  courseId: string; // Use courseId from backend
  course: string;   // Use course name from backend
  period: string;   // Use period from backend
  initialDate: string; // Initial grades submission date
  finalDate: string; // add if/when backend supports it
}

export interface ChartQuestion {
  title: string;
  labels: string[];
  values: number[];
}

export interface ChartData {
  main: {
    title: string;
    labels: string[];
    values: number[];
  };
  questions: ChartQuestion[];
}

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<CourseStats[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get selected course chart data
  const chartDataForSelected: ChartData | null = selectedCourseId && chartData[selectedCourseId]
    ? chartData[selectedCourseId]
    : null;

  // Fetch all courses when component mounts
  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      if (!isMounted) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token missing. Please log in again.');
        }
        const response = await fetch('http://localhost:3008/api/courses', {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
        const data: Array<{ courseId: string; course: string; period: string; initialDate: string; finalDate?: string }> = await response.json();
        if (Array.isArray(data)) {
          // Map backend fields to frontend state
          const validatedCourses = data.map((course, idx) => ({
            courseId: course.courseId || String(idx),
            course: course.course || `Unnamed Course ${idx + 1}`,
            period: course.period || 'N/A',
            initialDate: course.initialDate || '',
            finalDate: course.finalDate || '',
          }));
          if (isMounted) setCourses(validatedCourses);
        } else {
          throw new Error('Received invalid data format from API');
        }
      } catch (err: unknown) {
        let message = 'Unknown error';
        if (err instanceof Error) message = err.message;
        if (isMounted) {
          setError(`Failed to load courses: ${message}`);
          setCourses([]); // No fallback mock data
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCourses();
    return () => { isMounted = false; };
  }, []);

  // Fetch chart data when a course is selected
  useEffect(() => {
    if (!selectedCourseId) return;
    if (typeof selectedCourseId !== 'string' || selectedCourseId.trim() === '') return;
    if (chartData[selectedCourseId]) return;
    let isMounted = true;
    async function fetchChartData() {
      if (!isMounted) return;
      try {
        const response = await fetch(`http://localhost:3008/api/grades/distribution/${encodeURIComponent(selectedCourseId ?? '')}`, {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token') || ''}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch chart data: ${response.status} ${response.statusText}`);
        }
        const data: {
          totalStudents: number;
          finalScoreDistribution: [number, number][];
          questionDistributions: Record<string, [number, number][]>;
        } = await response.json();
        // Parse backend data into ChartData
        const main = {
          title: `Grade Distribution (Total Students: ${data.totalStudents})`,
          labels: data.finalScoreDistribution.map((item) => String(item[0])),
          values: data.finalScoreDistribution.map((item) => item[1]),
        };
        const questions: ChartQuestion[] = Object.entries(data.questionDistributions || {}).map(
          ([qKey, arr]) => ({
            title: qKey,
            labels: arr.map((item) => String(item[0])),
            values: arr.map((item) => item[1]),
          })
        );
        if (isMounted && selectedCourseId) {
          setChartData(prev => ({
            ...prev,
            [selectedCourseId]: { main, questions },
          }));
        }
      } catch {
        if (isMounted && selectedCourseId) {
          setChartData(prev => ({ ...prev, [selectedCourseId]: {
            main: { title: 'No Data', labels: [], values: [] }, questions: []
          }}));
        }
      }
    }
    fetchChartData();
    return () => { isMounted = false; };
  }, [selectedCourseId, chartData]);

  return (
    <div className="space-y-8">
    <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
    <div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
    My Academic Progress
    </h1>
    <p className="text-sm text-gray-800 mt-1">
    Track your academic journey and performance
    </p>
    </div>
    <button
    onClick={() => { router.push('/dashboard/student/courses'); }}
    className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl
    hover:from-blue-800 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200
    shadow-md hover:shadow-xl active:scale-95"
    >
    See My Courses
    </button>
    </div>

    {error && (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">{error}</div>
    )}

    {loading ? (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-600">Loading your courses...</p>
      </div>
    ) : (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses Statistics</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Exam Period</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Initial Grades Submission Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Final Grades Submission Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr
                key={course.courseId}
                onClick={() => setSelectedCourseId(course.courseId)}
                className={`cursor-pointer transition-colors duration-150 ${
                  selectedCourseId === course.courseId
                  ? 'bg-indigo-100/70'
                  : 'hover:bg-blue-50/70'
                }`}
              >
                <td className="p-2 border text-gray-900">{course.course || 'Untitled Course'}</td>
                <td className="p-2 border text-gray-900">{course.period || 'N/A'}</td>
                <td className="p-2 border text-gray-900">
                  {course.initialDate ? new Date(course.initialDate).toLocaleDateString() : '-'}
                </td>
                <td className="p-2 border text-gray-900">
                  {course.finalDate ? new Date(course.finalDate).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      </div>
    )}

    {chartDataForSelected && (
      <div className="space-y-6">
      <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">
      {chartDataForSelected.main.title}
      </h2>
      <Bar
      data={{
        labels: chartDataForSelected.main.labels,
        datasets: [
          {
            label: 'Grade Distribution',
            data: chartDataForSelected.main.values,
            backgroundColor: 'rgba(59, 130, 246, 0.8)'
          }
        ]
      }}
      height={120}
      />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {chartDataForSelected.questions.map((question) => (
        <div key={question.title} className="bg-white rounded-md shadow-md p-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">{question.title}</h3>
        <Bar
        data={{
          labels: question.labels,
          datasets: [
            {
              label: 'Question Performance',
              data: question.values,
              backgroundColor: 'rgba(16, 185, 129, 0.8)'
            }
          ]
        }}
        height={100}
        />
        </div>
      ))}
      </div>
      </div>
    )}
    </div>
  );
}
