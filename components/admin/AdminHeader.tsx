'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '../../styles/admin/components.css';

// Premium SVG Icons
const Icons = {
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Moon: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  LogOut: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const getRelativeTime = (timestamp: any, fallback: string | undefined) => {
  const ts = Number(timestamp);
  if (!ts || isNaN(ts)) return fallback || 'Just now';
  
  const secondsDifference = Math.round((ts - Date.now()) / 1000);
  const absDiff = Math.abs(secondsDifference);
  
  if (absDiff < 60) return 'Just now';
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (absDiff < 3600) return rtf.format(Math.round(secondsDifference / 60), 'minute');
  if (absDiff < 86400) return rtf.format(Math.round(secondsDifference / 3600), 'hour');
  return rtf.format(Math.round(secondsDifference / 86400), 'day');
};

const AdminHeader = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('admin_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Initial empty state or welcome message
        setNotifications([{ id: 'welcome', text: 'Welcome to DailyInstruct Admin!', time: new Date().toLocaleTimeString(), read: false }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('admin_notifications_updated', loadNotifications);
    // Also sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'admin_notifications') loadNotifications();
    });
    return () => {
      window.removeEventListener('admin_notifications_updated', loadNotifications);
    };
  }, []);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('admin_notifications');
  };

  const markAsRead = (id: any) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
  };

  // =========== SUPABASE LOGOUT FUNCTION ===========
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };
  // =========== END LOGOUT FUNCTION ===========

  return (
    <header className="admin-header">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">Admin</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Dashboard</span>
      </div>

      {/* Right Side Controls */}
      <div className="header-controls">
        {/* Search */}
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search articles, categories..."
          />
          <button className="search-button">
            <span className="search-icon"><Icons.Search /></span>
          </button>
        </div>

        {/* Notifications */}
        <div className="notifications-container" ref={notificationsRef}>
          <button 
            className="notifications-button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
          >
            <span className="notification-icon"><Icons.Bell /></span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="notifications-dropdown" style={{ display: 'block' }}>
              <div className="notifications-header">
                <h3 className="notifications-title">Notifications</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="notifications-mark-read"
                    onClick={markAllAsRead}
                  >
                    Mark read
                  </button>
                  <button 
                    className="notifications-mark-read"
                    onClick={clearAllNotifications}
                    style={{ color: '#ef4444' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="notification-content">
                      <p className="notification-text">{notification.text}</p>
                      <span className="notification-time">
                        {getRelativeTime(notification.timestamp || notification.id, notification.time)}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="notification-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="notifications-footer">
                <button className="notifications-view-all">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-button gold-glow"
            onClick={() => router.push('/hq/articles/new')}
          >
            <span className="action-icon"><Icons.Zap /></span>
            <span className="action-text">Quick Publish</span>
          </button>
        </div>

        {/* User Menu */}
        <div className="user-menu" ref={userMenuRef}>
          <button 
            className="user-menu-button"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="user-avatar">
              <span className="avatar-text">AD</span>
            </div>
            <span className="user-name">Admin</span>
            <span className="user-arrow"><Icons.ChevronDown /></span>
          </button>
          
          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="user-dropdown" style={{ display: 'block' }}>
              <div className="user-dropdown-header">
                <div className="dropdown-avatar">
                  <span className="avatar-text">AD</span>
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-user-name">Admin User</span>
                  <span className="dropdown-user-email">admin@dailyinstruct.com</span>
                </div>
              </div>
              <div className="user-dropdown-menu">
                <button className="dropdown-item">
                  <span className="dropdown-icon"><Icons.User /></span>
                  <span className="dropdown-text">Profile Settings</span>
                </button>
                <button className="dropdown-item">
                  <span className="dropdown-icon"><Icons.Lock /></span>
                  <span className="dropdown-text">Security</span>
                </button>
                <button className="dropdown-item">
                  <span className="dropdown-icon"><Icons.Moon /></span>
                  <span className="dropdown-text">Dark Mode</span>
                </button>
                <div className="dropdown-divider"></div>
                {/* UPDATED LOGOUT BUTTON */}
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <span className="dropdown-icon"><Icons.LogOut /></span>
                  <span className="dropdown-text">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;