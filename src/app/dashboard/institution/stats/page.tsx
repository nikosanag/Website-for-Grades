'use client';

import { courseStatsTable, chartData } from '@/app/lib/institutionStatsData';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function InstitutionStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">📊 View Grade Statistics</h1>
        <p className="text-sm text-gray-600">
          Analyze grading patterns and institutional performance data.
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
            {courseStatsTable.map((row) => (
              <tr key={row.course} className="border-t">
                <td className="p-2 border">{row.course}</td>
                <td className="p-2 border">{row.period}</td>
                <td className="p-2 border">{row.initialGrades}</td>
                <td className="p-2 border">{row.finalGrades || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Grade Chart */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="text-md font-semibold mb-2">{chartData.main.title}</h2>
        <Bar
          data={{
            labels: chartData.main.labels,
            datasets: [
              {
                label: 'ΤΕΛΙΚΟΣ ΒΑΘΜΟΣ',
                data: chartData.main.values,
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
              }
            ]
          }}
          height={120}
        />
      </div>

      {/* Sub-Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.questions.map((q) => (
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
