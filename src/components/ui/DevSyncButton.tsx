'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DevSyncButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setStatus("Syncing live articles with Gemini & Supabase...");

    try {
      // Force fetching all 40 articles at once since localhost has no serverless timeout limits
      const response = await fetch('/api/cron-news?forceAll=true', {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus(`Successfully synced! Ingested ${data.processedCount} articles.`);
        // Reload after success to render newly synced Supabase items immediately
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || data.details || "API execution failed.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Database sync failed.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Toast Notification HUD */}
      {(status || error) && (
        <div className="glass-panel p-4 bg-[#0a0712]/95 border border-white/10 rounded-xl text-xs max-w-xs shadow-[0_0_20px_rgba(255,0,127,0.15)] flex items-center gap-2 animate-fade-in text-left">
          {error ? (
            <>
              <AlertTriangle className="text-red-500 shrink-0 animate-bounce" size={16} />
              <div>
                <span className="font-bold text-red-400 block font-mono">SYNC ERROR</span>
                <p className="text-gray-400 mt-0.5">{error}</p>
              </div>
            </>
          ) : (
            <>
              {loading ? (
                <RefreshCw className="text-[#ff007f] shrink-0 animate-spin" size={16} />
              ) : (
                <CheckCircle className="text-green-500 shrink-0" size={16} />
              )}
              <div>
                <span className="font-bold text-[#ff007f] block font-mono">DEVELOPER ENGINE</span>
                <p className="text-gray-300 mt-0.5">{status}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* manual Sync Action Trigger */}
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-5 py-3 rounded-full bg-gradient-to-r from-[#ff007f] to-[#8b5cf6] hover:opacity-95 disabled:opacity-50 text-white font-bold font-mono text-[10px] tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,127,0.4)] transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        title="Developer Mode: Sync Database"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'SYNCING DATABASE...' : 'MANUAL SYNC DB'}
      </button>
    </div>
  );
}
