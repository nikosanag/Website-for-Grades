// 'use client';

// import { Suspense } from 'react';
// import {
//   studentGradeDetails,
//   studentGradeHistogram,
//   studentGradeChartQ1
// } from '@/app/lib/studentGrades';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { useSearchParams } from 'next/navigation';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// export default function ViewPersonalGradesPage() {
//   const params = useSearchParams();
//   const course = params.get('course') || studentGradeDetails.course;
//   const period = params.get('period') || studentGradeDetails.period;

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-xl font-semibold">🧾 View Personal Grades</h1>
//         <p className="text-sm text-gray-600">
//           See detailed grades for each enrolled course.
//         </p>
//       </div>

//       {/* Grade Breakdown */}
//       <div className="bg-white rounded-md shadow-md p-4">
//         <h2 className="text-sm font-semibold mb-2">
//           My Grades &nbsp;•&nbsp; {course} - {period}
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {Object.entries(studentGradeDetails.grades).map(([key, val]) => (
//             <div key={key} className="flex flex-col">
//               <label className="text-xs font-semibold capitalize">{key}</label>
//               <input
//                 className="border border-gray-300 rounded px-2 py-1"
//                 value={val}
//                 readOnly
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Histogram */}
//       <div className="bg-white rounded-md shadow-md p-4">
//         <h2 className="text-sm font-semibold mb-2">{studentGradeHistogram.title}</h2>
//         <Bar
//           data={{
//             labels: studentGradeHistogram.labels,
//             datasets: [
//               {
//                 label: 'Final Grade Distribution',
//                 data: studentGradeHistogram.values,
//                 backgroundColor: 'rgba(59, 130, 246, 0.6)'
//               }
//             ]
//           }}
//           height={120}
//         />
//       </div>

//       {/* Q1 Bar Chart */}
//       <div className="bg-white rounded-md shadow-md p-4">
//         <h2 className="text-sm font-semibold mb-2">{studentGradeChartQ1.title}</h2>
//         <Bar
//           data={{
//             labels: studentGradeChartQ1.labels,
//             datasets: [
//               {
//                 label: 'Q1 Scores',
//                 data: studentGradeChartQ1.values,
//                 backgroundColor: 'rgba(34, 197, 94, 0.6)'
//               }
//             ]
//           }}
//           height={100}
//         />
//       </div>
//     </div>
//   );
// }
'use client';

import { Suspense } from 'react';
import {
  studentGradeDetails,
  studentGradeHistogram,
  studentGradeChartQ1
} from '@/app/lib/studentGrades';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSearchParams } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function GradesContent() {
  const params = useSearchParams();
  const course = params.get('course') || studentGradeDetails.course;
  const period = params.get('period') || studentGradeDetails.period;

  return (
    <div className="grid grid-cols-1 gap-6 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-sm font-bold mb-3 text-indigo-600 flex items-center">
          <span className="mr-2">📊</span>
          My Grades • {course} - {period}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(studentGradeDetails.grades).map(([key, val]) => (
            <div key={key} className="flex flex-col group">
              <label className="text-xs font-semibold capitalize text-gray-600">{key}</label>
              <input
                className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 
                         group-hover:border-indigo-300 group-hover:bg-white transition-all duration-200"
                value={val}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-sm font-bold mb-3 text-indigo-600 flex items-center">
          <span className="mr-2">📈</span>
          {studentGradeHistogram.title}
        </h2>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Bar
            data={{
              labels: studentGradeHistogram.labels,
              datasets: [{
                label: 'Final Grade Distribution',
                data: studentGradeHistogram.values,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
              }]
            }}
            height={90}
            options={{ 
              maintainAspectRatio: true,
              animation: {
                duration: 2000
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-sm font-bold mb-3 text-indigo-600 flex items-center">
          <span className="mr-2">📊</span>
          {studentGradeChartQ1.title}
        </h2>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Bar
            data={{
              labels: studentGradeChartQ1.labels,
              datasets: [{
                label: 'Q1 Scores',
                data: studentGradeChartQ1.values,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
              }]
            }}
            height={90}
            options={{ 
              maintainAspectRatio: true,
              animation: {
                duration: 2000
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ViewPersonalGradesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold flex items-center">
          <span className="text-2xl mr-3">🧾</span>
          View Personal Grades
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Track your academic progress with detailed grade insights
        </p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }>
        <GradesContent />
      </Suspense>
    </div>
  );
}
