// 'use client';

// import { useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { instructorReviewRequests } from '@/app/lib/instructorReviewRequests';
// import { instructorReplyOptions } from '@/app/lib/instructorReviewReply';
// import { Button } from '@/app/ui/common/Button';

// export default function ReplyToReviewsPage() {
//   const searchParams = useSearchParams();
//   const requestId = searchParams.get('id');
//   const request = instructorReviewRequests.find((r) => r.id === requestId);

//   const [formData, setFormData] = useState<Record<string, string>>({
//     instructorReplyAction: 'Total accept',
//     instructorReplyMessage: ''
//   });
//   const [fileName, setFileName] = useState('');
//   const [message, setMessage] = useState('');

//   const handleChange = (key: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       setMessage(`✅ Attached file: ${file.name}`);
//     }
//   };

//   const handleSubmit = () => {
//     if (!formData.instructorReplyMessage) {
//       setMessage('❌ Message cannot be empty');
//       return;
//     }

//     console.log('Reply Submitted:', {
//       ...formData,
//       instructorReplyAttachment: fileName,
//       ...request
//     });

//     setMessage(`✅ Reply sent to ${request?.instructorStudent}`);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold">✉️ Reply to Review Requests</h1>
//         <p>Respond to students who requested a review of their grades.</p>
//       </div>

//       {request && (
//         <div className="bg-gray-200 p-4 rounded-md space-y-4">
//           <div className="text-sm">
//             <strong>REPLY TO GRADE REVIEW REQUEST</strong><br />
//             {request.instructorCourse} &nbsp;|&nbsp; {request.instructorPeriod} &nbsp;|&nbsp; {request.instructorStudent}
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Action</label>
//             <select
//               value={formData.instructorReplyAction}
//               onChange={(e) => handleChange('instructorReplyAction', e.target.value)}
//               className="w-full border border-gray-400 px-3 py-2 rounded"
//             >
//               {instructorReplyOptions.map((opt) => (
//                 <option key={opt}>{opt}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Instructors message</label>
//             <textarea
//               rows={4}
//               className="w-full border border-gray-400 px-3 py-2 rounded"
//               placeholder="Write your response..."
//               value={formData.instructorReplyMessage}
//               onChange={(e) => handleChange('instructorReplyMessage', e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <input type="file" onChange={handleFileUpload} />
//             <Button onClick={handleSubmit}>Upload reply attachment</Button>
//           </div>
//         </div>
//       )}

//       <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
//         {message || 'Message area'}
//       </div>
//     </div>
//   );
// }

'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { instructorReviewRequests } from '@/app/lib/instructorReviewRequests';
import { instructorReplyOptions } from '@/app/lib/instructorReviewReply';
import { Button } from '@/app/ui/common/Button';

function ReplyContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const request = instructorReviewRequests.find((r) => r.id === requestId);

  const [formData, setFormData] = useState<Record<string, string>>({
    instructorReplyAction: 'Total accept',
    instructorReplyMessage: ''
  });
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMessage(`✅ Attached file: ${file.name}`);
    }
  };

  const handleSubmit = () => {
    if (!formData.instructorReplyMessage) {
      setMessage('❌ Message cannot be empty');
      return;
    }

    console.log('Reply Submitted:', {
      ...formData,
      instructorReplyAttachment: fileName,
      ...request
    });

    setMessage(`✅ Reply sent to ${request?.instructorStudent}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">✉️ Reply to Review Requests</h1>
        <p>Respond to students who requested a review of their grades.</p>
      </div>

      {request && (
        <div className="bg-gray-200 p-4 rounded-md space-y-4">
          <div className="text-sm">
            <strong>REPLY TO GRADE REVIEW REQUEST</strong><br />
            {request.instructorCourse} &nbsp;|&nbsp; {request.instructorPeriod} &nbsp;|&nbsp; {request.instructorStudent}
          </div>

          <div>
            <label className="block text-sm mb-1">Action</label>
            <select
              value={formData.instructorReplyAction}
              onChange={(e) => handleChange('instructorReplyAction', e.target.value)}
              className="w-full border border-gray-400 px-3 py-2 rounded"
            >
              {instructorReplyOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Instructors message</label>
            <textarea
              rows={4}
              className="w-full border border-gray-400 px-3 py-2 rounded"
              placeholder="Write your response..."
              value={formData.instructorReplyMessage}
              onChange={(e) => handleChange('instructorReplyMessage', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <input type="file" onChange={handleFileUpload} />
            <Button onClick={handleSubmit}>Upload reply attachment</Button>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}

export default function ReplyToReviewsPage() {
  return (
    <Suspense fallback={<div>Loading reply form...</div>}>
      <ReplyContent />
    </Suspense>
  );
}