'use client';

import React, { useState } from 'react';
import ContentBlock from './ContentBlock';
import '../../styles/admin/components.css';

interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'quote' | 'image';
  text?: string;
  author?: string;
  imageUrl?: string;
  altText?: string;
}

interface ContentBlockEditorProps {
  content: ContentBlock[];
  onUpdate: (content: ContentBlock[]) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({ content, onUpdate }) => {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      text: type === 'heading' ? 'New Heading' : type === 'quote' ? 'Quote text here...' : 'Start typing your paragraph here...',
      ...(type === 'quote' && { author: 'Author name' }),
      ...(type === 'image' && { 
        imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop',
        altText: 'Image description'
      }),
    };

    const newContent = [...content, newBlock];
    onUpdate(newContent);
    setActiveBlock(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const newContent = content.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onUpdate(newContent);
  };

  const deleteBlock = (id: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      const newContent = content.filter(block => block.id !== id);
      onUpdate(newContent);
      if (activeBlock === id) setActiveBlock(null);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = content.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newContent = [...content];
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    onUpdate(newContent);
  };

  const duplicateBlock = (id: string) => {
    const block = content.find(b => b.id === id);
    if (!block) return;

    const duplicatedBlock = {
      ...block,
      id: Date.now().toString(),
      text: block.type === 'heading' ? `${block.text} (Copy)` : block.text,
    };

    const index = content.findIndex(b => b.id === id);
    const newContent = [
      ...content.slice(0, index + 1),
      duplicatedBlock,
      ...content.slice(index + 1),
    ];
    onUpdate(newContent);
    setActiveBlock(duplicatedBlock.id);
  };

  const getStats = () => {
    const stats = {
      paragraphs: content.filter(b => b.type === 'paragraph').length,
      headings: content.filter(b => b.type === 'heading').length,
      quotes: content.filter(b => b.type === 'quote').length,
      images: content.filter(b => b.type === 'image').length,
      totalWords: content
        .filter(b => b.text)
        .reduce((acc, block) => acc + (block.text?.split(' ').length || 0), 0),
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="content-block-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-title">Content Blocks</span>
          <span className="toolbar-stats">
            {content.length} blocks • {stats.totalWords} words
          </span>
        </div>
        <div className="toolbar-right">
          <button
            onClick={() => addBlock('paragraph')}
            className="toolbar-button"
            title="Add Paragraph"
          >
            <span className="button-icon">📝</span>
            Paragraph
          </button>
          <button
            onClick={() => addBlock('heading')}
            className="toolbar-button"
            title="Add Heading"
          >
            <span className="button-icon">#</span>
            Heading
          </button>
          <button
            onClick={() => addBlock('quote')}
            className="toolbar-button"
            title="Add Quote"
          >
            <span className="button-icon">💬</span>
            Quote
          </button>
          <button
            onClick={() => addBlock('image')}
            className="toolbar-button"
            title="Add Image"
          >
            <span className="button-icon">🖼️</span>
            Image
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{stats.paragraphs}</span>
          <span className="stat-label">Paragraphs</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">#</span>
          <span className="stat-value">{stats.headings}</span>
          <span className="stat-label">Headings</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{stats.quotes}</span>
          <span className="stat-label">Quotes</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🖼️</span>
          <span className="stat-value">{stats.images}</span>
          <span className="stat-label">Images</span>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="blocks-container">
        {content.length === 0 ? (
          <div className="empty-blocks">
            <div className="empty-icon">📄</div>
            <h3 className="empty-title">No content blocks yet</h3>
            <p className="empty-description">
              Start building your article by adding paragraphs, headings, quotes, or images.
            </p>
            <div className="empty-actions">
              <button onClick={() => addBlock('paragraph')} className="empty-action">
                Add First Paragraph
              </button>
              <button onClick={() => addBlock('heading')} className="empty-action secondary">
                Add Heading
              </button>
            </div>
          </div>
        ) : (
          <div className="blocks-list">
            {content.map((block, index) => (
              <ContentBlock
                key={block.id}
                block={block}
                index={index}
                total={content.length}
                isActive={activeBlock === block.id}
                onActivate={() => setActiveBlock(block.id)}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onDelete={() => deleteBlock(block.id)}
                onMove={(direction) => moveBlock(block.id, direction)}
                onDuplicate={() => duplicateBlock(block.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-footer">
        <button
          onClick={() => {
            const newContent = content.map(block => ({ ...block }));
            onUpdate(newContent);
          }}
          className="quick-action"
        >
          🔄 Reorder All
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(content, null, 2));
            alert('Content copied to clipboard!');
          }}
          className="quick-action"
        >
          📋 Copy JSON
        </button>
        <button
          onClick={() => {
            if (confirm('Clear all content blocks?')) {
              onUpdate([]);
              setActiveBlock(null);
            }
          }}
          className="quick-action delete"
        >
          🗑️ Clear All
        </button>
      </div>
    </div>
  );
};

export default ContentBlockEditor;