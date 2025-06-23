import ProtectedRoute from '@/app/ui/common/ProtectedRoute';

export default function StudentLayout({ children }: { children: React.ReactNode }) {  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-[calc(100vh-48px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
