import InstitutionNav from '@/app/ui/nav/InstitutionNav';


export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-200 h-200 bg-blue-800 flex">
      <aside className="w-50 bg-blue-200 border-r p-5">
        <InstitutionNav />
      </aside>
      <main className="flex-1 p-8 bg-yellow-100 text-gray-900">
        {children}
      </main>
    </div>
  );
}
