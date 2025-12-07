'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/admin/components.css';

const AdminHeader = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New comment on "AI Revolution"', time: '5 min ago', read: false },
    { id: 2, text: 'Scheduled article published', time: '1 hour ago', read: false },
    { id: 3, text: 'Backup completed successfully', time: '2 hours ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

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
            <span className="search-icon">🔍</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="notifications-container">
          <button className="notifications-button">
            <span className="notification-icon">🔔</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3 className="notifications-title">Notifications</h3>
              <button 
                className="notifications-mark-read"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <p className="notification-text">{notification.text}</p>
                    <span className="notification-time">{notification.time}</span>
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
        </div>

        {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-button gold-glow"
          onClick={() => router.push('/admin/articles/new')} // ADD THIS
        >
          <span className="action-icon">⚡</span>
          <span className="action-text">Quick Publish</span>
        </button>
      </div>

        {/* User Menu */}
        <div className="user-menu">
          <button className="user-menu-button">
            <div className="user-avatar">
              <span className="avatar-text">AD</span>
            </div>
            <span className="user-name">Admin</span>
            <span className="user-arrow">▼</span>
          </button>
          
          {/* User Dropdown */}
          <div className="user-dropdown">
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
                <span className="dropdown-icon">👤</span>
                <span className="dropdown-text">Profile Settings</span>
              </button>
              <button className="dropdown-item">
                <span className="dropdown-icon">🔒</span>
                <span className="dropdown-text">Security</span>
              </button>
              <button className="dropdown-item">
                <span className="dropdown-icon">🌙</span>
                <span className="dropdown-text">Dark Mode</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout">
                <span className="dropdown-icon">🚪</span>
                <span className="dropdown-text">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;