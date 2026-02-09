import React, { useState } from 'react';
import { Link, Copy, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import urlService from '../../services/urlService';
import Toast from '../../components/common/Toast';

/**
 * Home Page component.
 * Provides the primary URL shortening interface.
 * Features:
 * - Real-time client-side URL validation.
 * - Integration with urlService for backend shortening.
 * - Result display with animated entry and clipboard integration.
 * - Global toast feedback for user actions.
 */
const Home = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { message: '', type: 'success' }

  /**
   * Validates if a string is a well-formed HTTP/HTTPS URL.
   * Auto-prepends 'https://' if protocol is missing for user convenience.
   * @param {string} string - The raw input URL
   * @returns {boolean}
   */
  const isValidUrl = (string) => {
    try {
      const parsed = new URL(string.startsWith('http') ? string : `https://${string}`);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  /**
   * Handles the URL shortening submission.
   * Orchestrates form validation, loading states, and API communication.
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    // Inline Validation: Prevent unnecessary API calls
    if (!trimmedUrl) {
      setError('A URL is required.');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL (e.g., google.com or https://google.com)');
      return;
    }

    if (trimmedUrl.length > 2000) {
      setError('URL is too long. Max 2000 characters.');
      return;
    }

    setError('');
    setResult(null);
    setIsLoading(true);

    try {
        const data = await urlService.shortenUrl(trimmedUrl);
        setResult(data);
        setToast({ message: 'URL shortened successfully!', type: 'success' });
    } catch (err) {
        console.error(err);
        // Extracts backend-provided user messages or fallbacks to a default error
        const errorMsg = err.userMessage || 'Failed to shorten URL. Please try again.';
        setError(errorMsg);
        setToast({ message: errorMsg, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  /**
   * Copies the generated short URL to the system clipboard.
   * Uses modern Clipboard API with a fallback for older browsers.
   */
  const handleCopy = () => {
    if (!result?.shortUrl) return;

    /**
     * Utility to handle multi-method clipboard writing.
     * @param {string} text - Content to copy
     */
    const copyToClipboard = async (text) => {
      // Primary: Modern Async Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (err) {
          console.error("Clipboard API failed", err);
        }
      }

      // Secondary: Fallback to execCommand('copy') using a hidden textarea
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        console.error("Fallback copy failed", err);
        return false;
      }
    };

    copyToClipboard(result.shortUrl).then(success => {
      if (success) {
        setIsCopied(true);
        setToast({ message: 'Link copied to clipboard!', type: 'success' });
        setTimeout(() => setIsCopied(false), 2000); // Reset success state after 2s
      } else {
        setToast({ message: 'Failed to copy. Please copy manually.', type: 'error' });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 animate-in fade-in zoom-in duration-500">
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-text-main">
          Shorten your links.<br /> 
          <span className="text-primary">Share smarter.</span>
        </h1>
        <p className="text-xl text-text-muted max-w-xl mx-auto font-medium">
          Simple, fast, and reliable link shortening.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-3xl px-4">
        <form onSubmit={handleSubmit} className="bg-bg-card p-4 rounded-3xl shadow-2xl border-2 border-border dark:border-primary/10 flex flex-col md:flex-row items-center gap-4 relative transition-all duration-500 hover:shadow-primary/10 hover:border-primary/30">
            <div className="grow w-full relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                    <Link size={24} />
                </div>
                <input 
                    type="text" 
                    placeholder="Paste your long URL here..." 
                    autoFocus
                    disabled={isLoading}
                    className="w-full pl-16 pr-4 py-6 rounded-2xl bg-bg-main border-2 border-transparent outline-none focus:border-primary/20 focus:bg-bg-card focus:ring-8 focus:ring-primary/5 transition-all duration-300 text-xl text-text-main placeholder:text-text-muted/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-12 py-6 bg-linear-to-br from-primary to-accent hover:from-primary-hover hover:to-primary active:scale-95 text-white font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 min-w-[220px]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={24} />
                        Shortening...
                    </>
                ) : (
                    <>
                        Shorten URL <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
        {error && (
            <div className="flex items-center gap-3 text-red-500 text-sm mt-6 ml-2 font-bold bg-red-500/10 px-6 py-4 rounded-2xl border border-red-500/20 animate-shake shadow-lg shadow-red-500/5">
                <AlertCircle size={20} />
                {error}
            </div>
        )}
      </div>

      {/* Result Section */}
      {result && (
        <div className="w-full max-w-2xl px-4 mt-16 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="bg-bg-card border-2 border-primary/10 dark:border-primary/20 rounded-3xl p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 relative overflow-hidden group hover:border-primary/30 dark:hover:border-primary/40">
                <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-primary to-accent opacity-40"></div>
                <div className="grow overflow-hidden w-full text-left">
                    <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-3 opacity-40">Generated Link</p>
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="text-3xl md:text-4xl font-black text-primary hover:text-accent transition-all truncate block">
                        {result.shortUrl}
                    </a>
                    <p className="text-sm font-medium text-text-muted truncate mt-3 opacity-60">Original: {result.originalUrl}</p>
                </div>
                <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-8 py-5 rounded-2xl font-black transition-all duration-300 active:scale-90 border-2 shadow-lg shadow-black/5 hover:scale-110 ${
                        isCopied 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
                        : 'bg-bg-main text-text-main hover:bg-border border-border'
                    }`}
                >
                    {isCopied ? (
                        <>
                            <Check size={22} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={22} />
                            Copy
                        </>
                    )}
                </button>
            </div>
        </div>
      )}

      {/* Social Proof / Stats Lite */}
      <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-12 delay-700">
        <div className="flex items-center gap-8 p-8 bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md rounded-4xl border-2 border-border/60 dark:border-primary/20 hover:border-primary/40 dark:hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover-lift group transition-all duration-500">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">🔗</div>
            <div className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-semibold text-text-main leading-tight">1M+</h3>
                <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] opacity-70">Links Shortened</p>
            </div>
        </div>
        <div className="flex items-center gap-8 p-8 bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md rounded-4xl border-2 border-border/60 dark:border-primary/20 hover:border-primary/40 dark:hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover-lift group transition-all duration-500">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">⚡</div>
            <div className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-semibold text-text-main leading-tight">500K+</h3>
                <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] opacity-70">Clicks Tracked</p>
            </div>
        </div>
        <div className="flex items-center gap-8 p-8 bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md rounded-4xl border-2 border-border/60 dark:border-primary/20 hover:border-primary/40 dark:hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover-lift group transition-all duration-500">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">💎</div>
            <div className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-semibold text-text-main leading-tight">99.9%</h3>
                <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] opacity-70">Uptime Service</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
