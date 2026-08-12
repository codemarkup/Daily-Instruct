import re

with open('components/admin/ArticleForm.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variables
state_vars = """
  const [isAnalyzingKeywords, setIsAnalyzingKeywords] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [keywordAnalysisResult, setKeywordAnalysisResult] = useState<any>(null);
  const [selectedKeywordSuggestions, setSelectedKeywordSuggestions] = useState<Record<string, boolean>>({});
  const [selectedKeywordsToKeep, setSelectedKeywordsToKeep] = useState<Record<string, boolean>>({});
"""
code = code.replace('  const [isAnalyzing, setIsAnalyzing] = useState(false);', '  const [isAnalyzing, setIsAnalyzing] = useState(false);\n' + state_vars)


# 2. Add handlers
handlers = """
  const handleAnalyzeKeywords = async () => {
    const currentContent = article.content as ContentBlock[] || [];
    if (currentContent.length === 0 || (currentContent.length === 1 && !currentContent[0].text)) {
      alert("Please add some content first to analyze keywords.");
      return;
    }

    const rawContent = currentContent.map(b => b.text).join('\\n');
    const currentKeywords = article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

    setIsAnalyzingKeywords(true);
    try {
      const res = await fetch('/api/admin/analyze-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawContent, keywords: currentKeywords })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        try {
          const errData = JSON.parse(errText);
          setTimeout(() => alert(errData.error || "Keyword analysis failed."), 10);
        } catch {
          setTimeout(() => alert(`Keyword analysis failed (${res.status}): ${errText.substring(0, 100)}`), 10);
        }
        return;
      }
      
      const data = await res.json();
      setKeywordAnalysisResult(data);
      
      const initialSuggestions: Record<string, boolean> = {};
      if (data.suggestedKeywords) {
        data.suggestedKeywords.forEach((k: any) => initialSuggestions[k.keyword] = true);
      }
      setSelectedKeywordSuggestions(initialSuggestions);

      const initialKeeps: Record<string, boolean> = {};
      if (data.existingKeywords) {
        data.existingKeywords.forEach((k: any) => initialKeeps[k.keyword] = k.action === 'Keep');
      }
      setSelectedKeywordsToKeep(initialKeeps);
      
      setShowKeywordModal(true);
    } catch (err: any) {
      console.error(err);
      setTimeout(() => alert(`Error during keyword analysis: ${err.message}`), 10);
    } finally {
      setIsAnalyzingKeywords(false);
    }
  };

  const applyKeywordAnalysis = () => {
    if (!keywordAnalysisResult) return;
    
    const finalKeywords: string[] = [];
    
    if (keywordAnalysisResult.existingKeywords) {
      keywordAnalysisResult.existingKeywords.forEach((k: any) => {
        if (selectedKeywordsToKeep[k.keyword]) {
          finalKeywords.push(k.keyword);
        }
      });
    }
    
    if (keywordAnalysisResult.suggestedKeywords) {
      keywordAnalysisResult.suggestedKeywords.forEach((k: any) => {
        if (selectedKeywordSuggestions[k.keyword] && !finalKeywords.includes(k.keyword)) {
          finalKeywords.push(k.keyword);
        }
      });
    }
    
    const capped = finalKeywords.slice(0, 10);
    handleChange("keywords", capped.join(', '));
    setShowKeywordModal(false);
  };
"""
code = code.replace('  const applyAnalysis = () => {', handlers + '\n  const applyAnalysis = () => {')


# 3. Replace label for SEO Keywords
old_label = """<label className="form-label">
            SEO Keywords
            <span className="label-hint">Press Enter to add</span>
          </label>"""
          
new_label = """<label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              SEO Keywords
              <span className="label-hint">Press Enter to add</span>
            </div>
            <button
              type="button"
              onClick={handleAnalyzeKeywords}
              disabled={isAnalyzingKeywords}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '4px',
                cursor: isAnalyzingKeywords ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isAnalyzingKeywords ? 'Analyzing...' : 'Search Analyze'}
            </button>
          </label>"""
code = code.replace(old_label, new_label)

# 4. Add the Modal JSX at the end, right before the last closing tags
# We will just find {showAnalysisModal && (...)} and append our modal right after it.
modal_jsx = """
      {/* KEYWORD ANALYSIS MODAL */}
      {showKeywordModal && keywordAnalysisResult && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '800px', width: '95%' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="modal-icon">🔎</span>
                Keyword Research Analysis
              </h3>
              <button onClick={() => setShowKeywordModal(false)} className="modal-close">✕</button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', color: '#1e293b' }}>
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Research Summary</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {keywordAnalysisResult.researchSummary}
                </p>
                
                {keywordAnalysisResult.toolCalls && keywordAnalysisResult.toolCalls.length > 0 && (
                  <details style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                    <summary style={{ cursor: 'pointer', color: '#64748b' }}>View Raw Search Findings</summary>
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', overflowX: 'auto' }}>
                      {keywordAnalysisResult.toolCalls.map((tc: any, i: number) => (
                        <div key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                          <strong style={{ color: '#0f172a' }}>Query:</strong> {tc.arguments ? JSON.parse(tc.arguments).pattern || JSON.parse(tc.arguments).query : tc.name}<br/>
                          <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#334155' }}>
                            {tc.output?.substring(0, 500) || "No preview"}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Existing Keywords */}
                <div>
                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Existing Keywords</h4>
                  {keywordAnalysisResult.existingKeywords?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      {keywordAnalysisResult.existingKeywords.map((k: any, i: number) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', padding: '8px', background: k.action === 'Keep' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${k.action === 'Keep' ? '#a7f3d0' : '#fecaca'}`, borderRadius: '6px' }}>
                          <input 
                            type="checkbox" 
                            checked={!!selectedKeywordsToKeep[k.keyword]}
                            onChange={(e) => setSelectedKeywordsToKeep({...selectedKeywordsToKeep, [k.keyword]: e.target.checked})}
                            style={{ marginTop: '4px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: k.action === 'Keep' ? '#065f46' : '#991b1b' }}>
                              {k.keyword} <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: k.action === 'Keep' ? '#d1fae5' : '#fee2e2', borderRadius: '4px', marginLeft: '4px' }}>{k.action}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{k.reason}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>No existing keywords to analyze.</p>
                  )}
                </div>

                {/* Suggested Keywords */}
                <div>
                  <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Suggested Additions</h4>
                  {keywordAnalysisResult.suggestedKeywords?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      {keywordAnalysisResult.suggestedKeywords.map((k: any, i: number) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', padding: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
                          <input 
                            type="checkbox" 
                            checked={!!selectedKeywordSuggestions[k.keyword]}
                            onChange={(e) => setSelectedKeywordSuggestions({...selectedKeywordSuggestions, [k.keyword]: e.target.checked})}
                            style={{ marginTop: '4px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e40af' }}>{k.keyword}</div>
                            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{k.reason}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>No new suggestions found.</p>
                  )}
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'right' }}>
                Total selected: {
                  Object.values(selectedKeywordsToKeep).filter(Boolean).length + 
                  Object.values(selectedKeywordSuggestions).filter(Boolean).length
                } / 10 limit
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setShowKeywordModal(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={applyKeywordAnalysis} 
                className="btn-primary"
                disabled={(Object.values(selectedKeywordsToKeep).filter(Boolean).length + Object.values(selectedKeywordSuggestions).filter(Boolean).length) > 10}
              >
                Apply Selected Tags
              </button>
            </div>
          </div>
        </div>
      )}
"""
if "KEYWORD ANALYSIS MODAL" not in code:
    code = code.replace('      {showAnalysisModal && (', modal_jsx + '\n      {showAnalysisModal && (')

with open('components/admin/ArticleForm.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully applied keyword analysis patches.")
