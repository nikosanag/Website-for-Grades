import InstitutionNav from '@/app/ui/nav/InstitutionNav';

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-48px)] w-full flex">
      <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-indigo-100">
        <div className="sticky top-0 p-5">
          <InstitutionNav />
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 bg-transparent">
        {children}
      </main>
    </div>
  );
}
