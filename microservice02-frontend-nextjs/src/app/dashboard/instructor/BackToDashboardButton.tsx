"use client";
import { useRouter } from "next/navigation";

export default function BackToDashboardButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/dashboard/instructor')}
      className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow hover:from-indigo-700 hover:to-blue-700 transition font-semibold"
    >
      ← Back to Dashboard
    </button>
  );
}
