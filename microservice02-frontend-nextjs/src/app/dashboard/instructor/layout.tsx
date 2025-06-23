import InstructorNav from '@/app/ui/nav/InstructorNav';
import ProtectedRoute from '@/app/ui/common/ProtectedRoute';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="instructor">
      <div className="min-h-[calc(100vh-48px)] w-full flex">
        <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-indigo-100">
          <div className="sticky top-0 p-5">
            <InstructorNav />
          </div>
        </aside>
        <main className="flex-1 p-6 lg:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
