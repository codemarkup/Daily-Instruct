"use client";

import React, { useEffect, useState } from "react";
import ArticleRenderer from "@/components/ArticleRenderer";
import { Article } from "@/services/admin-service";
import Link from "next/link";

export default function PreviewPage() {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load article from localStorage
        try {
            const storedData = localStorage.getItem("admin_preview_draft");
            if (storedData) {
                setArticle(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to load preview data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
                Loading preview...
            </div>
        );
    }

    if (!article) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: '#000', minHeight: '100vh', color: '#fff' }}>
                <h1>No Preview Data Found</h1>
                <p>Please go back to the editor and click "Preview" again.</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#D4AF37',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Close Window
                </button>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Preview Banner */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: '#D4AF37',
                color: '#000',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                zIndex: 9999,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
                Preview Mode — Content not saved
                <button
                    onClick={() => window.close()}
                    style={{
                        marginLeft: '20px',
                        background: 'rgba(0,0,0,0.2)',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    Close Preview
                </button>
            </div>

            {/* Adding top margin to push content down below banner */}
            <div style={{ paddingTop: '40px' }}>
                <ArticleRenderer article={article} />
            </div>
        </div>
    );
}
