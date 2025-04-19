'use client';

import { instructorReviewRequests } from '@/app/lib/instructorReviewRequests';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/common/Button';

export default function ReviewRequestsPage() {
  const router = useRouter();

  const handleReply = (id: string) => {
    router.push(`/dashboard/instructor/reply-reviews?id=${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">🔍 Review Requests</h1>
        <p>View all grade review requests submitted by students.</p>
      </div>

      <div className="bg-white rounded-md shadow-md p-4">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Course Name</th>
              <th className="p-2 border">Exam Period</th>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {instructorReviewRequests.map((req) => (
              <tr key={req.id} className="border-t">
                <td className="p-2 border">{req.instructorCourse}</td>
                <td className="p-2 border">{req.instructorPeriod}</td>
                <td className="p-2 border capitalize">{req.instructorStudent}</td>
                <td className="p-2 border">
                  <Button onClick={() => handleReply(req.id)}>Reply</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
