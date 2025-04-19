// 'use client';

// import { useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { studentReviewRequestForm } from '@/app/lib/studentReviewRequestForm';
// import { Button } from '@/app/ui/common/Button';

// export default function GradeReviewRequestPage() {
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const params = useSearchParams();
//   const course = params.get('course') || 'Unknown Course';
//   const period = params.get('period') || 'Current Period';

//   const handleChange = (key: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = () => {
//     if (!formData.studentReviewMessage) {
//       setMessage('❌ Please provide a message.');
//       return;
//     }

//     console.log('Submitted review request:', {
//       course,
//       period,
//       ...formData
//     });

//     setMessage(`✅ Review request submitted for ${course} - ${period}`);

//     // Optional redirect after short delay
//     setTimeout(() => {
//       router.push('/dashboard/student/courses');
//     }, 1500);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold">✍️ Grade Review Request</h1>
//         <p>Submit a request to review a specific grade.</p>
//       </div>

//       {/* Context Header */}
//       <div className="bg-gray-200 p-4 rounded-md text-sm font-medium">
//         NEW REVIEW REQUEST &nbsp;&nbsp;
//         <strong>{course} - {period}</strong>
//       </div>

//       {/* Form */}
//       <div className="bg-gray-100 p-4 rounded-md space-y-4">
//         {studentReviewRequestForm.map((field) => (
//           <div key={field.key}>
//             <label className="block text-sm font-medium mb-1">{field.label}</label>
//             <textarea
//               rows={5}
//               placeholder={field.placeholder}
//               value={formData[field.key] || ''}
//               onChange={(e) => handleChange(field.key, e.target.value)}
//               className="w-full border border-gray-400 rounded px-3 py-2"
//             />
//           </div>
//         ))}
//         <Button onClick={handleSubmit}>submit grade review request</Button>
//       </div>

//       {/* Message Area */}
//       <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
//         {message || 'Message area'}
//       </div>
//     </div>
//   );
// }


'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { studentReviewRequestForm } from '@/app/lib/studentReviewRequestForm';
import { Button } from '@/app/ui/common/Button';

function ReviewRequestContent() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  
  const course = params.get('course') || 'Unknown Course';
  const period = params.get('period') || 'Current Period';

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.studentReviewMessage) {
      setMessage('❌ Please provide a message.');
      return;
    }

    console.log('Submitted review request:', {
      course,
      period,
      ...formData
    });

    setMessage(`✅ Review request submitted for ${course} - ${period}`);

    setTimeout(() => {
      router.push('/dashboard/student/courses');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">✍️ Grade Review Request</h1>
        <p>Submit a request to review a specific grade.</p>
      </div>

      <div className="bg-gray-200 p-4 rounded-md text-sm font-medium">
        NEW REVIEW REQUEST &nbsp;&nbsp;
        <strong>{course} - {period}</strong>
      </div>

      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        {studentReviewRequestForm.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <textarea
              rows={5}
              placeholder={field.placeholder}
              value={formData[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>
        ))}
        <Button onClick={handleSubmit}>submit grade review request</Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
        {message || 'Message area'}
      </div>
    </div>
  );
}

export default function GradeReviewRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewRequestContent />
    </Suspense>
  );
}