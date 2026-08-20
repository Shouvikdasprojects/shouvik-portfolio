'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';
import { personalInfo, projectsList, socialLinks } from '@/lib/realData';

interface CommandOutput {
  command: string;
  output: string | React.ReactNode;
}

export default function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'init',
      output: (
        <div className="text-gray-400 space-y-1">
          <p className="text-primary font-bold">🚀 Shouvik Das CyberOS Developer Terminal [Version 4.2.0-spatial]</p>
          <p className="text-gray-400">Type <span className="text-yellow-400 font-bold">&apos;help&apos;</span> to inspect all accessible system commands.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      sfx.playWarp();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with backquote / tilde key if not in an input
      if (e.key === '`' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('open-terminal', handleOpen);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-terminal', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    sfx.playClick();

    let output: React.ReactNode;

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-yellow-400 font-bold">AVAILABLE SYSTEM COMMANDS:</p>
            <p><span className="text-primary font-bold">bio</span> - Print Shouvik&apos;s biography and vision</p>
            <p><span className="text-primary font-bold">skills</span> - Inspect technical skill matrix</p>
            <p><span className="text-primary font-bold">projects</span> - List all production applications</p>
            <p><span className="text-primary font-bold">socials</span> - Output all 10+ social profile links</p>
            <p><span className="text-primary font-bold">hire</span> - Access direct contract &amp; email channel</p>
            <p><span className="text-primary font-bold">clear</span> - Purge terminal buffer</p>
            <p><span className="text-primary font-bold">exit</span> - Terminate terminal session</p>
          </div>
        );
        break;

      case 'bio':
        output = (
          <div className="text-gray-300 text-xs leading-relaxed space-y-1">
            <p><strong className="text-white">{personalInfo.name}</strong> - {personalInfo.role}</p>
            <p className="text-gray-400">{personalInfo.bio}</p>
            <p className="text-primary">📍 Location: {personalInfo.aboutDetails.location}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="text-primary font-bold">CREATIVE SKILLS ENGINE:</p>
            <p>⚡ Next.js 16 &amp; React 19: <span className="text-green-400">[██████████] 98%</span></p>
            <p>🌐 Three.js &amp; WebGL 3D: <span className="text-green-400">[█████████░] 92%</span></p>
            <p>🎨 UI/UX &amp; Figma Architecture: <span className="text-green-400">[██████████] 96%</span></p>
            <p>🎬 Video Editing &amp; VFX: <span className="text-green-400">[█████████░] 94%</span></p>
            <p>🚀 Cloudflare Workers &amp; Edge: <span className="text-green-400">[█████████░] 90%</span></p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-primary font-bold">SHIPPED PRODUCTION APPLICATIONS:</p>
            {projectsList.slice(0, 5).map((p) => (
              <div key={p.title} className="border-l-2 border-primary/40 pl-2">
                <p className="text-white font-bold">{p.title} <span className="text-gray-500 font-normal">({p.techStack.slice(0, 3).join(', ')})</span></p>
                <p className="text-gray-400 text-[11px]">{p.description.slice(0, 90)}...</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'socials':
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-primary font-bold">DIRECT CHANNEL DIRECTORY:</p>
            {socialLinks.slice(0, 6).map((s) => (
              <p key={s.name}>
                <span className="text-gray-400">{s.name}:</span>{' '}
                <a href={s.url} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-white">
                  {s.username} ({s.followers})
                </a>
              </p>
            ))}
          </div>
        );
        break;

      case 'hire':
        output = (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl space-y-1 text-xs">
            <p className="text-white font-bold">💼 STATUS: OPEN FOR CONTRACTS &amp; ROLES</p>
            <p className="text-gray-300">Email: <a href={`mailto:${personalInfo.email}`} className="text-primary underline">{personalInfo.email}</a></p>
            <p className="text-gray-300">HeyLink: <a href={personalInfo.heylink} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{personalInfo.heylink}</a></p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        setIsOpen(false);
        setInput('');
        return;

      case '':
        output = null;
        break;

      default:
        output = (
          <p className="text-red-400 text-xs">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-yellow-400 font-bold">&apos;help&apos;</span> for a list of valid commands.
          </p>
        );
    }

    setHistory(prev => [...prev, { command: cmdStr, output }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full bg-[#05020c]/95 border border-primary/40 rounded-2xl shadow-[0_0_60px_rgba(255,0,127,0.3)] flex flex-col overflow-hidden transition-all duration-300 font-mono ${
          isMaximized ? 'h-[92vh] max-w-6xl' : 'h-[480px] max-w-3xl'
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c071a] border-b border-white/8 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 cursor-pointer" onClick={() => setIsOpen(false)} />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:opacity-80 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:opacity-80 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />
            <span className="text-xs text-gray-400 font-bold ml-2 flex items-center gap-1.5">
              <TerminalIcon size={13} className="text-primary" /> shouvik@cyberos:~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:text-white transition-colors cursor-pointer"
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-mono scrollbar-thin scrollbar-thumb-primary/30">
          {history.map((h, idx) => (
            <div key={idx} className="space-y-1.5">
              {h.command !== 'init' && (
                <div className="flex items-center gap-2 text-primary font-bold">
                  <span className="text-emerald-400">shouvik@portfolio:~$</span>
                  <span className="text-white">{h.command}</span>
                </div>
              )}
              {h.output && <div className="pl-2">{h.output}</div>}
            </div>
          ))}

          {/* Interactive prompt input line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(input);
            }}
            className="flex items-center gap-2 text-xs font-mono pt-1"
          >
            <span className="text-emerald-400 shrink-0">shouvik@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none caret-primary"
              autoFocus
              placeholder="type 'help'..."
            />
          </form>
          <div ref={terminalEndRef} />
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-1.5 bg-[#080414] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
          <span>Press <kbd className="bg-white/10 px-1 rounded text-gray-300">~</kbd> or <kbd className="bg-white/10 px-1 rounded text-gray-300">ESC</kbd> to toggle</span>
          <span className="text-primary font-bold">CYBEROS // KERNEL ONLINE</span>
        </div>
      </div>
    </div>
  );
}
