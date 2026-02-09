import React, { useState } from 'react';
import { Search, BarChart3, Clock, Calendar, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import urlService from '../../services/urlService';

const Analytics = () => {
    const [shortCode, setShortCode] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!shortCode) return;

        setLoading(true);
        setError('');
        setData(null);

        try {
            // Extract code if full URL is pasted
            let code = shortCode.trim();
            if (code.includes('/')) {
                const parts = code.split('/');
                code = parts[parts.length - 1];
            }

            const result = await urlService.getAnalytics(code);
            setData(result);
        } catch (err) {
            console.error(err);
            setError(err.userMessage || 'Could not find analytics for this URL.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (data) => {
        const now = new Date();
        const expiry = data.expiresAt ? new Date(data.expiresAt) : null;
        
        if (data.isActive === false) return { label: 'Inactive', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
        if (expiry && expiry < now) return { label: 'Expired', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
        return { label: 'Active', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
            <div className="text-center mb-16 group">
                <div className="inline-flex items-center justify-center p-5 bg-primary/10 rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-primary/5">
                    <BarChart3 className="text-primary" size={48} />
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-text-main">
                    URL Analytics
                </h1>
                <p className="text-xl text-text-muted font-bold opacity-60 max-w-lg mx-auto leading-relaxed">
                    Real-time performance insights <br className="hidden md:block" />
                    for your shortened links.
                </p>
            </div>

            {/* Search Bar */}
            <form data-id="analytics-search-form" onSubmit={handleSearch} className="mb-20 max-w-3xl mx-auto bg-bg-card p-4 rounded-3xl shadow-2xl border-2 border-border dark:border-primary/10 flex flex-col md:flex-row items-center gap-4 relative transition-all duration-500 hover:shadow-primary/10 hover:border-primary/30">
                <div className="grow w-full relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <Search size={24} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Paste your short link or code here..." 
                        autoFocus
                        value={shortCode}
                        onChange={(e) => setShortCode(e.target.value)}
                        className="w-full pl-16 pr-4 py-6 rounded-2xl bg-bg-main border-2 border-transparent outline-none focus:border-primary/20 focus:bg-bg-card focus:ring-8 focus:ring-primary/5 transition-all duration-300 text-xl text-text-main placeholder:text-text-muted/40 disabled:opacity-50 font-medium"
                        disabled={loading}
                    />
                </div>
                
                <button 
type="submit"
disabled={loading || !shortCode.trim()}
className="
relative overflow-hidden
w-full md:w-auto px-12 py-6
bg-linear-to-br from-primary to-accent
hover:from-primary-hover hover:to-primary
text-white rounded-2xl font-black
transition-all duration-300
shadow-xl shadow-primary/30
hover:shadow-primary/50
hover:scale-[1.07]
active:scale-95
disabled:opacity-50 disabled:active:scale-100
flex items-center justify-center gap-3
text-xl group/btn min-w-[200px]
"
>
<span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></span>
{loading ? '...' : (
<>
Analyze
<ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
</>
)}
</button>

            </form>
            {error && (
                <div className="mb-10 max-w-2xl mx-auto p-5 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold justify-center animate-shake border border-red-500/20 shadow-lg shadow-red-500/5">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Stats Dashboard */}
            {data && (
                <div className="animate-in slide-in-from-bottom-12 fade-in duration-1000">
                    {/* Main Info Card */}
                    <div className="bg-bg-card border-2 border-primary/10 dark:border-primary/20 rounded-[40px] p-10 shadow-2xl mb-10 hover-lift relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-primary to-accent opacity-40"></div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="grow overflow-hidden text-left">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap size={14} className="text-primary fill-primary opacity-50" />
                                    <h3 className="text-xs font-black text-text-muted uppercase tracking-widest opacity-40">Original Destination</h3>
                                </div>
                                <a 
                                    href={data.originalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-2xl md:text-3xl font-black text-primary hover:text-accent break-all block transition-all leading-tight"
                                >
                                    {data.originalUrl}
                                </a>
                            </div>
                            
                            {/* Status Badge */}
                            {(() => {
                                const status = getStatusInfo(data);
                                return (
                                    <div className={`px-8 py-3 rounded-2xl border-2 text-sm font-black self-start md:self-auto shadow-xl transition-transform hover:scale-110 ${status.color}`}>
                                        {status.label}
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
                            <span className="font-black text-text-muted opacity-60 uppercase tracking-widest text-xs">Short Link:</span>
                            <span className="bg-bg-main dark:bg-bg-main/50 text-text-main px-5 py-3 rounded-2xl font-mono border border-border dark:border-primary/10 shadow-inner text-base">
                                {data.shortUrl}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Clicks */}
                        <div className="bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md p-10 rounded-4xl shadow-xl border-2 border-border/60 dark:border-primary/20 flex flex-col items-center justify-center text-center hover-lift hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 text-primary rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg shadow-primary/5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                                <BarChart3 size={32} />
                            </div>
                            <h4 className="text-5xl font-black mb-2">{data.clickCount}</h4>
                            <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em] opacity-80">Total Clicks</p>
                        </div>

                        {/* Created At */}
                        <div className="bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md p-10 rounded-4xl shadow-xl border-2 border-border/60 dark:border-primary/20 flex flex-col items-center justify-center text-center hover-lift hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white group-hover:-rotate-6 transition-all duration-500">
                                <Clock size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-2">
                                {new Date(data.createdAt).toLocaleDateString()}
                            </h4>
                            <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em] opacity-80">Created Date</p>
                        </div>

                        {/* Expires At */}
                        <div className="bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-md p-10 rounded-4xl shadow-xl border-2 border-border/60 dark:border-primary/20 flex flex-col items-center justify-center text-center hover-lift hover:scale-105 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg shadow-amber-500/5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                                <Calendar size={32} />
                            </div>
                            <h4 className="text-2xl font-black mb-2">
                                {data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'Never'}
                            </h4>
                            <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em] opacity-80">Expires On</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
