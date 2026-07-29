'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../styles/admin/components.css';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const statusRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tech', label: 'Tech' },
    { value: 'business', label: 'Business' },
    { value: 'markets', label: 'Markets' },
    { value: 'geopolitics', label: 'Geopolitics' },
    { value: 'guides', label: 'Guides' }
  ];
  
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  return (
    <div className="search-filters animate-slide-in delay-100">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles by title or author..."
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="clear-search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-group">
        <div className="filter-dropdown-wrapper" ref={statusRef}>
          <div className={`glossy-select-container ${isStatusOpen ? 'open' : ''}`}>
            <div 
              className="glossy-select-trigger filter-trigger" 
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              <span>{statuses.find(s => s.value === statusFilter)?.label || 'All Status'}</span>
              <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {isStatusOpen && (
              <div className="glossy-select-dropdown">
                {statuses.map((status) => (
                  <div
                    key={status.value}
                    className={`glossy-select-option ${statusFilter === status.value ? 'selected' : ''}`}
                    onClick={() => {
                      onStatusFilterChange(status.value);
                      setIsStatusOpen(false);
                    }}
                  >
                    {status.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="filter-dropdown-wrapper" ref={categoryRef}>
          <div className={`glossy-select-container ${isCategoryOpen ? 'open' : ''}`}>
            <div 
              className="glossy-select-trigger filter-trigger" 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>{categories.find(c => c.value === categoryFilter.toLowerCase())?.label || 'All Categories'}</span>
              <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {isCategoryOpen && (
              <div className="glossy-select-dropdown">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className={`glossy-select-option ${categoryFilter.toLowerCase() === category.value ? 'selected' : ''}`}
                    onClick={() => {
                      onCategoryFilterChange(category.value === 'all' ? 'all' : category.label);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="filter-button advanced">
          ⚙️ Advanced Filters
        </button>

        <button className="filter-button reset" onClick={() => {
          onSearchChange('');
          onStatusFilterChange('all');
          onCategoryFilterChange('all');
        }}>
          🔄 Reset Filters
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-chip">
          <span className="stat-label">Total:</span>
          <span className="stat-value">48</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Published:</span>
          <span className="stat-value">45</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Draft:</span>
          <span className="stat-value">3</span>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .filter-dropdown-wrapper {
          min-width: 160px;
        }
        .filter-trigger {
          height: 40px;
          padding: 0 16px;
        }
      `}} />
    </div>
  );
};

export default SearchFilters;