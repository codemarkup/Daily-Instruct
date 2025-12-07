'use client';

import React, { useState } from 'react';
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
    {
      title: 'Analytics',
      icon: '📈',
      path: '/admin/analytics',
    },
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

  const isActive = (path: string) => {
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
          <div className="logo-icon">👑</div>
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