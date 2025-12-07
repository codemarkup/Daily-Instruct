'use client';

import React from 'react';
import '../../styles/admin/components.css';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="bulk-actions-bar animate-slide-in">
      <div className="bulk-info">
        <span className="selected-count">{selectedCount} selected</span>
        <span className="bulk-hint">Perform actions on selected articles</span>
      </div>
      <div className="bulk-controls">
        <select
          className="bulk-select"
          onChange={(e) => onStatusChange(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Change Status</option>
          <option value="published">Publish</option>
          <option value="draft">Move to Draft</option>
          <option value="scheduled">Schedule</option>
        </select>
        <button className="bulk-button feature" title="Feature selected">
          ⭐ Feature
        </button>
        <button className="bulk-button trending" title="Mark as trending">
          🔥 Trending
        </button>
        <button className="bulk-button delete" onClick={onDelete} title="Delete selected">
          🗑️ Delete
        </button>
        <button className="bulk-button clear" onClick={() => {}} title="Clear selection">
          ✕ Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActions;