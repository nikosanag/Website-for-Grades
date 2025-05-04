'use client';

import { useState } from 'react';
import { studentStatsTable, studentChartData, ChartData } from '@/app/lib/studentStats';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

export default function StudentDashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  // derive chart data for the selected course
  const chartDataForSelected: ChartData | null = selectedCourse
    ? studentChartData[selectedCourse.toLowerCase()]
    : null;

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
          onClick={() => window.location.href = '/dashboard/student/courses'}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl 
                   hover:from-blue-800 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200
                   shadow-md hover:shadow-xl active:scale-95"
        >
          See My Courses
        </button>
      </div>

      {/* Course Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Exam Period</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Initial Grades Submission</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Final Grades Submission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentStatsTable.map((course) => (
                  <tr 
                    key={`${course.studentCourse}-${course.studentPeriod}`}
                    onClick={() => setSelectedCourse(course.studentCourse)} 
                    className={`cursor-pointer transition-colors duration-150 ${
                      selectedCourse === course.studentCourse 
                        ? 'bg-indigo-100/70' 
                        : 'hover:bg-blue-50/70'
                    }`}
                  >
                    <td className="p-2 border text-gray-900">{course.studentCourse}</td>
                    <td className="p-2 border text-gray-900">{course.studentPeriod}</td>
                    <td className="p-2 border text-gray-900">{course.studentInitialGrades}</td>
                    <td className="p-2 border text-gray-900">{course.studentFinalGrades || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {chartDataForSelected && (
        <div className="space-y-6">
          {/* Main Grade Distribution */}
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

          {/* Question-specific Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartDataForSelected.questions.slice(0, 4).map((question) => (
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