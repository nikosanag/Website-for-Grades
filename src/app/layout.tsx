// File: /app/layout.tsx
import './globals.css';
import TopNav from '@/app/ui/nav/TopNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full">
        <TopNav/>
        <div className="h-500 w-full bg-yellow-100">{children}</div>
      </body>
    </html>
  );
}
