// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useState } from 'react';
// import { studentReviewReplies } from '@/app/lib/studentReviewStatus';
// import { Button } from '@/app/ui/common/Button';

// export default function ReviewRequestStatusPage() {
//   const params = useSearchParams();
//   const course = params.get('course') || studentReviewReplies.course;
//   const period = params.get('period') || studentReviewReplies.period;

//   const [acknowledged, setAcknowledged] = useState(false);

//   const handleAcknowledge = () => {
//     setAcknowledged(true);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold">📬 Status of Grade Review Requests</h1>
//         <p className="text-sm text-gray-600">Track your submitted grade review requests.</p>
//       </div>

//       {/* Review Header */}
//       <div className="bg-gray-200 p-4 rounded-md text-sm font-medium">
//         REVIEW REQUEST STATUS &nbsp;&nbsp;
//         <strong>{course} - {period}</strong>
//       </div>

//       {/* Instructor Message */}
//       <div className="bg-gray-100 p-4 rounded-md space-y-4">
//         <label className="text-sm font-medium">Message FROM instructor</label>
//         <textarea
//           readOnly
//           rows={5}
//           value={studentReviewReplies.instructorMessage}
//           className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
//         />
//         <div className="flex gap-4 justify-end">
//           <a
//             href={studentReviewReplies.attachmentUrl}
//             download
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
//           >
//             Download attachment
//           </a>
//           <Button onClick={handleAcknowledge}>Ack</Button>
//         </div>
//         {acknowledged && (
//           <div className="text-sm text-green-700 mt-2">✅ You have acknowledged the response.</div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { studentReviewReplies } from '@/app/lib/studentReviewStatus';
import { Button } from '@/app/ui/common/Button';

function ReviewStatusContent() {
  const params = useSearchParams();
  const course = params.get('course') || studentReviewReplies.course;
  const period = params.get('period') || studentReviewReplies.period;

  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📬 Status of Grade Review Requests
        </h1>
        <p className="text-gray-600 mt-2">Track your submitted grade review requests in real-time</p>
      </div>

      {/* Review Header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md text-sm font-medium backdrop-blur-sm">
        <span className="text-gray-700">REVIEW REQUEST STATUS</span> &nbsp;&nbsp;
        <strong className="text-blue-700">{course} - {period}</strong>
      </div>

      {/* Instructor Message */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4 hover:shadow-xl transition-shadow duration-300">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"></svg>
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          Message from Instructor
        </label>
        <textarea
          readOnly
          rows={5}
          value={studentReviewReplies.instructorMessage}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-4 justify-end">
          <a
            href={studentReviewReplies.attachmentUrl}
            download
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            
            Download attachment
          </a>
          <Button onClick={handleAcknowledge} 
            className="bg-green-600 hover:bg-green-700 transition-colors duration-200">
            Acknowledge
          </Button>
        </div>
        {acknowledged && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            You have acknowledged the response
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReviewRequestStatusPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ReviewStatusContent />
    </Suspense>
  );
}