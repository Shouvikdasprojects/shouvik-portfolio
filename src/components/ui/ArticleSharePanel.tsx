'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArticleSharePanelProps {
  slug: string;
  title: string;
}

export default function ArticleSharePanel({ slug, title }: ArticleSharePanelProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/articles/${slug}`;
    }
    return '';
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    // Confetti burst for copying link
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff007f', '#8b5cf6', '#0ea5e9']
    });

    setTimeout(() => setCopied(false), 3000);
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* 1. Desktop Left Sticky Share Sidebar */}
      <div className="absolute top-48 left-[-80px] hidden xl:flex flex-col gap-4 items-center z-20">
        <span className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase rotate-90 mb-6 origin-center">
          SHARE ARTICLE
        </span>
        
        {/* Twitter / X */}
        <button
          onClick={shareToTwitter}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ff007f] hover:bg-[#ff007f]/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
          title="Share on X / Twitter"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ff007f] hover:bg-[#ff007f]/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
          title="Share on Facebook"
        >
          <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ff007f] hover:bg-[#ff007f]/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
          title="Share on WhatsApp"
        >
          <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`w-10 h-10 rounded-full bg-white/5 border transition-all cursor-pointer group flex items-center justify-center ${
            copied ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-white/10 hover:border-[#ff007f] hover:bg-[#ff007f]/10 text-gray-400 hover:text-white'
          }`}
          title="Copy Article Link"
        >
          <LinkIcon size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {copied && (
          <span className="text-[8px] font-bold font-mono text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded shadow absolute top-[210px] whitespace-nowrap animate-pulse">
            Link Copied!
          </span>
        )}
      </div>

      {/* 2. Mobile Floating Bottom Share Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 bg-[#0a0712]/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full z-40 xl:hidden shadow-[0_0_30px_rgba(255,0,127,0.15)] animate-fade-in">
        <span className="text-[10px] font-bold font-mono text-gray-400 mr-2 flex items-center gap-1">
          <Share2 size={12} className="text-[#ff007f] animate-pulse" /> Share:
        </span>

        {/* Twitter / X */}
        <button
          onClick={shareToTwitter}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center transition-all cursor-pointer"
        >
          <MessageSquare size={14} />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`w-8 h-8 rounded-full bg-white/5 border text-gray-300 flex items-center justify-center transition-all cursor-pointer ${
            copied ? 'border-green-500 bg-green-500/15 text-green-400' : 'border-white/10'
          }`}
        >
          <LinkIcon size={14} />
        </button>
      </div>
    </>
  );
}
