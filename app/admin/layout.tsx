import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader'; // No LogoutButton import
import '../../styles/admin/admin.css';
import '../../styles/admin/animations.css';

export const metadata = {
  title: 'Admin Control Room | Daily Instruct',
  description: 'Luxury admin dashboard for Daily Instruct',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        {/* Remove the extra container and logout button */}
        <AdminHeader /> {/* Logout is now inside AdminHeader */}
        <main className="admin-content">
          {children}
        </main>
        <footer className="admin-footer">
          <p className="footer-text">Daily Instruct Control Room © 2024</p>
          <div className="footer-status">
            <span className="status-indicator active"></span>
            <span className="status-text">System Online</span>
          </div>
        </footer>
      </div>
    </div>
  );
}