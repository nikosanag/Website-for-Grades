import StudentNav from '@/app/ui/nav/StudentNav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-screen max-h-screen bg-blue-800 flex">
      <aside className="max-w-screen max-h-screen bg-blue-200 border-r p-5">
        <StudentNav />
      </aside>
      <main className="flex-1 max-w-screen max-h-screen p-8 bg-yellow-100 text-gray-900">
        {children}
      </main>
    </div>
  );
}
