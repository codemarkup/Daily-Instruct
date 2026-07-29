'use client';

import React, { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '../../styles/admin/admin.css';
import '../../styles/admin/animations.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // FORCE HIDE with inline styles (most reliable)
    const mainNavbar = document.querySelector('.navbar') as HTMLElement | null;
    const mainFooter = document.querySelector('.footer') as HTMLElement | null;
    const mainElement = document.querySelector('main') as HTMLElement | null;
    
    if (mainNavbar) {
      mainNavbar.style.display = 'none';
      mainNavbar.style.visibility = 'hidden';
      mainNavbar.style.opacity = '0';
      mainNavbar.style.position = 'absolute';
      mainNavbar.style.zIndex = '-1000';
    }
    
    if (mainFooter) {
      mainFooter.style.display = 'none';
      mainFooter.style.visibility = 'hidden';
      mainFooter.style.opacity = '0';
    }
    
    if (mainElement) {
      mainElement.style.paddingTop = '0';
      mainElement.style.marginTop = '0';
    }
    
    // Add admin class
    document.body.classList.add('admin-page');
    
    // Set body background to admin color
    document.body.style.background = '#0a0a0a';
    document.body.style.color = '#ffffff';
    
    return () => {
      if (mainNavbar) {
        mainNavbar.style.display = '';
        mainNavbar.style.visibility = '';
        mainNavbar.style.opacity = '';
        mainNavbar.style.position = '';
        mainNavbar.style.zIndex = '';
      }
      if (mainFooter) {
        mainFooter.style.display = '';
        mainFooter.style.visibility = '';
        mainFooter.style.opacity = '';
      }
      if (mainElement) {
        mainElement.style.paddingTop = '';
        mainElement.style.marginTop = '';
      }
      document.body.classList.remove('admin-page');
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
        <footer className="admin-footer">
          <p className="footer-text">Daily Instruct Control Room © 2026</p>
          <div className="footer-status">
            <span className="status-indicator active"></span>
            <span className="status-text">System Online</span>
          </div>
        </footer>
      </div>
    </div>
  );
}