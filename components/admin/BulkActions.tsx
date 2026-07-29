'use client';

import React from 'react';
import '../../styles/admin/components.css';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  onClear: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onStatusChange,
  onClear,
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
        <button className="bulk-button glass-delete" onClick={onDelete} title="Delete selected">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          Delete
        </button>
        <button className="bulk-button glass-clear" onClick={onClear} title="Clear selection">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActions;