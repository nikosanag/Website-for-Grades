// File: /app/layout.tsx
import './globals.css';
import TopNav from '@/app/ui/nav/TopNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 text-gray-900 antialiased">
        <TopNav />
        <main className="min-h-[calc(100vh-48px)] w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
