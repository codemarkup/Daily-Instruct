'use client';

import React, { useState } from 'react';
import SwitchButton from './SwitchButton';
import '../../styles/admin/components.css';

interface FlagControlPanelProps {
  flags: {
    featured: boolean;
    trending: boolean;
    topStory: boolean;
    grid: boolean;
    homeFeatured: boolean;
    homeLatest: boolean;
    homeTrending: boolean;
    homeTopStory: boolean;
  };
  onUpdate: (flags: any) => void;
}

const FlagControlPanel: React.FC<FlagControlPanelProps> = ({ flags, onUpdate }) => {
  const [preset, setPreset] = useState<string>('custom');

  const handleToggle = (flag: string, value: boolean) => {
    onUpdate({ ...flags, [flag]: value });
    setPreset('custom');
  };

  const applyPreset = (presetName: string) => {
    const presets: Record<string, any> = {
      homeFeatured: {
        homeFeatured: true,
        homeLatest: false,
        homeTrending: false,
        homeTopStory: false,
        featured: true,
        trending: false,
        topStory: false,
        grid: true,
      },
      homeTrending: {
        homeFeatured: false,
        homeLatest: false,
        homeTrending: true,
        homeTopStory: false,
        featured: true,
        trending: true,
        topStory: false,
        grid: false,
      },
      featuredOnly: {
        homeFeatured: false,
        homeLatest: false,
        homeTrending: false,
        homeTopStory: false,
        featured: true,
        trending: false,
        topStory: false,
        grid: false,
      },
      trendingOnly: {
        homeFeatured: false,
        homeLatest: false,
        homeTrending: false,
        homeTopStory: false,
        featured: false,
        trending: true,
        topStory: false,
        grid: false,
      },
      clearAll: {
        homeFeatured: false,
        homeLatest: false,
        homeTrending: false,
        homeTopStory: false,
        featured: false,
        trending: false,
        topStory: false,
        grid: false,
      },
    };

    if (presets[presetName]) {
      onUpdate(presets[presetName]);
      setPreset(presetName);
    }
  };

  const getActiveFlagsCount = () => {
    return Object.values(flags).filter(value => value).length;
  };

  const getFlagDescription = (flag: string) => {
    const descriptions: Record<string, string> = {
      featured: 'Featured in category page',
      trending: 'Shows in trending section',
      topStory: 'Top story in category',
      grid: 'Appears in grid layout',
      homeFeatured: 'Featured on homepage',
      homeLatest: 'Latest on homepage',
      homeTrending: 'Trending on homepage',
      homeTopStory: 'Top story on homepage',
    };
    return descriptions[flag] || '';
  };

  return (
    <div className="flag-control-panel">
      {/* Header with Stats */}
      <div className="flag-header">
        <div className="flag-stats">
          <span className="stat-label">Active Flags:</span>
          <span className="stat-value gold-text">{getActiveFlagsCount()}/8</span>
        </div>
        <div className="flag-presets">
          <span className="preset-label">Presets:</span>
          <select 
            value={preset} 
            onChange={(e) => applyPreset(e.target.value)}
            className="preset-select"
          >
            <option value="custom">Custom</option>
            <option value="homeFeatured">Homepage Featured</option>
            <option value="homeTrending">Homepage Trending</option>
            <option value="featuredOnly">Category Featured Only</option>
            <option value="trendingOnly">Trending Only</option>
            <option value="clearAll">Clear All</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-row">
        <button 
          onClick={() => applyPreset('homeFeatured')}
          className={`quick-action ${preset === 'homeFeatured' ? 'active' : ''}`}
          title="Set as homepage featured"
        >
          🏠⭐ Home Featured
        </button>
        <button 
          onClick={() => applyPreset('homeTrending')}
          className={`quick-action ${preset === 'homeTrending' ? 'active' : ''}`}
          title="Set as homepage trending"
        >
          🏠🔥 Home Trending
        </button>
        <button 
          onClick={() => applyPreset('clearAll')}
          className="quick-action clear"
          title="Clear all flags"
        >
          ✕ Clear All
        </button>
      </div>

      {/* Flags Grid */}
      <div className="flags-grid">
        {/* Homepage Flags Section */}
        <div className="flag-section">
          <h4 className="section-title">
            <span className="section-icon">🏠</span>
            Homepage Flags
            <span className="section-badge">Controls homepage visibility</span>
          </h4>
          <div className="section-flags">
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">homeFeatured</span>
                <span className="flag-description">Featured on homepage</span>
              </div>
              <SwitchButton
                id="homeFeatured"
                checked={flags.homeFeatured}
                onChange={(checked) => handleToggle('homeFeatured', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">homeLatest</span>
                <span className="flag-description">Latest on homepage</span>
              </div>
              <SwitchButton
                id="homeLatest"
                checked={flags.homeLatest}
                onChange={(checked) => handleToggle('homeLatest', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">homeTrending</span>
                <span className="flag-description">Trending on homepage</span>
              </div>
              <SwitchButton
                id="homeTrending"
                checked={flags.homeTrending}
                onChange={(checked) => handleToggle('homeTrending', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">homeTopStory</span>
                <span className="flag-description">Top story on homepage</span>
              </div>
              <SwitchButton
                id="homeTopStory"
                checked={flags.homeTopStory}
                onChange={(checked) => handleToggle('homeTopStory', checked)}
              />
            </div>
          </div>
        </div>

        {/* Category Flags Section */}
        <div className="flag-section">
          <h4 className="section-title">
            <span className="section-icon">📰</span>
            Category Flags
            <span className="section-badge">Controls category page visibility</span>
          </h4>
          <div className="section-flags">
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">featured</span>
                <span className="flag-description">Featured in category</span>
              </div>
              <SwitchButton
                id="featured"
                checked={flags.featured}
                onChange={(checked) => handleToggle('featured', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">trending</span>
                <span className="flag-description">Trending in category</span>
              </div>
              <SwitchButton
                id="trending"
                checked={flags.trending}
                onChange={(checked) => handleToggle('trending', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">topStory</span>
                <span className="flag-description">Top story in category</span>
              </div>
              <SwitchButton
                id="topStory"
                checked={flags.topStory}
                onChange={(checked) => handleToggle('topStory', checked)}
              />
            </div>
            <div className="flag-item">
              <div className="flag-info">
                <span className="flag-name gold-text">grid</span>
                <span className="flag-description">Appears in grid layout</span>
              </div>
              <SwitchButton
                id="grid"
                checked={flags.grid}
                onChange={(checked) => handleToggle('grid', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Indicator */}
      <div className="flag-visual">
        <div className="visual-header">
          <span className="visual-title">Flag Status Visualization</span>
          <span className="visual-hint">Green = Active, Gray = Inactive</span>
        </div>
        <div className="visual-grid">
          {Object.entries(flags).map(([key, value]) => (
            <div key={key} className={`visual-item ${value ? 'active' : ''}`}>
              <div className="visual-dot"></div>
              <span className="visual-label">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="flag-info-panel">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <h5 className="info-title">How Flags Work</h5>
          <p className="info-text">
            Flags control where your article appears. Use homepage flags for homepage 
            visibility and category flags for category pages. Articles can have multiple 
            flags active.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlagControlPanel;
