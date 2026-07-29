'use client';

import React from 'react';
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
  const categories = ['Tech', 'Business', 'Markets', 'Geopolitics'];
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
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="filter-select"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

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
    </div>
  );
};

export default SearchFilters;