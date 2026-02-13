'use client';

import React from 'react';
import '../../styles/admin/components.css';

// ... imports ...

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  activeFilter: string; // ADDED
  onActiveFilterChange: (filter: string) => void; // ADDED
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  activeFilter, // ADDED
  onActiveFilterChange, // ADDED
}) => {
  const categories = ['Tech', 'Business', 'Markets', 'Guides'];
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' }, // Future use
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'trending', label: 'Trending 🔥' },
    { value: 'featured', label: 'Featured ⭐' },
    { value: 'topStory', label: 'Top Story 🏠' },
    { value: 'homeTrending', label: 'Home Trending 🔥' },
    { value: 'homeFeatured', label: 'Home Featured ⭐' },
    { value: 'homeLatest', label: 'Home Latest 🕒' },
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

        {/* NEW TYPE FILTER */}
        <select
          value={activeFilter}
          onChange={(e) => onActiveFilterChange(e.target.value)}
          className="filter-select"
          style={{ minWidth: '160px' }}
        >
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <button className="filter-button reset" onClick={() => {
          onSearchChange('');
          onStatusFilterChange('all');
          onCategoryFilterChange('all');
          onActiveFilterChange('all'); // Reset type filter too
        }}>
          🔄 Reset Filters
        </button>
      </div>

      {/* Quick Stats - Removed (Static data was misleading) */}
    </div>
  );
};

export default SearchFilters;