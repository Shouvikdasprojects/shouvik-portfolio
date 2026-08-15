'use client';

import { useState } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import { MessageSquare, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '@/lib/soundEffects';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('submitting');
    setErrorMsg('');
    sfx.playClick();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        
        sfx.playChime();

        // Celebrative confetti
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff007f', '#8b5cf6', '#0ea5e9', '#ffffff']
        });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Failed to connect to the mail carrier. Please try again.');
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 bg-[#0b0814]/50 border-white/10 relative rounded-3xl shadow-2xl">
      
      {status === 'success' && (
        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-center animate-fade-in">
          <span className="text-xs font-mono font-bold text-green-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} /> MESSAGE SENT SUCCESSFULLY!
          </span>
          <p className="text-xs text-gray-300 mt-1">
            Thank you for reaching out. Shouvik has received your message and will respond to your email shortly.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
          <span className="text-xs font-mono font-bold text-red-400 flex items-center justify-center gap-1.5">
            <AlertCircle size={16} /> SUBMISSION FAILED
          </span>
          <p className="text-xs text-gray-400 mt-1">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
              Your Name
            </label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Miller" 
              className="glass-input px-4 py-3 text-sm focus:border-primary rounded-xl"
              required 
              disabled={status === 'submitting'}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
              Your Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com" 
              className="glass-input px-4 py-3 text-sm focus:border-primary rounded-xl"
              required 
              disabled={status === 'submitting'}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
            Your Inquiry or Project Details
          </label>
          <textarea 
            id="message" 
            rows={5} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your Web3D project, UI/UX design collaboration, video editing, or YouTube idea..." 
            className="glass-input px-4 py-3 text-sm focus:border-primary resize-none rounded-xl"
            required 
            disabled={status === 'submitting'}
          />
        </div>

        <GlowButton 
          type="submit"
          className="w-full justify-center !py-4"
          disabled={status === 'submitting'}
          confettiBurst={false}
        >
          <MessageSquare size={16} /> 
          {status === 'submitting' ? 'DISPATCHING MESSAGE...' : 'SEND DIRECT MESSAGE'}
        </GlowButton>
      </form>
    </div>
  );
}
