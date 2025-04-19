'use client';

import {
  instructorStatsTable,
  instructorChartData
} from '@/app/lib/instructorStats';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function InstructorStatisticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">📊 View Grade Statistics</h1>
        <p className="text-sm text-gray-600">
          Statistical breakdown of course grades and performance.
        </p>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="font-semibold mb-3">Available course statistics</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Course Name</th>
              <th className="p-2 border">Exam Period</th>
              <th className="p-2 border">Initial Grades</th>
              <th className="p-2 border">Final Grades</th>
            </tr>
          </thead>
          <tbody>
            {instructorStatsTable.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 border">{row.instructorCourse}</td>
                <td className="p-2 border">{row.instructorPeriod}</td>
                <td className="p-2 border">{row.instructorInitialGrades}</td>
                <td className="p-2 border">
                  {row.instructorFinalGrades || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Grade Chart */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="text-md font-semibold mb-2">
          {instructorChartData.main.title}
        </h2>
        <Bar
          data={{
            labels: instructorChartData.main.labels,
            datasets: [
              {
                label: 'ΤΕΛΙΚΟΣ ΒΑΘΜΟΣ',
                data: instructorChartData.main.values,
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
              }
            ]
          }}
          height={120}
        />
      </div>

      {/* Sub-Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {instructorChartData.questions.map((q) => (
          <div key={q.title} className="bg-white rounded-md shadow-md p-4">
            <h3 className="text-sm font-semibold mb-2">{q.title}</h3>
            <Bar
              data={{
                labels: q.labels,
                datasets: [
                  {
                    label: 'Responses',
                    data: q.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)'
                  }
                ]
              }}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
