'use client';

import { studentCourseList } from '@/app/lib/studentCourses';
import { Button } from '@/app/ui/common/Button';
import { useRouter } from 'next/navigation';

export default function StudentCoursesPage() {
  const router = useRouter();
  
  return (
    <div className="h-full w-full p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">📚 My Courses</h1>
        <p>View your enrolled courses and their status.</p>
      </div>

      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">Course Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Exam Period</th>
              <th className="px-4 py-2 whitespace-nowrap">Grading Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentCourseList.map((course, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{course.studentCourse}</td>
                <td className="px-4 py-2">{course.studentPeriod}</td>
                <td className="px-4 py-2 capitalize">{course.studentGradingStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => router.push(`/dashboard/student/grades?course=${course.studentCourse}`)}
                    >
                      view my grades
                    </Button>

                    {course.studentGradingStatus === 'open' && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/dashboard/student/request-review?course=${course.studentCourse}&period=${course.studentPeriod}`
                          )
                        }
                      >
                        ask for review
                      </Button>
                    )}

                    {(course.studentReviewSubmitted || course.studentGradingStatus === 'closed') && (
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/student/review-status?course=${course.studentCourse}`)}
                      >
                        view review status
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
