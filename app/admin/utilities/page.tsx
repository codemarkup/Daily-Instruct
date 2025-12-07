'use client';

import React, { useState } from 'react';
import '../../../styles/admin/components.css';

const UtilitiesPage = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [cleanupProgress, setCleanupProgress] = useState(0);

  const utilityCards = [
    {
      title: 'Backup & Restore',
      icon: '💾',
      description: 'Create backups of all articles and restore from previous backups',
      color: 'gold',
      features: [
        'Export all articles as JSON',
        'Import articles from backup',
        'Schedule automatic backups',
        'Backup to cloud storage'
      ],
      action: () => handleBackup(),
    },
    {
      title: 'SEO Tools',
      icon: '🔍',
      description: 'Optimize your articles for search engines',
      color: 'blue',
      features: [
        'Generate sitemap.xml',
        'Check meta tags',
        'Analyze SEO score',
        'Generate robots.txt'
      ],
      action: () => handleSEOTools(),
    },
    {
      title: 'Cleanup Tools',
      icon: '🧹',
      description: 'Clean and optimize your blog data',
      color: 'green',
      features: [
        'Remove unused images',
        'Fix broken links',
        'Optimize JSON files',
        'Clear cache'
      ],
      action: () => handleCleanup(),
    },
    {
      title: 'Data Validation',
      icon: '✅',
      description: 'Validate and fix article data',
      color: 'purple',
      features: [
        'Check for duplicate slugs',
        'Validate JSON structure',
        'Find missing images',
        'Fix formatting issues'
      ],
      action: () => handleValidation(),
    },
    {
      title: 'Performance',
      icon: '⚡',
      description: 'Optimize blog performance',
      color: 'orange',
      features: [
        'Compress images',
        'Minify assets',
        'Cache optimization',
        'Load time analysis'
      ],
      action: () => handlePerformance(),
    },
    {
      title: 'Security',
      icon: '🛡️',
      description: 'Security and protection tools',
      color: 'red',
      features: [
        'Backup encryption',
        'Access logs',
        'Security scan',
        'Malware detection'
      ],
      action: () => handleSecurity(),
    },
  ];

  const handleBackup = () => {
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          alert('Backup completed successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCleanup = () => {
    setCleanupProgress(0);
    const interval = setInterval(() => {
      setCleanupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          alert('Cleanup completed successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSEOTools = () => {
    alert('SEO Tools: Generating sitemap and checking meta tags...');
  };

  const handleValidation = () => {
    alert('Data Validation: Checking for duplicate slugs and missing images...');
  };

  const handlePerformance = () => {
    alert('Performance Tools: Optimizing images and assets...');
  };

  const handleSecurity = () => {
    alert('Security Tools: Running security scan...');
  };

  return (
    <div className="utilities-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            System Utilities
            <span className="page-subtitle">Maintenance & Optimization Tools</span>
          </h1>
          <p className="page-description">
            Tools to maintain, optimize, and secure your Daily Instruct blog.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary-button">
            <span className="button-icon">📊</span>
            System Status
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health">
        <div className="health-card good">
          <div className="health-icon">✅</div>
          <div className="health-content">
            <h3 className="health-title">System Health: Excellent</h3>
            <p className="health-description">All systems are running optimally</p>
          </div>
          <div className="health-stats">
            <div className="health-stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="health-stat">
              <span className="stat-value">48</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="health-stat">
              <span className="stat-value">85%</span>
              <span className="stat-label">Storage Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Cards Grid */}
      <div className="utilities-grid">
        {utilityCards.map((utility, index) => (
          <div key={index} className={`utility-card ${utility.color}`}>
            <div className="utility-header">
              <div className="utility-icon">{utility.icon}</div>
              <h3 className="utility-title">{utility.title}</h3>
            </div>
            <div className="utility-body">
              <p className="utility-description">{utility.description}</p>
              <ul className="utility-features">
                {utility.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="utility-footer">
              <button onClick={utility.action} className="utility-button">
                Run Tool
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      {(backupProgress > 0 || cleanupProgress > 0) && (
        <div className="progress-section">
          {backupProgress > 0 && (
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-title">Backup in Progress</span>
                <span className="progress-percentage">{backupProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${backupProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {cleanupProgress > 0 && (
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-title">Cleanup in Progress</span>
                <span className="progress-percentage">{cleanupProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${cleanupProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-utilities">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action">
            <span className="action-icon">🔄</span>
            Clear Cache
          </button>
          <button className="quick-action">
            <span className="action-icon">📁</span>
            Regenerate Sitemap
          </button>
          <button className="quick-action">
            <span className="action-icon">🔍</span>
            Check SEO Score
          </button>
          <button className="quick-action">
            <span className="action-icon">📊</span>
            View Analytics
          </button>
          <button className="quick-action">
            <span className="action-icon">💾</span>
            Export All Data
          </button>
          <button className="quick-action">
            <span className="action-icon">📋</span>
            System Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesPage;