"use client";

import React, { useState, useEffect, useRef } from "react";
import "../../styles/admin/components.css";
import { Article } from "@/services/admin-service";

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
  const [slugPreview, setSlugPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIX: Changed "market" to "markets" to match your JSON files
  const categories = [
    {
      value: "tech",
      label: "Technology",
      subcategories: [
        "Artificial Intelligence",
        "Programming",
        "Gadgets",
        "Cybersecurity",
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
        "Work & Productivity",
      ],
    },
    {
      value: "markets", // CHANGED FROM "market" TO "markets"
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
      value: "guides",
      label: "Guides",
      subcategories: [
        "Technology Guides",
        "Finance & Investing Guides",
        "Business & Entrepreneurship Guides",
        "Productivity & Work-Life Guides",
        "Software & Tools How-Tos",
        "Career & Skills Development Guides",
      ],
    },
  ];

  const generateSlug = (title: string) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  useEffect(() => {
    if (article.title && !isEditing) {
      const slug = generateSlug(article.title);
      setSlugPreview(slug);
      if (!article.slug || article.slug === generateSlug(article.title)) {
        onUpdate({ slug });
      }
    }
  }, [article.title, isEditing]);

  // FIX: Send only the changed field, not the entire article
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

  // Image Upload Functions
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Reset error state
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
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

      // Validate size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", article.category || "uncategorized");

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      // Update progress to 100%
      setUploadProgress(100);

      // Update the article with the new image URL
      handleChange("image", data.url);

      // Show success message briefly
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      setUploadProgress(0);
    } finally {
      setUploading(false);
      // Reset file input
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
        </div>
        <div className="input-hint">
          <span className="hint-text">Preview: {slugPreview}</span>
          {!isEditing && (
            <button
              type="button"
              onClick={() => handleChange("slug", slugPreview)}
              className="hint-button"
            >
              Use suggested
            </button>
          )}
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

      {/* FIXED CATEGORY DROPDOWN */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required">Category</label>
          <select
            value={article.category || "tech"}
            onChange={(e) => {
              console.log("Category dropdown changed to:", e.target.value);
              handleChange("category", e.target.value);
              handleChange("specific", "");
            }}
            className="form-select"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label required">Subcategory (Specific)</label>
          <select
            value={article.specific || ""}
            onChange={(e) => handleChange("specific", e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select subcategory</option>
            {getSubcategories().map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* IMAGE UPLOAD SECTION */}
      <div className="form-group">
        <label className="form-label required">
          Article Cover Image
          <span className="label-hint">
            Upload a high-quality cover image (Max 5MB)
          </span>
        </label>

        <div className="image-upload-container">
          {/* Drag & Drop Area */}
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
              <div className="drag-drop-icon">
                {/* {uploading ? '⏳' : dragActive ? '📂' : '📤'} */}
              </div>
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
                    {/* <p>or click to browse</p> */}
                  </>
                )}
              </div>

              <label
                htmlFor="image-upload"
                className={`upload-button ${uploading ? "uploading" : ""}`}
              >
                <span className="button-icon">📁</span>
                Browse Files
              </label>
            </div>
          </div>

          {/* Progress Bar */}
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

          {/* Error Message */}
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

          {/* Image Preview */}
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
                <div className="no-image-placeholder">
                  {/* <div className="placeholder-icon">🖼️</div>
                  <div className="placeholder-text">
                    <p>No image selected</p>
                    <p className="placeholder-subtext">
                      Upload an image or use default: <code>/images/default.png</code>
                    </p>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Manual URL Input */}
          <div className="manual-url-section">
            <label className="url-input-label">
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
              <button
                type="button"
                className="url-help-btn"
                title="Image URLs should be relative paths starting with /images/"
              >
                ?
              </button>
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
        <h3 className="section-title">Article Flags</h3>
        <div className="flags-grid">
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.trending || false}
                onChange={(e) => handleChange("trending", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Trending</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.featured || false}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Featured</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.topStory || false}
                onChange={(e) => handleChange("topStory", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Top Story</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.grid || false}
                onChange={(e) => handleChange("grid", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Grid</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.homeFeatured || false}
                onChange={(e) => handleChange("homeFeatured", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Home Featured</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.homeLatest || false}
                onChange={(e) => handleChange("homeLatest", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Home Latest</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.homeTrending || false}
                onChange={(e) => handleChange("homeTrending", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Home Trending</span>
            </label>
          </div>
          <div className="flag-group">
            <label className="flag-label">
              <input
                type="checkbox"
                checked={article.homeTopStory || false}
                onChange={(e) => handleChange("homeTopStory", e.target.checked)}
                className="flag-checkbox"
              />
              <span className="flag-text">Home Top Story</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="flags-status-counter">
          {
            [
              article.trending,
              article.featured,
              article.topStory,
              article.grid,
              article.homeFeatured,
              article.homeLatest,
              article.homeTrending,
              article.homeTopStory,
            ].filter(Boolean).length
          }
          /8
        </div>
        <h3 className="section-title required">Article Content</h3>
        <p className="section-subtitle">Add paragraphs, headings, and quotes</p>
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
    </div>
  );
};

export default ArticleForm;