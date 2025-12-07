'use client';

import React from 'react';
import '../../styles/admin/components.css';

interface ContentBlockProps {
  block: {
    id: string;
    type: 'paragraph' | 'heading' | 'quote' | 'image';
    text?: string;
    author?: string;
    imageUrl?: string;
    altText?: string;
  };
  index: number;
  total: number;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onDuplicate: () => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  index,
  total,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
}) => {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'paragraph': return '📝';
      case 'heading': return '#';
      case 'quote': return '💬';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case 'paragraph': return 'Type your paragraph here...';
      case 'heading': return 'Enter heading text...';
      case 'quote': return 'Enter quote text...';
      case 'image': return 'Enter image URL...';
      default: return 'Enter text...';
    }
  };

  return (
    <div 
      className={`content-block ${block.type} ${isActive ? 'active' : ''}`}
      onClick={onActivate}
    >
      {/* Block Header */}
      <div className="block-header">
        <div className="block-info">
          <span className="block-icon">{getBlockIcon(block.type)}</span>
          <span className="block-type">{block.type.toUpperCase()}</span>
          <span className="block-number">#{index + 1}</span>
          {block.type === 'heading' && (
            <span className="block-tag">H2</span>
          )}
        </div>
        <div className="block-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove('up');
            }}
            className="block-action"
            title="Move up"
            disabled={index === 0}
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove('down');
            }}
            className="block-action"
            title="Move down"
            disabled={index === total - 1}
          >
            ↓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="block-action"
            title="Duplicate"
          >
            ⎘
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="block-action delete"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className="block-content">
        {block.type === 'image' ? (
          <div className="image-block">
            <div className="image-preview-container">
              {block.imageUrl ? (
                <img 
                  src={block.imageUrl} 
                  alt={block.altText || 'Image'} 
                  className="image-preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`image-placeholder ${block.imageUrl ? 'hidden' : ''}`}>
                <span className="placeholder-icon">🖼️</span>
                <span className="placeholder-text">No image selected</span>
              </div>
            </div>
            <div className="image-inputs">
              <input
                type="url"
                value={block.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="Enter image URL..."
                className="image-input"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                value={block.altText || ''}
                onChange={(e) => onUpdate({ altText: e.target.value })}
                placeholder="Alt text (for accessibility)"
                className="alt-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ) : block.type === 'quote' ? (
          <div className="quote-block">
            <textarea
              value={block.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder={getPlaceholder(block.type)}
              className="quote-text"
              onClick={(e) => e.stopPropagation()}
              rows={3}
            />
            <input
              type="text"
              value={block.author || ''}
              onChange={(e) => onUpdate({ author: e.target.value })}
              placeholder="Author name"
              className="quote-author"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : block.type === 'heading' ? (
          <textarea
            value={block.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder={getPlaceholder(block.type)}
            className="heading-text"
            onClick={(e) => e.stopPropagation()}
            rows={2}
          />
        ) : (
          <textarea
            value={block.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder={getPlaceholder(block.type)}
            className="paragraph-text"
            onClick={(e) => e.stopPropagation()}
            rows={4}
          />
        )}
      </div>

      {/* Block Footer */}
      <div className="block-footer">
        <div className="block-stats">
          {block.text && (
            <span className="stat-item">
              {block.text.length} chars • {block.text.split(' ').length} words
            </span>
          )}
          {block.type === 'image' && block.imageUrl && (
            <span className="stat-item">
              <a href={block.imageUrl} target="_blank" rel="noopener noreferrer" className="image-link">
                🔗 View Image
              </a>
            </span>
          )}
        </div>
        <div className="block-hint">
          {isActive ? 'Editing...' : 'Click to edit'}
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;