"use client";

import React, { useState, useEffect } from "react";
import { AdminService } from "@/services/admin-service";
import "../../../styles/admin/components.css";

export default function HomepageConfigPage() {
  const [tags, setTags] = useState<{label: string, link: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AdminService.getHomepageConfig().then(config => {
      setTags(config.trending_tags || []);
      setLoading(false);
    });
  }, []);

  const handleAddTag = () => {
    setTags([...tags, { label: "", link: "" }]);
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, field: 'label' | 'link', value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AdminService.updateHomepageConfig({ trending_tags: tags });
      AdminService.addNotification("Homepage config updated");
    } catch (e) {
      console.error(e);
      alert("Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h1 className="page-title">Homepage Configuration</h1>
      </div>

      <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Trending Tags (Row Below Hero)</h2>
        
        {tags.map((tag, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tag Label (e.g. Geopolitics)" 
              value={tag.label} 
              onChange={e => handleTagChange(i, 'label', e.target.value)} 
              style={{ flex: 1 }}
            />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Link (e.g. /geopolitics or /trackers/iran)" 
              value={tag.link} 
              onChange={e => handleTagChange(i, 'link', e.target.value)} 
              style={{ flex: 2 }}
            />
            <button onClick={() => handleRemoveTag(i)} style={{ padding: '8px 16px', background: 'var(--error)', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}

        <button onClick={handleAddTag} style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '16px' }}>
          + Add Tag
        </button>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: '12px 24px', background: 'var(--premium-gold)', color: '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
