// filepath: /app/dashboard/student/courses/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/common/Button';
import { studentCourseDetails } from '@/app/lib/studentCourseDetails';
import { studentDetailedGrades, type CourseGrades } from '@/app/lib/studentDetailedGrades';
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
};

export default function StudentCoursesPage() {
  const [activeView, setActiveView] = useState<ActiveView>({ type: null, course: null, period: null });
  const [selectedGradeView, setSelectedGradeView] = useState<'total' | 'q1' | 'q2' | 'q3' | 'q4'>('total');
  const [formData, setFormData] = useState<{ reviewMessage?: string }>({});

  const handleViewGrades = (course: string, period: string) => {
    setActiveView({ type: 'grades', course, period });
    setSelectedGradeView('total');
  };

  const handleAskReview = (course: string, period: string) => {
    setActiveView({ type: 'review', course, period });
  };

  const handleViewReviewStatus = (course: string, period: string) => {
    setActiveView({ type: 'status', course, period });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReviewRequest = () => {
    console.log('Review request submitted:', formData);
    setActiveView({ type: null, course: null, period: null });
  };

  // sort courses: open grading statuses first, then closed
  const sortedCourseDetails = [...studentCourseDetails].sort((a, b) => {
    const aClosed = a.studentGradingStatus !== 'open';
    const bClosed = b.studentGradingStatus !== 'open';
    return aClosed === bClosed ? 0 : aClosed ? 1 : -1;
  });

  const getCurrentCourseGrades = (): CourseGrades | undefined => {
    return activeView.course 
      ? studentDetailedGrades.find(g => g.courseName === activeView.course)
      : undefined;
  };

  const getGradeDistributionData = (courseGrades: CourseGrades, type: 'total' | 'q1' | 'q2' | 'q3' | 'q4') => {
    const distribution = type === 'total' 
      ? courseGrades.totalDistribution 
      : type === 'q1' 
        ? courseGrades.q1Distribution
        : type === 'q2'
          ? courseGrades.q2Distribution
          : type === 'q3'
            ? courseGrades.q3Distribution
            : courseGrades.q4Distribution;

    return {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [{
        data: distribution?.map(d => d.count) || Array(11).fill(0),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">📚 My Courses</h1>
      
      {/* Courses Table */}
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
          <tbody className="divide-y divide-gray-200">
            {sortedCourseDetails.map((detail) => {
              const { studentCourse, studentPeriod, studentGradingStatus } = detail;
              const isDisabled = studentGradingStatus !== 'open';

              return (
                <tr key={`${studentCourse}-${studentPeriod}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base font-semibold text-gray-900">{studentCourse}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-900">{studentPeriod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                      ${studentGradingStatus === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}`}>
                      {studentGradingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleViewGrades(studentCourse, studentPeriod)}
                        variant={activeView.type === 'grades' && activeView.course === studentCourse && activeView.period === studentPeriod ? 'primary' : 'outline'}
                        className="shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold"
                      >
                        View My Grades
                      </Button>
                      <Button
                        variant={activeView.type === 'review' && activeView.course === studentCourse && activeView.period === studentPeriod ? 'primary' : 'outline'}
                        onClick={() => handleAskReview(studentCourse, studentPeriod)}
                        disabled={isDisabled}
                        className="shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold"
                      >
                        Ask for Review
                      </Button>
                      <Button 
                        variant={activeView.type === 'status' && activeView.course === studentCourse && activeView.period === studentPeriod ? 'primary' : 'ghost'}
                        onClick={() => handleViewReviewStatus(studentCourse, studentPeriod)}
                        disabled={isDisabled}
                        className="shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold"
                      >
                        View Review Status
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <span className="text-xl">✕</span>
              </Button>
            </div>
            
            {(() => {
              const courseGrades = getCurrentCourseGrades();
              if (!courseGrades) return null;

              const availableGrades = [
                { key: 'total' as const, value: courseGrades.total },
                { key: 'q1' as const, value: courseGrades.q1 },
                { key: 'q2' as const, value: courseGrades.q2 },
                { key: 'q3' as const, value: courseGrades.q3 },
                { key: 'q4' as const, value: courseGrades.q4 }
              ].filter(grade => grade.value !== null);

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
                        data={getGradeDistributionData(courseGrades, selectedGradeView)}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
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
                  onChange={(e) => handleFormChange('reviewMessage', e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitReviewRequest}
                  className="bg-blue-600 text-gray-900 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  submit grade review request
                </Button>
              </div>
            </div>
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
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <span className="text-xl">✕</span>
              </Button>
            </div>

            {sortedCourseDetails.find(d => d.studentCourse === activeView.course && d.studentPeriod === activeView.period)?.reviewRequest?.messages ? (
              <div className="space-y-4">
                {sortedCourseDetails
                  .find(d => d.studentCourse === activeView.course && d.studentPeriod === activeView.period)
                  ?.reviewRequest?.messages?.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-4 rounded-lg max-w-[80%] shadow-sm
                        ${msg.sender === 'student' 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-100 text-gray-900'}`}
                      >
                        <div className="text-sm font-semibold mb-1 flex justify-between items-center gap-4">
                          <span className="capitalize">{msg.sender}</span>
                          <span className="text-xs opacity-75">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">No review requests or messages available.</p>
                {!sortedCourseDetails.find(d => d.studentCourse === activeView.course && d.studentPeriod === activeView.period)?.studentReviewSubmitted && (
                  <Button 
                    variant="outline"
                    onClick={() => handleAskReview(activeView.course!, activeView.period!)}
                    className="mt-4"
                  >
                    Submit a Review Request
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}