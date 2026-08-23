import AdminNav from '@/components/AdminNav';

export const metadata = {
  title: 'MKB DIGITAL ADMIN | Owner Management Console',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060b08] text-slate-100 flex flex-col">
      <AdminNav />
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </div>
    </div>
  );
}
