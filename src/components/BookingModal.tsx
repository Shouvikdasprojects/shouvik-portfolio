'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, X, Sparkles, CheckCircle2, User, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
  '08:30 PM',
];

const TIMEZONES = [
  { label: 'IST (India Standard Time - UTC+5:30)', value: 'IST' },
  { label: 'EST (US Eastern Time - UTC-5:00)', value: 'EST' },
  { label: 'PST (US Pacific Time - UTC-8:00)', value: 'PST' },
  { label: 'GMT/BST (London / Europe - UTC+0/1)', value: 'GMT' },
  { label: 'JST (Tokyo / Japan - UTC+9:00)', value: 'JST' },
];

const TOPICS = [
  '🌐 Web3D & Three.js Project',
  '🎨 UI/UX Architecture & Figma',
  '⚛️ Full-Stack Next.js Application',
  '🎬 Anime Content / Creator Collaboration',
  '💼 General Hiring / Engineering Contract',
];

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0].value);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      sfx.playWarp();
      setIsOpen(true);
      setIsSubmitted(false);
    };

    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    sfx.playClick();

    try {
      // Send booking inquiry to contact API
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: `📅 1-CLICK CALL BOOKING REQUEST:\n\n• Topic: ${selectedTopic}\n• Time Slot: ${selectedSlot} (${selectedTimezone})\n• Additional Notes: ${note || 'None'}\n\nClient requested meeting confirmation.`,
        }),
      });

      setIsSubmitted(true);
      sfx.playChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff007f', '#8b5cf6', '#0ea5e9'],
      });
    } catch {
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#080415]/95 border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,0,127,0.25)] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-white">Call Request Received!</h3>
            <p className="text-gray-300 text-xs sm:text-sm max-w-md leading-relaxed">
              Thank you, <strong className="text-white">{name}</strong>! Shouvik will review your selected slot (<strong className="text-primary">{selectedSlot} {selectedTimezone}</strong>) and send a Google Meet / Zoom invite to <strong className="text-white">{email}</strong> within 12 hours.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Done / Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="flex flex-col gap-5 text-left">
            <div>
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 mb-2">
                <Sparkles size={11} /> 1-CLICK DISCOVERY CALL
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Schedule a 1-on-1 <span className="gradient-text-glow">Strategy Session</span>
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Select your preferred timezone and slot to discuss Web3D contracts, UI/UX architecture, or creator partnerships.
              </p>
            </div>

            {/* Timezone Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase flex items-center gap-1">
                <Globe size={12} className="text-primary" /> Your Preferred Timezone
              </label>
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-primary text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-[#0b071a] text-white">
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase flex items-center gap-1">
                <Clock size={12} className="text-secondary" /> Select Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedSlot(slot);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                      selectedSlot === slot
                        ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                Meeting Focus / Agenda
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-white/5 border border-white/10 focus:border-primary text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                {TOPICS.map((top) => (
                  <option key={top} value={top} className="bg-[#0b071a] text-white">
                    {top}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="bg-white/5 border border-white/10 focus:border-primary px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="bg-white/5 border border-white/10 focus:border-primary px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,0,127,0.4)] cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting Schedule...' : 'Confirm Call Booking Request'} <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
