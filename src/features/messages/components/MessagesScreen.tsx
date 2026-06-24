'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreHorizontal, Circle } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'TravelTech Solutions',
    initials: 'TT',
    preview: 'Can we get bulk pricing for 500+ SIMs',
    time: '2m ago',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', sender: 'them', text: "Hi! We're looking to purchase 500+ eSIMs for our tour operators. Can we discuss bulk pricing?", time: '10:32 AM' },
      { id: 'm2', sender: 'me', text: 'Hello! Absolutely, we offer volume discounts for orders over 100 SIMs. For 500+, you would qualify for our Enterprise tier with 18% commission.', time: '10:35 AM' },
      { id: 'm3', sender: 'them', text: 'That sounds great. Do we also get dedicated account management and priority support?', time: '10:37 AM' },
      { id: 'm4', sender: 'me', text: 'Yes! Enterprise tier includes a dedicated account manager, 24/7 priority support, and custom package creation. Let me send you our Enterprise brochure.', time: '10:40 AM' },
      { id: 'm5', sender: 'them', text: 'Can we get bulk pricing for 500+ SIMs?', time: '10:42 AM' },
    ],
  },
  {
    id: 'conv-2',
    name: 'NomadSIM Support',
    initials: 'NS',
    preview: 'Invoice INV-2024-011 is ready for review.',
    time: '1h ago',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', sender: 'them', text: 'Invoice INV-2024-011 is ready for review.', time: '9:15 AM' },
      { id: 'm2', sender: 'me', text: 'Thanks, I will check it now and get back to you shortly.', time: '9:18 AM' },
    ],
  },
  {
    id: 'conv-3',
    name: 'GlobalConnect Ltd',
    initials: 'GC',
    preview: 'Activation issue with order ORD-2024',
    time: '3h ago',
    unread: 1,
    online: true,
    messages: [
      { id: 'm1', sender: 'them', text: 'We are experiencing an activation issue with order ORD-2024-882. The eSIM is not activating in Germany.', time: '8:05 AM' },
      { id: 'm2', sender: 'me', text: 'Let me look into that right away. Can you confirm the ICCID number?', time: '8:10 AM' },
      { id: 'm3', sender: 'them', text: 'ICCID: 89490200001234567890', time: '8:12 AM' },
    ],
  },
  {
    id: 'conv-4',
    name: 'Technical Team',
    initials: 'TM',
    preview: 'API rate limits have been increased.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', sender: 'me', text: 'Hey team, can we increase the API rate limits for the production key?', time: 'Yesterday' },
      { id: 'm2', sender: 'them', text: 'API rate limits have been increased. The new limit is 10,000 req/min for production keys.', time: 'Yesterday' },
    ],
  },
  {
    id: 'conv-5',
    name: 'James Wilson',
    initials: 'JW',
    preview: "My eSIM isn't connecting in Spain.",
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', sender: 'them', text: "My eSIM isn't connecting in Spain. I've tried restarting twice.", time: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Sorry to hear that. Please try enabling data roaming in Settings > Mobile Data > Roaming. Let me know if that resolves it.', time: 'Yesterday' },
    ],
  },
];

// Avatar color palette based on initials
const AVATAR_COLORS: Record<string, string> = {
  TT: 'bg-blue-500',
  NS: 'bg-violet-500',
  GC: 'bg-emerald-500',
  TM: 'bg-amber-500',
  JW: 'bg-rose-500',
};

function getAvatarColor(initials: string) {
  return AVATAR_COLORS[initials] ?? 'bg-slate-500';
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId)!;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConversation?.messages.length]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], preview: text, time: 'Just now' }
          : c
      )
    );
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-850 shadow-sm bg-white dark:bg-slate-950 animate-fadeIn select-none">

      {/* ── Left panel: Conversation list ───────────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-900 shrink-0">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h1>
          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder:text-slate-400 outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => handleSelectConversation(conv.id)}
                className={`w-full text-left flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 dark:border-slate-900/60 transition-colors ${
                  isActive
                    ? 'bg-blue-50/60 dark:bg-blue-950/10'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/20'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`h-9 w-9 rounded-full ${getAvatarColor(conv.initials)} flex items-center justify-center text-white text-[11px] font-black`}>
                    {conv.initials}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-1">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold truncate">{conv.preview}</p>
                    {conv.unread > 0 && (
                      <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right panel: Chat view ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`h-9 w-9 rounded-full ${getAvatarColor(activeConversation.initials)} flex items-center justify-center text-white text-[11px] font-black`}>
                {activeConversation.initials}
              </div>
              {activeConversation.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-850 dark:text-white">{activeConversation.name}</h2>
              <div className="flex items-center gap-1 mt-0.5">
                {activeConversation.online ? (
                  <>
                    <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-500">Online</span>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">Offline</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeConversation.messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {/* Their avatar */}
                {!isMe && (
                  <div className={`h-7 w-7 rounded-full ${getAvatarColor(activeConversation.initials)} flex items-center justify-center text-white text-[9px] font-black shrink-0 mb-1`}>
                    {activeConversation.initials}
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold px-1">{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 focus-within:border-blue-400 transition-colors">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder:text-slate-400 outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm shadow-blue-500/20"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
