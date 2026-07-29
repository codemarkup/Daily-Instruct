'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../../styles/admin/components.css';

// Premium SVG Icons
const Icons = {
  Logo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--premium-gold)' }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>
  ),
  Articles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Categories: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Analytics: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  Utilities: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  )
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Icons.Dashboard />,
      path: '/hq',
      badge: null,
    },
    {
      title: 'Articles',
      icon: <Icons.Articles />,
      path: '/hq/articles',
      subItems: [
        { title: 'All Articles', path: '/hq/articles' },
        { title: 'New Article', path: '/hq/articles/new' },
        { title: 'Drafts', path: '/hq/articles/drafts' },
      ],
    },
    {
      title: 'Situation Trackers',
      icon: <Icons.Analytics />,
      path: '/hq/trackers',
      subItems: [
        { title: 'All Trackers', path: '/hq/trackers' },
        { title: 'New Tracker / Update', path: '/hq/trackers/new' },
      ],
    },
    {
      title: 'Categories',
      icon: <Icons.Categories />,
      path: '/hq/categories',
      badge: '5',
    },
    {
      title: 'Analytics',
      icon: <Icons.Analytics />,
      path: '/hq/analytics',
    },
    {
      title: 'Utilities',
      icon: <Icons.Utilities />,
      path: '/hq/utilities',
      subItems: [
        { title: 'Backup & Restore', path: '/hq/utilities/backup' },
        { title: 'SEO Tools', path: '/hq/utilities/seo' },
        { title: 'Cleanup', path: '/hq/utilities/cleanup' },
      ],
    },
    {
      title: 'Settings',
      icon: <Icons.Settings />,
      path: '/hq/settings',
      subItems: [
        { title: 'General', path: '/hq/settings' },
        { title: 'Homepage Config', path: '/hq/config' },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/hq') return pathname === '/hq';
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const isSubItemActive = (subItems: any[]) => {
    return subItems?.some(item => isActive(item.path));
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => setCollapsed(!collapsed)}>
          <div className="logo-icon"><Icons.Logo /></div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-primary">Daily Instruct</span>
            </div>
          )}
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.title} className="nav-section">
            <Link 
              href={item.path}
              className={`nav-item ${isActive(item.path) || (item.subItems && isSubItemActive(item.subItems)) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="nav-title">{item.title}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </>
              )}
              {item.subItems && !collapsed && (
                <span className="nav-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              )}
            </Link>
            
            {/* Sub Items */}
            {item.subItems && !collapsed && (
              <div className="sub-nav">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className={`sub-nav-item ${isActive(subItem.path) ? 'active' : ''}`}
                  >
                    <span className="sub-nav-title">{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="sidebar-stats">
          <div className="stats-header">
            <span className="stats-title">Quick Stats</span>
            <span className="stats-refresh" style={{ color: 'var(--text-muted)' }}><Icons.Refresh /></span>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value gold-text">48</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-value gold-text">12</span>
              <span className="stat-label">Featured</span>
            </div>
            <div className="stat-card">
              <span className="stat-value gold-text">3</span>
              <span className="stat-label">Drafts</span>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <span className="avatar-text">AD</span>
        </div>
        {!collapsed && (
          <div className="profile-info">
            <span className="profile-name">Admin User</span>
            <span className="profile-role gold-text">Super Admin</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;