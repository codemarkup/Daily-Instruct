'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/admin/components.css';

import { AdminService } from '../../services/admin-service';

const AdminHeader = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const results = await AdminService.getArticles(undefined, searchQuery);
          setSearchResults(results.slice(0, 5)); // Limit to 5 results
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  // Poll for notifications
  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead' }),
      });
      // specific update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications read', error);
    }
  };

  // =========== ADD LOGOUT FUNCTION ===========
  const handleLogout = async () => {
    try {
      // Clear the cookie on client side
      document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Also call API to clear server-side
      await fetch("/api/admin/auth", { method: "DELETE" });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect anyway
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
        {/* Search */}
        <div className="search-container" style={{ position: 'relative' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search articles, categories..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (searchQuery.length > 1) setShowResults(true);
            }}
          />
          <button className="search-button">
            <span className="search-icon">🔍</span>
          </button>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="search-dropdown" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'rgba(10, 10, 10, 0.95)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '8px',
              marginTop: '8px',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              {isSearching ? (
                <div style={{ padding: '12px', color: '#888', textAlign: 'center' }}>Searching...</div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map(article => (
                    <div
                      key={article.id}
                      onClick={() => {
                        router.push(`/admin/articles/edit/${article.slug}`);
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{article.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '4px' }}>
                        <span>{article.category}</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '12px', color: '#888', textAlign: 'center' }}>No results found</div>
              )}
            </div>
          )}
          {/* Overlay to close on click outside */}
          {showResults && (
            <div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
              onClick={() => setShowResults(false)}
            />
          )}
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
            onClick={() => router.push('/admin/articles/new')}
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
              {/* UPDATED LOGOUT BUTTON */}
              <button
                className="dropdown-item logout"
                onClick={handleLogout}
              >
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