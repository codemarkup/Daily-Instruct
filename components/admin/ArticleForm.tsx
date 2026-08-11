"use client";

import React, { useState, useEffect, useRef } from "react";
import "../../styles/admin/components.css";
import { Article, AdminService } from "@/services/admin-service";

interface ContentBlock {
  id: string;
  type: "paragraph" | "heading" | "quote";
  text: string;
  author?: string;
}

interface ArticleFormProps {
  article: Partial<Article>;
  onUpdate: (article: Partial<Article>) => void;
  isEditing?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onUpdate,
  isEditing = false,
}) => {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [quickFillText, setQuickFillText] = useState("");
  const [quickFillError, setQuickFillError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [keywordInput, setKeywordInput] = useState("");
  
  // Analytics Feature States
  const [analyzeTargetKeyword, setAnalyzeTargetKeyword] = useState("");
  const [isKeywordAutoSuggested, setIsKeywordAutoSuggested] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [revisedBlocks, setRevisedBlocks] = useState<ContentBlock[]>([]);
  const [acceptedBlocks, setAcceptedBlocks] = useState<boolean[]>([]);
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newKeyword = keywordInput.trim().replace(/^,+|,+$/g, '');
      if (newKeyword) {
        const currentKeywords = article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
        if (!currentKeywords.includes(newKeyword)) {
          const updatedKeywords = [...currentKeywords, newKeyword].join(', ');
          onUpdate({ ...article, keywords: updatedKeywords });
        }
        setKeywordInput("");
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    const updatedKeywords = currentKeywords.filter(k => k !== keywordToRemove).join(', ');
    onUpdate({ ...article, keywords: updatedKeywords });
  };

  // Custom Dropdown States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const subcategoryRef = useRef<HTMLDivElement>(null);

  const [activeTrackers, setActiveTrackers] = useState<any[]>([]);

  useEffect(() => {
    AdminService.getAllTrackers().then(trackers => {
      setActiveTrackers(trackers.filter(t => t.status === 'active'));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (subcategoryRef.current && !subcategoryRef.current.contains(event.target as Node)) {
        setIsSubcategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIX: Changed "market" to "markets" to match your JSON files
  const categories = [
    {
      value: "tech",
      label: "Technology",
      subcategories: [
        "Artificial Intelligence",
        "Gadgets & Devices",
        "Software Development",
        "Cybersecurity",
        "Data & Analytics",
      ],
    },
    {
      value: "business",
      label: "Business",
      subcategories: [
        "Startup News",
        "Company Updates",
        "Market Trends",
        "Business Tips",
        "Personal Finance",
        "Work Productivity",
      ],
    },
    {
      value: "markets",
      label: "Markets",
      subcategories: [
        "Stock Market",
        "Cryptocurrency",
        "Commodities",
        "Forex Market",
        "Market Trends",
        "Economic News",
      ],
    },
    {
      value: "geopolitics",
      label: "Geopolitics",
      subcategories: [
        "Global Affairs",
        "Defense & Security",
        "International Trade",
        "Elections & Policy",
      ],
    }
  ];

  const handleGenerateSlug = async () => {
    if (!article.title) return;
    setIsGeneratingSlug(true);
    try {
      const content = article.content as ContentBlock[] || [];
      const response = await fetch('/api/hq/generate-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: article.title, 
          paragraph: (content.length > 0 && content[0].type === 'paragraph') ? content[0].text : '' 
        })
      });
      const data = await response.json();
      if (data.slug) {
        onUpdate({ slug: data.slug });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleChange = (field: keyof Article, value: any) => {
    console.log(`Form changing ${field} to:`, value);
    onUpdate({ [field]: value });
  };

  const getSubcategories = () => {
    const category = categories.find((cat) => cat.value === article.category);
    return category ? category.subcategories : [];
  };

  useEffect(() => {
    if (!article.content || article.content.length === 0) {
      const initialContent: ContentBlock[] = [
        {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "paragraph",
          text: "",
        },
      ];
      handleChange("content", initialContent);
    }
  }, []);

  const handleContentBlockChange = (
    index: number,
    field: keyof ContentBlock,
    value: any
  ) => {
    const currentContent = (article.content as ContentBlock[]) || [];
    const newContent = [...currentContent];
    const updatedBlock = { ...newContent[index], [field]: value };
    newContent[index] = updatedBlock;
    handleChange("content", newContent);
  };

  const addContentBlock = () => {
    const currentContent = (article.content as ContentBlock[]) || [];
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "paragraph",
      text: "",
    };
    const newContent = [...currentContent, newBlock];
    handleChange("content", newContent);
  };

  const removeContentBlock = (index: number) => {
    const currentContent = (article.content as ContentBlock[]) || [];
    const newContent = currentContent.filter((_, i) => i !== index);

    if (newContent.length === 0) {
      const newBlock: ContentBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "paragraph",
        text: "",
      };
      handleChange("content", [newBlock]);
    } else {
      handleChange("content", newContent);
    }
  };

  // =========== QUICK FILL FUNCTIONALITY ===========
  const handleQuickFill = () => {
    if (!quickFillText.trim()) {
      setQuickFillError("Please paste some content first!");
      return;
    }

    // Parse the text
    const lines = quickFillText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      setQuickFillError("No valid content found!");
      return;
    }

    const newBlocks: ContentBlock[] = [];
    let lineCount = 0;

    lines.forEach(line => {
      let type: "paragraph" | "heading" | "quote" = "paragraph";
      let text = line.trim();

      // Check for prefixes
      if (line.toUpperCase().startsWith('HEADING:')) {
        type = "heading";
        text = line.substring(8).trim(); // Remove "HEADING:"
        lineCount++;
      } else if (line.toUpperCase().startsWith('PARAGRAPH:')) {
        type = "paragraph";
        text = line.substring(10).trim(); // Remove "PARAGRAPH:"
        lineCount++;
      } else if (line.toUpperCase().startsWith('QUOTE:')) {
        type = "quote";
        text = line.substring(6).trim(); // Remove "QUOTE:"
        lineCount++;
      }
      // If no prefix but has content, assume it's a paragraph
      else if (text.length > 0) {
        type = "paragraph";
        lineCount++;
      }

      // Create block if we have content
      if (text.length > 0) {
        const block: ContentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${lineCount}`,
          type,
          text,
        };
        newBlocks.push(block);
      }
    });

    if (newBlocks.length === 0) {
      setQuickFillError("Could not parse any content. Make sure to use HEADING:/PARAGRAPH:/QUOTE: prefixes.");
      return;
    }

    // Replace existing content with new blocks
    handleChange("content", newBlocks);
    setQuickFillError("");
    setShowQuickFill(false);
    setQuickFillText("");
    
    // Show success message
    alert(`Successfully created ${newBlocks.length} content blocks!`);
  };

  const handleCancelQuickFill = () => {
    setShowQuickFill(false);
    setQuickFillText("");
    setQuickFillError("");
  };

  const handleQuickFillExample = () => {
    const exampleText = `HEADING: Introduction to AI
PARAGRAPH: Artificial intelligence is transforming every industry...
QUOTE: "The future belongs to those who embrace AI"
PARAGRAPH: Companies that adopt AI early will have a competitive advantage...
HEADING: Getting Started
PARAGRAPH: Begin with simple automation tasks...`;
    
    setQuickFillText(exampleText);
  };
  // =========== END QUICK FILL FUNCTIONALITY ===========

  // =========== GROQ ANALYZE & OPTIMIZE ===========
  const handleAnalyze = async () => {
    const currentContent = article.content as ContentBlock[] || [];
    if (currentContent.length === 0 || (currentContent.length === 1 && !currentContent[0].text)) {
      alert("Please add some content first.");
      return;
    }

    const rawContent = currentContent.map(b => {
      if (b.type === 'quote') {
        return `QUOTE: ${b.text}${b.author ? ` (Author: ${b.author})` : ''}`;
      }
      if (b.type === 'heading') return `HEADING: ${b.text}`;
      return `PARAGRAPH: ${b.text}`;
    }).join('\n');

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/hq/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawContent, keyword: analyzeTargetKeyword })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        try {
          const errData = JSON.parse(errText);
          setTimeout(() => alert(errData.error || "Analysis failed."), 10);
        } catch {
          setTimeout(() => alert(`Analysis failed (${res.status}): ${errText.substring(0, 100)}`), 10);
        }
        return;
      }
      
      const data = await res.json();
      
      let effectiveKeyword = analyzeTargetKeyword;
      if (!analyzeTargetKeyword && data.detectedKeyword) {
        const contentLower = rawContent.toLowerCase();
        const keywordLower = data.detectedKeyword.toLowerCase();
        const keywordWords = keywordLower.split(/\s+/).filter((w: string) => w.length > 3);
        
        let isValid = contentLower.includes(keywordLower);
        if (!isValid && keywordWords.length > 0) {
          isValid = keywordWords.some((w: string) => contentLower.includes(w));
        }
        
        if (!isValid) {
          setTimeout(() => alert(`Couldn't confidently detect a target keyword (suggested: "${data.detectedKeyword}"). Please enter one manually and try again.`), 10);
          return;
        }
        
        effectiveKeyword = data.detectedKeyword;
        setAnalyzeTargetKeyword(effectiveKeyword);
        setIsKeywordAutoSuggested(true);
      }

      const lines = data.revisedContent.split('\n').filter((l: string) => l.trim());
      const newBlocks: ContentBlock[] = [];
      lines.forEach((line: string) => {
        let type: "paragraph" | "heading" | "quote" = "paragraph";
        let text = line.trim();
        let author = "";
        
        if (line.toUpperCase().startsWith('HEADING:')) {
          type = "heading";
          text = line.substring(8).trim();
        } else if (line.toUpperCase().startsWith('PARAGRAPH:')) {
          type = "paragraph";
          text = line.substring(10).trim();
        } else if (line.toUpperCase().startsWith('QUOTE:')) {
          type = "quote";
          text = line.substring(6).trim();
          const authorMatch = text.match(/\(Author:\s*(.*?)\)$/i);
          if (authorMatch) {
            author = authorMatch[1].trim();
            text = text.replace(authorMatch[0], "").trim();
          }
        } else {
          return; 
        }
        newBlocks.push({
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          text,
          author
        });
      });

      if (newBlocks.length === 0 || newBlocks.length !== currentContent.length) { setTimeout(() => alert(`AI returned a malformed response (expected ${currentContent.length} blocks, got ${newBlocks.length}). Please try again.`), 10); return; }

      setRevisedBlocks(newBlocks);
      setAnalysisReport(data.report);
      setAcceptedBlocks(new Array(newBlocks.length).fill(true));
      setShowAnalysisModal(true);
    } catch (err: any) {
      console.error(err);
      setTimeout(() => alert(`Error during analysis: ${err.message}`), 10);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAnalysis = () => {
    const currentContent = article.content as ContentBlock[] || [];
    const finalContent = currentContent.map((block, index) => {
      if (index < revisedBlocks.length && acceptedBlocks[index]) {
        return revisedBlocks[index];
      }
      return block;
    });
    
    if (revisedBlocks.length > currentContent.length) {
      for (let i = currentContent.length; i < revisedBlocks.length; i++) {
        if (acceptedBlocks[i]) {
          finalContent.push(revisedBlocks[i]);
        }
      }
    }
    
    handleChange("content", finalContent);
    setShowAnalysisModal(false);
  };
  // =========== END GROQ ANALYZE & OPTIMIZE ===========

  // Image Upload Functions
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
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

      // 1. Get signature from backend
      const folder = `dailyinstruct/${article.category || "uncategorized"}`;
      const sigResponse = await fetch("/api/hq/cloudinary-sign", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder })
      });
      if (!sigResponse.ok) {
        throw new Error("Failed to get upload signature");
      }
      const { timestamp, signature } = await sigResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "dummy_key");
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // We need cloud_name, assume NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is available
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
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
      handleChange("image", data.secure_url);

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

  const contentBlocks = (article.content as ContentBlock[]) || [];

  return (
    <div className="article-form-fields">
      {/* =========== QUICK FILL MODAL =========== */}
      {showQuickFill && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="modal-icon">⚡</span>
                Quick Fill Content
              </h3>
              <button
                onClick={handleCancelQuickFill}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p><strong>Paste GPT output with prefixes:</strong></p>
                <ul className="prefix-list">
                  <li><code>HEADING:</code> Your heading text</li>
                  <li><code>PARAGRAPH:</code> Your paragraph text</li>
                  <li><code>QUOTE:</code> Your quote text</li>
                </ul>
                <p className="example-text">
                  <button
                    type="button"
                    onClick={handleQuickFillExample}
                    className="example-button"
                  >
                    Load Example Format
                  </button>
                </p>
              </div>
              
              <div className="text-area-container">
                <textarea
                  value={quickFillText}
                  onChange={(e) => {
                    setQuickFillText(e.target.value);
                    setQuickFillError("");
                  }}
                  className="quick-fill-textarea"
                  placeholder={`HEADING: Your Main Heading
PARAGRAPH: Your first paragraph...
QUOTE: "Your important quote"
PARAGRAPH: Continue writing...`}
                  rows={10}
                />
                <div className="text-area-hint">
                  <span>Lines: {quickFillText.split('\n').filter(l => l.trim()).length}</span>
                  <span>Chars: {quickFillText.length}</span>
                </div>
              </div>

              {quickFillError && (
                <div className="quick-fill-error">
                  <span className="error-icon">⚠️</span>
                  {quickFillError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleCancelQuickFill}
                className="modal-button secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickFill}
                className="modal-button primary"
              >
                <span className="button-icon">⚡</span>
                Create Blocks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========== ORIGINAL FORM FIELDS =========== */}
      <div className="form-group">
        <label className="form-label required">
          Article Title
          <span className="label-hint">Catchy and descriptive</span>
        </label>
        <input
          type="text"
          value={article.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className="form-input"
          placeholder="Enter article title..."
          required
        />
        <div className="input-hint">
          <span className="hint-text">Recommended: 50-60 characters</span>
          <span className="hint-count">{article.title?.length || 0}/60</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">
          URL Slug
          <span className="label-hint">Automatically generated from title</span>
        </label>
        <div className="slug-container">
          <span className="slug-prefix">dailyinstruct.com/articles/</span>
          <input
            type="text"
            value={article.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="form-input slug-input"
            placeholder="article-slug"
            required
          />
          <button 
            type="button" 
            onClick={handleGenerateSlug}
            disabled={isGeneratingSlug || !article.title}
            className={`seo-optimize-btn ${isGeneratingSlug ? 'loading' : ''}`}
          >
            <span className="btn-icon">
              {isGeneratingSlug ? (
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              )}
            </span>
            {isGeneratingSlug ? "Optimizing..." : "Optimize"}
          </button>
        </div>
        <div className="input-hint" style={{ marginTop: '8px' }}>
          <span className="hint-text" style={{ display: 'flex', gap: '15px' }}>
            <span>Words: {(article.slug || "").split('-').filter(w => w.length > 0).length} (Target: 3-5)</span>
          </span>
          <span className="hint-count" style={{ color: (article.slug?.length || 0) > 70 ? '#ef4444' : 'inherit', fontWeight: (article.slug?.length || 0) > 70 ? 'bold' : 'normal' }}>
            {article.slug?.length || 0}/70 chars
          </span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required">Content Type</label>
          <select
            value={article.content_type || "article"}
            onChange={(e) => handleChange("content_type", e.target.value)}
            className="form-input"
          >
            <option value="article">Standard Article</option>
            <option value="opinion">Opinion</option>
            <option value="explainer">Explainer</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Featured Position
            <span className="label-hint">Order on homepage/category (1 is top)</span>
          </label>
          <input
            type="number"
            value={article.featured_position || ""}
            onChange={(e) => handleChange("featured_position", e.target.value ? parseInt(e.target.value) : undefined)}
            className="form-input"
            placeholder="e.g. 1"
            min="1"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">
          Description
          <span className="label-hint">Short summary for preview cards</span>
        </label>
        <textarea
          value={article.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="form-textarea"
          placeholder="Write a compelling description..."
          rows={3}
          required
        />
        <div className="input-hint">
          <span className="hint-text">Recommended: 120-160 characters</span>
          <span className="hint-count">
            {article.description?.length || 0}/160
          </span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            SEO Keywords
            <span className="label-hint">Press Enter to add</span>
          </label>
          <div className="form-input keywords-container" style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px', 
            padding: '6px 12px', 
            height: 'auto',
            minHeight: '42px',
            alignItems: 'center'
          }}>
            {(article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : []).map((keyword, index) => (
              <span key={index} className="keyword-tag" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {keyword}
                <button 
                  type="button" 
                  onClick={() => removeKeyword(keyword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    opacity: 0.7,
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder={!article.keywords ? "Type keyword & press Enter..." : ""}
              style={{
                flex: 1,
                minWidth: '150px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '14px',
                padding: '4px'
              }}
            />
          </div>
          <div className="input-hint">
            <span className="hint-text">3-5 keywords people search for</span>
            <span className="hint-count">{(article.keywords ? article.keywords.split(',').filter(Boolean).length : 0)}/10 tags</span>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Meta Description
            <span className="label-hint">For search results</span>
          </label>
          <textarea
            value={article.metaDescription || ""}
            onChange={(e) => handleChange("metaDescription", e.target.value)}
            className="form-textarea"
            placeholder="Best tutorial for beginners..."
            rows={2}
          />
          <div className="input-hint">
            <span className="hint-text">Optimal: 150-160 characters</span>
            <span className="hint-count">{(article.metaDescription || "").length}/160</span>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" ref={categoryRef}>
          <label className="form-label required">Category</label>
          <div className={`glossy-select-container ${isCategoryOpen ? 'open' : ''}`}>
            <div 
              className="glossy-select-trigger" 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>
                {categories.find(c => c.value === (article.category || "tech"))?.label || "Select Category"}
              </span>
              <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {isCategoryOpen && (
              <div className="glossy-select-dropdown">
                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    className={`glossy-select-option ${(article.category || "tech") === cat.value ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange("category", cat.value);
                      handleChange("specific", "");
                      setIsCategoryOpen(false);
                    }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group" ref={subcategoryRef}>
          <label className="form-label required">Subcategory (Specific)</label>
          <div className={`glossy-select-container ${isSubcategoryOpen ? 'open' : ''}`}>
            <div 
              className="glossy-select-trigger"
              onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
            >
              <span>{article.specific || "Select subcategory"}</span>
              <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {isSubcategoryOpen && (
              <div className="glossy-select-dropdown">
                {getSubcategories().map((subcat) => (
                  <div
                    key={subcat}
                    className={`glossy-select-option ${article.specific === subcat ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange("specific", subcat);
                      setIsSubcategoryOpen(false);
                    }}
                  >
                    {subcat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE UPLOAD SECTION (unchanged) */}
      <div className="form-group">
        <label className="form-label required">
          Article Cover Image
          <span className="label-hint">
            Upload a high-quality cover image (Max 5MB)
          </span>
        </label>
        <div className="image-upload-container">
          <div
            className={`drag-drop-area ${dragActive ? "drag-active" : ""} ${
              uploading ? "uploading" : ""
            }`}
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
              <label
                htmlFor="image-upload"
                className={`upload-button glossy-upload-btn ${uploading ? "uploading" : ""}`}
              >
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
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
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
                <button
                  type="button"
                  className="error-retry-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="image-preview-section">
            <div className="preview-header">
              {article.image && article.image !== "/images/default.png" && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleChange("image", "/images/default.png")}
                  disabled={uploading}
                >
                  <span className="remove-icon">🗑️</span>
                  Remove
                </button>
              )}
            </div>
            <div className="preview-container">
              {article.image && article.image !== "/images/default.png" ? (
                <div className="image-preview">
                  <img
                    src={article.image}
                    alt="Cover preview"
                    className="preview-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<div class="image-error">❌ Failed to load image</div>';
                    }}
                  />
                  <div className="preview-info">
                    <div className="preview-url">
                      <span className="url-label">URL:</span>
                      <code className="url-text">{article.image}</code>
                    </div>
                    <button
                      type="button"
                      className="copy-url-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(article.image || "");
                        alert("URL copied to clipboard!");
                      }}
                    >
                      📋 Copy URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-image-placeholder"></div>
              )}
            </div>
          </div>

          <div className="manual-url-section" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <label className="url-input-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-light)' }}>
              Or enter image URL manually:
            </label>
            <div className="url-input-group">
              <input
                type="text"
                value={article.image || ""}
                onChange={(e) => handleChange("image", e.target.value)}
                className="form-input image-url-input"
                placeholder="/images/category/filename.png"
                disabled={uploading}
              />
            </div>
            <div className="url-hint"></div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required">Author Name</label>
          <input
            type="text"
            value={article.author || ""}
            onChange={(e) => handleChange("author", e.target.value)}
            className="form-input"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label required">Date</label>
          <input
            type="text"
            value={
              article.date ||
              new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
            onChange={(e) => handleChange("date", e.target.value)}
            className="form-input"
            placeholder="March 15, 2024"
            required
          />
          <div className="input-hint">
            <span className="hint-text">Format: Month Day, Year</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">Read Time</label>
        <input
          type="text"
          value={article.readTime || "5 min read"}
          onChange={(e) => handleChange("readTime", e.target.value)}
          className="form-input"
          placeholder="5 min read"
          required
        />
      </div>

      <div className="form-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>Article Flags</h3>
          <div className="flags-status-counter" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
            {[
              article.trending,
              article.featured,
              article.topStory,
              article.grid,
              article.homeFeatured,
              article.homeLatest,
              article.homeTrending,
              article.homeTopStory,
            ].filter(Boolean).length}/8 Selected
          </div>
        </div>
        <div className="flags-grid">
          {["trending", "featured", "topStory", "grid", "homeFeatured", "homeLatest", "homeTrending", "homeTopStory"].map((flag) => (
            <div key={flag} className="flag-group">
              <label className="glossy-toggle-label">
                <input
                  type="checkbox"
                  checked={Boolean(article[flag as keyof Article]) || false}
                  onChange={(e) => handleChange(flag as keyof Article, e.target.checked)}
                  className="hidden-checkbox"
                />
                <div className="glossy-toggle-track">
                  <div className="glossy-toggle-thumb"></div>
                </div>
                <span className="flag-text">
                  {flag.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {activeTrackers.length > 0 && (
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>Link to Trackers</h3>
              <p className="section-subtitle" style={{ marginTop: '4px' }}>Automatically post this article to the selected situation trackers</p>
            </div>
            <div className="flags-status-counter" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
              {(article.trackers || []).length} Selected
            </div>
          </div>
          <div className="flags-grid">
            {activeTrackers.map((tracker) => {
              const isChecked = (article.trackers || []).includes(tracker.id);
              return (
                <div key={tracker.id} className="flag-group" title={tracker.title}>
                  <label className="glossy-toggle-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentTrackers = [...(article.trackers || [])];
                        if (e.target.checked) {
                          currentTrackers.push(tracker.id);
                        } else {
                          const idx = currentTrackers.indexOf(tracker.id);
                          if (idx > -1) currentTrackers.splice(idx, 1);
                        }
                        handleChange("trackers" as any, currentTrackers);
                      }}
                      className="hidden-checkbox"
                    />
                    <div className="glossy-toggle-track">
                      <div className="glossy-toggle-thumb"></div>
                    </div>
                    <span className="flag-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {tracker.title}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========== CONTENT SECTION WITH QUICK FILL BUTTON =========== */}
      <div className="form-section">
        <div className="content-section-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <h3 className="section-title required">Article Content</h3>
            <p className="section-subtitle">Add paragraphs, headings, and quotes</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="SEO Target Keyword (Optional)" 
                className="form-input" 
                style={{ width: '260px', marginBottom: 0, paddingRight: isKeywordAutoSuggested ? '135px' : '10px' }}
                value={analyzeTargetKeyword}
                onChange={(e) => {
                  setAnalyzeTargetKeyword(e.target.value);
                  if (isKeywordAutoSuggested) setIsKeywordAutoSuggested(false);
                }}
              />
              {isKeywordAutoSuggested && (
                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', background: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  ✨ Suggested by Groq
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px', 
                padding: '0 18px', 
                height: '42px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderTop = '1px solid rgba(255, 255, 255, 0.45)';
                  e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              onMouseDown={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.transform = 'translateY(0) scale(0.97)';
                }
              }}
              onMouseUp={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M10 2L11.5658 7.47954L17 9.15494L11.5658 10.8303L10 16.3099L8.43419 10.8303L3 9.15494L8.43419 7.47954L10 2Z" fill="url(#paint0_linear)"/>
                <path d="M19 14L19.7829 16.7398L22.5 17.5775L19.7829 18.4152L19 21.1549L18.2171 18.4152L15.5 17.5775L18.2171 16.7398L19 14Z" fill="url(#paint1_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="10" y1="2" x2="10" y2="16.3099" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FACC15"/>
                    <stop offset="1" stopColor="#F97316"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="19" y1="14" x2="19" y2="21.1549" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60A5FA"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
              {isAnalyzing ? "Analyzing..." : "Analyze & Optimize"}
            </button>
            <button
              type="button"
              onClick={() => setShowQuickFill(true)}
              className="quick-fill-trigger-button"
            >
              <span className="button-icon">⚡</span>
              Quick Fill Content
            </button>
          </div>
        </div>

        <div className="quick-fill-hint">
          <span className="hint-text">
            <strong>How to use:</strong> Click "Quick Fill Content", paste GPT output with HEADING:/PARAGRAPH:/QUOTE: prefixes
          </span>
        </div>

        <div className="content-editor">
          {contentBlocks.map((block, index) => (
            <div key={block.id} className="content-block">
              <select
                value={block.type}
                onChange={(e) =>
                  handleContentBlockChange(index, "type", e.target.value)
                }
                className="content-type-select"
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading">Heading</option>
                <option value="quote">Quote</option>
              </select>
              <textarea
                value={block.text}
                onChange={(e) =>
                  handleContentBlockChange(index, "text", e.target.value)
                }
                className="content-textarea"
                placeholder={
                  block.type === "paragraph"
                    ? "Write paragraph..."
                    : block.type === "heading"
                    ? "Write heading..."
                    : "Write quote..."
                }
                rows={block.type === "paragraph" ? 3 : 2}
              />
              {block.type === "quote" && (
                <input
                  type="text"
                  value={block.author || ""}
                  onChange={(e) =>
                    handleContentBlockChange(index, "author", e.target.value)
                  }
                  className="quote-author-input"
                  placeholder="Quote author (optional)"
                />
              )}
              <button
                type="button"
                onClick={() => removeContentBlock(index)}
                className="remove-block-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addContentBlock}
            className="add-block-btn"
          >
            + Add Content Block
          </button>
        </div>
      </div>

      {/* =========== ANALYZE & OPTIMIZE MODAL =========== */}
      {showAnalysisModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L11.5658 7.47954L17 9.15494L11.5658 10.8303L10 16.3099L8.43419 10.8303L3 9.15494L8.43419 7.47954L10 2Z" fill="url(#paint0_linear_modal)"/>
                  <path d="M19 14L19.7829 16.7398L22.5 17.5775L19.7829 18.4152L19 21.1549L18.2171 18.4152L15.5 17.5775L18.2171 16.7398L19 14Z" fill="url(#paint1_linear_modal)"/>
                  <defs>
                    <linearGradient id="paint0_linear_modal" x1="10" y1="2" x2="10" y2="16.3099" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FACC15"/>
                      <stop offset="1" stopColor="#F97316"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_modal" x1="19" y1="14" x2="19" y2="21.1549" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60A5FA"/>
                      <stop offset="1" stopColor="#3B82F6"/>
                    </linearGradient>
                  </defs>
                </svg>
                Review Analysis & Optimizations
              </h3>
              <button onClick={() => setShowAnalysisModal(false)} className="modal-close">×</button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', color: '#1e293b' }}>
              {analysisReport && (
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Report Summary</h4>
                  
                  {/* Tells Fixed */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>✅ AI Tells Reduced/Fixed:</strong>
                    {analysisReport.tellsFixed?.length > 0 ? (
                      <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem' }}>
                        {analysisReport.tellsFixed.map((t: any, i: number) => (
                          <li key={i}>{t.category} ({t.count}x): {t.description}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#64748b' }}>None found.</p>
                    )}
                  </div>

                  {/* Human Input Needed */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>⚠️ Needs Human Input:</strong>
                    {analysisReport.humanInputNeeded?.length > 0 ? (
                      <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem', color: '#b45309' }}>
                        {analysisReport.humanInputNeeded.map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#64748b' }}>No empty claims flagged.</p>
                    )}
                  </div>

                  {/* SEO Check */}
                  <div>
                    <strong>🔍 On-Page SEO (Keyword: {analyzeTargetKeyword}):</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      <div style={{ color: analysisReport.seo?.keywordInFirst100Words ? '#15803d' : '#b91c1c' }}>
                        {analysisReport.seo?.keywordInFirst100Words ? '✓' : '✗'} Keyword in first 100 words
                      </div>
                      <div style={{ color: analysisReport.seo?.keywordInHeading ? '#15803d' : '#b91c1c' }}>
                        {analysisReport.seo?.keywordInHeading ? '✓' : '✗'} Keyword in a Heading
                      </div>
                      <div style={{ color: analysisReport.seo?.topicalCompleteness ? '#15803d' : '#b91c1c' }}>
                        {analysisReport.seo?.topicalCompleteness ? '✓' : '✗'} Topical Completeness
                      </div>
                      <div style={{ color: !analysisReport.seo?.keywordStuffing ? '#15803d' : '#b91c1c' }}>
                        {!analysisReport.seo?.keywordStuffing ? '✓' : '✗'} Keyword Stuffing Check
                      </div>
                      <div style={{ color: analysisReport.seo?.answerFirstOpening ? '#15803d' : '#b91c1c' }}>
                        {analysisReport.seo?.answerFirstOpening ? '✓' : '✗'} Answer-first opening paragraph
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="diff-viewer">
                <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Review Suggested Changes</h4>
                {contentBlocks.map((origBlock, idx) => {
                  const revBlock = revisedBlocks[idx];
                  const hasChanged = revBlock && (origBlock.text !== revBlock.text || origBlock.type !== revBlock.type);
                  
                  if (!revBlock) return null;

                  return (
                    <div key={idx} style={{ 
                      display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', 
                      background: hasChanged ? '#fefce8' : '#ffffff', 
                      border: '1px solid #e2e8f0', borderRadius: '8px',
                      alignItems: 'stretch'
                    }}>
                      <div style={{ flex: '0 0 50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={acceptedBlocks[idx]} 
                          onChange={(e) => {
                            const newAccepted = [...acceptedBlocks];
                            newAccepted[idx] = e.target.checked;
                            setAcceptedBlocks(newAccepted);
                          }}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>Accept</span>
                      </div>
                      
                      <div style={{ flex: 1, paddingRight: '1rem', borderRight: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Original {origBlock.type}</div>
                        <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#334155' }}>{origBlock.text}</div>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Suggested {revBlock.type}</div>
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontSize: '0.9rem',
                          color: hasChanged ? '#047857' : '#334155',
                          fontWeight: hasChanged ? 500 : 'normal'
                        }}>{revBlock.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" onClick={() => setShowAnalysisModal(false)} className="modal-button secondary">
                Cancel
              </button>
              <button type="button" onClick={applyAnalysis} className="modal-button primary">
                Apply Accepted Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ArticleForm;

