'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minus, 
  EyeOff, 
  Eye, 
  GripHorizontal,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'Tech Stack ⚡',
  'Top Projects 🚀',
  'How to Hire 💼',
  'YouTube & Anime 🎌',
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hi there! I am Shouvik's **AI Portfolio Assistant**. Ask me anything about his Web3D projects, tech stack, YouTube channels, or how to hire him!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleCustomOpen = () => {
      sfx.playWarp();
      setIsHidden(false);
      setIsOpen(true);
    };
    window.addEventListener('open-ai-chat', handleCustomOpen);
    return () => window.removeEventListener('open-ai-chat', handleCustomOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);
    sfx.playClick();

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const aiReply = data.reply || "I'm having trouble connecting right now, but you can always reach Shouvik directly at shouvikdaswork@gmail.com!";

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      sfx.playChime();
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Couldn't reach the AI engine. Please email Shouvik directly at **shouvikdaswork@gmail.com**!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick formatter for basic markdown in text
  const formatText = (text: string) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    formatted = formatted.replace(/• (.*?)(\n|$)/g, '<li class="ml-4 list-disc text-gray-300">$1</li>');
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline hover:text-white transition-colors">$1</a>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  // 1. Minimized / Hidden Floating Orb (Freely Draggable)
  if (isHidden) {
    return (
      <aside aria-label="AI Assistant Minimized" className="fixed bottom-6 left-6 z-50 print:hidden">
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.08}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="cursor-grab active:cursor-grabbing select-none"
        >
          <button
            onClick={() => {
              if (isDragging) return;
              sfx.playWarp();
              setIsHidden(false);
            }}
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#0d0820]/95 backdrop-blur-2xl border border-primary/50 hover:border-primary text-primary hover:text-white shadow-[0_0_25px_rgba(255,0,127,0.4)] transition-all cursor-grab active:cursor-grabbing"
            title="Drag anywhere or click to open AI Assistant"
          >
            <Bot size={19} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute left-14 px-2.5 py-1 rounded-xl bg-[#090518]/95 border border-white/10 text-[10px] font-mono text-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              Drag anywhere • Click to open AI
            </span>
          </button>
        </motion.div>
      </aside>
    );
  }

  return (
    <aside aria-label="AI Portfolio Assistant" className="fixed bottom-6 left-6 z-50 print:hidden">
      {/* 2. Draggable Launcher Pill */}
      {!isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.08}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-1 p-1 pr-2 rounded-full bg-[#0d0820]/95 backdrop-blur-2xl border border-primary/40 hover:border-primary shadow-[0_0_30px_rgba(255,0,127,0.35)] cursor-grab active:cursor-grabbing select-none"
        >
          {/* Drag handle icon */}
          <div className="pl-2 pr-1 text-gray-500 hover:text-gray-300 cursor-grab" title="Drag to move anywhere">
            <GripHorizontal size={14} />
          </div>

          {/* Main open button */}
          <button
            onClick={() => {
              if (isDragging) return;
              sfx.playWarp();
              setIsOpen(true);
            }}
            className="flex items-center gap-2 text-white text-xs font-bold font-mono transition-all cursor-pointer py-1"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 border border-primary/40">
              <Bot size={13} className="text-primary animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="tracking-wide">Ask AI</span>
            <Sparkles size={12} className="text-secondary" />
          </button>

          {/* Hide button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sfx.playClick();
              setIsHidden(true);
            }}
            className="w-5 h-5 ml-1 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
            title="Hide AI Assistant"
          >
            <EyeOff size={11} />
          </button>
        </motion.div>
      )}

      {/* 3. Draggable Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-[#070412]/98 backdrop-blur-3xl border border-primary/30 rounded-3xl shadow-[0_0_60px_rgba(255,0,127,0.3)] overflow-hidden"
          >
            {/* Header (Acts as drag bar) */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/15 via-secondary/15 to-transparent border-b border-white/8 cursor-grab active:cursor-grabbing select-none">
              <div className="flex items-center gap-2">
                <GripHorizontal size={14} className="text-gray-500 mr-0.5" />
                <div className="relative w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Bot size={15} className="text-primary" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                    Shouvik AI <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1 py-0.2 rounded">ONLINE</span>
                  </h3>
                  <span className="text-[9px] text-gray-400 font-mono">Portfolio Knowledge Engine</span>
                </div>
              </div>

              {/* Action Controls: Hide & Close */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsOpen(false);
                    setIsHidden(true);
                  }}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Hide Assistant"
                >
                  <EyeOff size={12} />
                </button>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsOpen(false);
                  }}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Chat"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={12} className="text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                        : 'bg-white/[0.04] border border-white/8 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                    />
                    <span className={`text-[9px] font-mono block mt-1.5 ${m.sender === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-primary" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/8 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span className="text-gray-400 font-mono text-[10px]">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-gray-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/8 bg-[#040209]/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skills, projects, rates..."
                  className="flex-1 bg-white/5 border border-white/10 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 text-white transition-all shadow-[0_0_12px_rgba(255,0,127,0.3)] cursor-pointer shrink-0"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
