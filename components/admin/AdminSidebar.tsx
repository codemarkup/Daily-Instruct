'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../../styles/admin/components.css';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin',
      badge: null,
    },
    {
      title: 'Articles',
      icon: '📝',
      path: '/admin/articles',
      subItems: [
        { title: 'All Articles', path: '/admin/articles' },
        { title: 'New Article', path: '/admin/articles/new' },
        // { title: 'Drafts', path: '/admin/articles?status=draft', badge: '3' },
        // { title: 'Scheduled', path: '/admin/articles?status=scheduled', badge: '2' },
      ],
    },
    {
      title: 'Categories',
      icon: '📁',
      path: '/admin/categories',
      badge: '4',
    },
    // {
    //   title: 'Analytics',
    //   icon: '📈',
    //   path: '/admin/analytics',
    // },
    {
      title: 'Utilities',
      icon: '🔧',
      path: '/admin/utilities',
      subItems: [
        { title: 'Backup & Restore', path: '/admin/utilities/backup' },
        { title: 'SEO Tools', path: '/admin/utilities/seo' },
        { title: 'Cleanup', path: '/admin/utilities/cleanup' },
      ],
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
    },
  ];

  const sidebarRef = React.useRef<HTMLElement>(null);

  // Initialize state - default to collapsed on mobile if window exists
  // We use useEffect to avoid hydration mismatch
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Optional: Auto-collapse on resize to mobile
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close sidebar on all screens
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside sidebar and sidebar is NOT collapsed (expanded)
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !collapsed) {
        setCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [collapsed]);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const isSubItemActive = (subItems: any[]) => {
    return subItems?.some(item => isActive(item.path));
  };

  return (
    <aside ref={sidebarRef} className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => setCollapsed(!collapsed)}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="url(#bg-gradient)" fillOpacity="0.2" />
              <path d="M12 10H19C24.5228 10 29 14.4772 29 20C29 25.5228 24.5228 30 19 30H12V10Z" stroke="url(#logo-gradient)" strokeWidth="3" />
              <path d="M15 10V30" stroke="url(#logo-gradient)" strokeWidth="3" />
              <defs>
                <linearGradient id="bg-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#000" />
                </linearGradient>
                <linearGradient id="logo-gradient" x1="12" y1="10" x2="29" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#FFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-primary">Daily Instruct</span>
              {/* <span className="logo-secondary">Instruct</span> */}
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
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
                <span className="nav-arrow">▼</span>
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
                    {/* {subItem.badge && (
                      <span className="sub-nav-badge">{subItem.badge}</span>
                    )} */}
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
            <span className="stats-refresh">🔄</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value gold-text">48</span>
              <span className="stat-label">Total Articles</span>
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