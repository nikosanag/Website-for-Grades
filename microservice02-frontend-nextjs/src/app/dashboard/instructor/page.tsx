"use client";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/30">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-800 to-blue-600 bg-clip-text text-transparent">
            Welcome, Instructor!
          </h1>
          <p className="text-lg text-gray-700 mt-3 max-w-xl">
            As a teacher, you can post initial and final grades, view detailed grade statistics, and answer student questions. Use the shortcuts below or the menu on the left to quickly access each section.
          </p>
        </div>
        <div className="hidden md:block">
          <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#EEF2FF" stroke="#6366F1" strokeWidth="6" />
            <rect x="30" y="60" width="40" height="10" rx="5" fill="#6366F1" fillOpacity="0.15" />
            <circle cx="50" cy="42" r="14" fill="#6366F1" fillOpacity="0.7" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Post Initial Grades */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-6 border border-white/20 flex flex-col items-center justify-center min-h-[180px]">
          <div className="mb-3">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#6366F1" fillOpacity="0.12"/><path d="M12 28v-8a4 4 0 014-4h8a4 4 0 014 4v8" stroke="#6366F1" strokeWidth="2"/><rect x="16" y="16" width="8" height="8" rx="2" fill="#6366F1" fillOpacity="0.7"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">Post Initial Grades</h2>
          <p className="text-gray-600 text-center mb-3">Submit the initial grades for your courses.</p>
          <button onClick={() => router.push('/dashboard/instructor/post-initial')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Go</button>
        </div>
        {/* Post Final Grades */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-6 border border-white/20 flex flex-col items-center justify-center min-h-[180px]">
          <div className="mb-3">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#16B981" fillOpacity="0.12"/><path d="M12 28v-8a4 4 0 014-4h8a4 4 0 014 4v8" stroke="#16B981" strokeWidth="2"/><rect x="16" y="16" width="8" height="8" rx="2" fill="#16B981" fillOpacity="0.7"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-green-800 mb-2">Post Final Grades</h2>
          <p className="text-gray-600 text-center mb-3">Submit the final grades for your courses.</p>
          <button onClick={() => router.push('/dashboard/instructor/post-final')} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Go</button>
        </div>
        {/* View Grade Statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-6 border border-white/20 flex flex-col items-center justify-center min-h-[180px]">
          <div className="mb-3">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#F59E42" fillOpacity="0.12"/><rect x="12" y="22" width="4" height="8" rx="2" fill="#F59E42"/><rect x="18" y="16" width="4" height="14" rx="2" fill="#F59E42"/><rect x="24" y="10" width="4" height="20" rx="2" fill="#F59E42"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">View Grade Statistics</h2>
          <p className="text-gray-600 text-center mb-3">Analyze grade distributions and trends.</p>
          <button onClick={() => router.push('/dashboard/instructor/stats')} className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">Go</button>
        </div>
        {/* See & Answer Review Requests */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-6 border border-white/20 flex flex-col items-center justify-center min-h-[180px]">
          <div className="mb-3">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#6366F1" fillOpacity="0.12"/><path d="M20 28c4.418 0 8-2.686 8-6s-3.582-6-8-6-8 2.686-8 6c0 1.657 1.343 3.156 3.5 4.156V32l4.5-2c.5.033 1 .033 1.5 0l4.5 2v-3.844C26.657 25.156 28 23.657 28 22c0-3.314-3.582-6-8-6z" fill="#6366F1" fillOpacity="0.7"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">See & Answer Review Requests</h2>
          <p className="text-gray-600 text-center mb-3">See and answer your review requests.</p>
          <button onClick={() => router.push('/dashboard/instructor/review-requests')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Go</button>
        </div>
      </div>
    </div>
  );
}
