"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminService, Tracker, Article } from "@/services/admin-service";
import Link from "next/link";
import "../../../../styles/admin/components.css";

function TrackerCreateUpdatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackerId = searchParams.get('trackerId'); // If present, we are posting an update

  const [tracker, setTracker] = useState<Partial<Tracker>>({
    title: "",
    slug: "",
    summary: "",
    cover_image_url: "",
    status: "active",
    category: "geopolitics",
    priority: 0
  });

  const [updateContent, setUpdateContent] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [linkedArticleId, setLinkedArticleId] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0, 16));
  
  const [saving, setSaving] = useState(false);
  const [successUrl, setSuccessUrl] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string>(trackerId || "");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError("");
      setUploadProgress(0);

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPG, PNG, WebP, GIF, and AVIF are allowed."
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const folder = `dailyinstruct/trackers`;
      const sigResponse = await fetch("/api/hq/cloudinary-sign", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder })
      });
      if (!sigResponse.ok) {
        throw new Error("Failed to get upload signature");
      }
      const { timestamp, signature } = await sigResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "dummy_key");
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ditlndm9j";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      setUploadProgress(100);
      setTracker(prev => ({ ...prev, cover_image_url: data.secure_url }));

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      setUploadProgress(0);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleImageUpload(files[0]);
    }
  };

  useEffect(() => {
    // Fetch articles for link dropdown
    fetch('/api/hq/articles').then(res => res.json()).then(data => setArticles(data || []));
    
    // Fetch trackers if we are posting an update
    AdminService.getAllTrackers().then(data => setTrackers(data || []));
  }, []);

  const handleCreateTracker = async () => {
    setSaving(true);
    try {
      await AdminService.createTracker(tracker);
      AdminService.addNotification("Tracker created successfully");
      router.push('/hq/trackers');
    } catch (e) {
      alert("Failed to create tracker");
    } finally {
      setSaving(false);
    }
  };

  const handlePostUpdate = async () => {
    if (!selectedTrackerId || !updateContent) {
      alert("Tracker and Content are required");
      return;
    }

    setSaving(true);
    try {
      await AdminService.createTrackerUpdate({
        tracker_id: selectedTrackerId,
        content: updateContent,
        source_note: sourceNote || undefined,
        linked_article_id: linkedArticleId ? parseInt(linkedArticleId) : undefined,
        published_at: new Date(publishedAt).toISOString()
      });

      // Find tracker slug for revalidation
      const t = trackers.find(x => x.id === selectedTrackerId);
      if (t) {
        // Trigger on-demand ISR revalidation
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: 'saad@saad4242', // Password from env
            paths: [`/trackers`, `/trackers/${t.slug}`, `/${t.category}`, '/']
          })
        });
        
        AdminService.addNotification("Update published instantly");
        setSuccessUrl(`/trackers/${t.slug}`);
      }
    } catch (e) {
      alert("Failed to post update");
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut (Cmd/Ctrl + Enter) to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (trackerId || selectedTrackerId) {
          handlePostUpdate();
        } else {
          handleCreateTracker();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateContent, selectedTrackerId, trackerId, tracker]);

  if (successUrl) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '16px' }}>Update Published!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The tracker update is now live on the site.</p>
        <Link href={successUrl} target="_blank" style={{ padding: '12px 24px', background: 'var(--premium-gold)', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
          View Live Tracker ↗
        </Link>
        <br />
        <button onClick={() => { setSuccessUrl(""); setUpdateContent(""); setSourceNote(""); }} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#fff', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
          Post Another Update
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h1 className="page-title">{trackerId || selectedTrackerId ? 'Post Tracker Update' : 'Create New Tracker'}</h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
      </div>

      {true ? (
        // CREATE TRACKER FORM
        <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div className="form-group">
            <label className="form-label required">Tracker Title</label>
            <input type="text" className="form-input" value={tracker.title} onChange={e => setTracker({...tracker, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label required">URL Slug</label>
            <input type="text" className="form-input" value={tracker.slug} onChange={e => setTracker({...tracker, slug: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label required">Evergreen Summary</label>
            <textarea className="form-textarea" rows={3} value={tracker.summary} onChange={e => setTracker({...tracker, summary: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Category</label>
              <select className="form-input" value={tracker.category} onChange={e => setTracker({...tracker, category: e.target.value})}>
                <option value="geopolitics">Geopolitics</option>
                <option value="tech">Tech</option>
                <option value="business">Business</option>
                <option value="market">Markets</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority (Higher is top)</label>
              <input type="number" className="form-input" value={tracker.priority || 0} onChange={e => setTracker({...tracker, priority: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">
              Tracker Cover Image
              <span className="label-hint">Upload a high-quality cover image (Max 5MB)</span>
            </label>
            <div className="image-upload-container">
              <div
                className={`drag-drop-area ${dragActive ? "drag-active" : ""} ${uploading ? "uploading" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="file-input"
                  id="image-upload"
                  disabled={uploading}
                />
                <div className="drag-drop-content">
                  <div className="drag-drop-text">
                    {uploading ? (
                      <>
                        <strong>Uploading... {uploadProgress}%</strong>
                        <p>Please wait while we upload your image</p>
                      </>
                    ) : dragActive ? (
                      <>
                        <strong>Drop your image here</strong>
                        <p>Release to upload</p>
                      </>
                    ) : (
                      <>
                        <strong>Drag & drop your image here</strong>
                      </>
                    )}
                  </div>
                  <label htmlFor="image-upload" className={`upload-button glossy-upload-btn ${uploading ? "uploading" : ""}`}>
                    <span className="button-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </span>
                    Browse Files
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="upload-progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <div className="progress-text">{uploadProgress}%</div>
                </div>
              )}

              {uploadError && (
                <div className="upload-error-message">
                  <span className="error-icon">⚠️</span>
                  <div className="error-content">
                    <strong>Upload Failed</strong>
                    <p>{uploadError}</p>
                    <button type="button" className="error-retry-btn" onClick={() => fileInputRef.current?.click()}>Try Again</button>
                  </div>
                </div>
              )}

              <div className="image-preview-section">
                <div className="preview-header">
                  {tracker.cover_image_url && (
                    <button type="button" className="remove-image-btn" onClick={() => setTracker({...tracker, cover_image_url: ""})} disabled={uploading}>
                      <span className="remove-icon">🗑️</span>
                      Remove
                    </button>
                  )}
                  <input
                    type="text"
                    value={tracker.cover_image_url || ""}
                    onChange={(e) => setTracker({...tracker, cover_image_url: e.target.value})}
                    placeholder="Or paste an image URL here..."
                    className="form-input url-input"
                    disabled={uploading}
                    style={{ flex: 1 }}
                  />
                </div>
                {tracker.cover_image_url && (
                  <div className="preview-image-container">
                    <img src={tracker.cover_image_url} alt="Cover Preview" className="preview-image" />
                  </div>
                )}
              </div>
            </div>
          </div>          
          <button onClick={handleCreateTracker} disabled={saving} style={{ padding: '12px 24px', background: 'var(--premium-gold)', color: '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, width: '100%', marginTop: '16px' }}>
            {saving ? 'Saving...' : 'Create Tracker'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackerCreateUpdatePage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
      <TrackerCreateUpdatePageContent />
    </React.Suspense>
  );
}
