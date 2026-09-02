import type { Metadata } from 'next';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: 'Hevn Admin — Control Center',
  description: 'Admin management tools and waitlist tracking dashboard for Hevn',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      {children}
    </div>
  );
}
