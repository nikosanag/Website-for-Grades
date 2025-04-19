'use client';

import {
  studentStatsTable,
  studentChartData
} from '@/app/lib/studentStats';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/common/Button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
export default function ViewPersonalGradesPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 animate-fadeIn bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="transform hover:scale-105 transition-transform duration-200 group">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 View Personal Grades
          </h1>
          <p className="text-sm text-gray-600 italic group-hover:text-indigo-600 transition-colors duration-200">
            Visualize your academic performance journey
          </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/student/courses')}
          className="hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        >
          Explore My Courses
        </Button>
      </div>

      {/* Course Table */}
      <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-8 overflow-x-auto backdrop-blur-md hover:shadow-2xl transition-all duration-300 border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Course Performance Overview
        </h2>
        <div className="min-w-full">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
              <tr>
                {["Course Name", "Exam Period", "Initial Grades", "Final Grades"].map((header) => (
                  <th key={header} className="p-4 border border-indigo-200 font-semibold text-indigo-800">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentStatsTable.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-indigo-50/50 transition-colors duration-300">
                  <td className="p-4 border border-indigo-200">{row.studentCourse}</td>
                  <td className="p-4 border border-indigo-200">{row.studentPeriod}</td>
                  <td className="p-4 border border-indigo-200">{row.studentInitialGrades}</td>
                  <td className="p-4 border border-indigo-200">{row.studentFinalGrades || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Summary Chart */}
      <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-8 hover:shadow-2xl transition-all duration-300 border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {studentChartData.main.title}
        </h2>
        <div className="h-[400px]">
          <Bar
            data={{
              labels: studentChartData.main.labels,
              datasets: [{
                label: 'Students',
                data: studentChartData.main.values,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              plugins: {
                tooltip: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#4F46E5',
                  bodyColor: '#4B5563',
                  borderColor: '#E0E7FF',
                  borderWidth: 1,
                  padding: 12,
                  cornerRadius: 8
                }
              }
            }}
          />
        </div>
      </div>

      {/* Per-Question Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentChartData.questions.map((q, index) => (
          <div 
            key={q.title}
            className="bg-white/80 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-indigo-100 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {q.title}
            </h3>
            <div className="h-[250px]">
              <Bar
                data={{
                  labels: q.labels,
                  datasets: [{
                    label: 'Score',
                    data: q.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      titleColor: '#059669',
                      bodyColor: '#4B5563',
                      borderColor: '#D1FAE5',
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8
                    }
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}