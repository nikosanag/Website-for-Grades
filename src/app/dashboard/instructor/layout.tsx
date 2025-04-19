import InstructorNav from '@/app/ui/nav/InstructorNav';
export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      <aside className="w-64 bg-blue-200 border-r p-5">
        <InstructorNav />
      </aside>
      <main className="flex-1 p-8 bg-yellow-100 text-gray-900">
        {children}
      </main>
    </div>
  );
}
