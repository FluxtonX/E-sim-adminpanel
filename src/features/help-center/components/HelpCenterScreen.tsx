'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  MessageSquare,
  ExternalLink,
  Video,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Ticket
} from 'lucide-react';

// ─── Resource Cards ───────────────────────────────────────────────────────────
const RESOURCES = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Platform guides and tutorials',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'Live Support',
    description: 'Chat with our team',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
  },
  {
    icon: ExternalLink,
    title: 'API Reference',
    description: 'Developer documentation',
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step walkthroughs',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 'faq-1',
    question: 'How do I purchase eSIM inventory in bulk?',
    answer: 'Navigate to Inventory Management and click "Add Inventory". Select your provider, choose package types and quantities, then confirm the purchase. Bulk orders of 100+ SIMs receive automatic volume discounts.',
  },
  {
    id: 'faq-2',
    question: 'How do I set up a new merchant account?',
    answer: 'Go to the Merchants section and click "Invite Merchant". Fill in their business details, set their commission tier, and send an invitation email. Once they accept, their account will be active within 24 hours.',
  },
  {
    id: 'faq-3',
    question: 'What happens when an eSIM expires?',
    answer: 'Expired eSIMs are automatically deactivated and moved to the "Expired" status in your inventory. Customers are notified 7 days before expiry via email. You can reactivate or extend plans from the eSIM Management page.',
  },
  {
    id: 'faq-4',
    question: 'How are commissions calculated and paid?',
    answer: 'Commissions are calculated as a percentage of each sale based on your merchant tier. Payments are processed monthly on the 1st. You can view detailed commission breakdowns in the Finance dashboard.',
  },
  {
    id: 'faq-5',
    question: 'Can I create custom packages for specific merchants?',
    answer: 'Yes! Use the Package Builder to create tailored packages. You can set custom data limits, validity periods, regional coverage, and pricing tiers specific to individual merchants or merchant groups.',
  },
  {
    id: 'faq-6',
    question: 'How do I generate an API key for integration?',
    answer: 'Go to API Management and click "Generate Key". Name your key, select the access scope (Full Access, Read-only, or Billing Admin), and click Generate. Store your key securely — it will only be shown once.',
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ faq }: { faq: typeof FAQS[number] }) {
  const [isOpen, setIsOpen] = useState(faq.id === 'faq-1');

  return (
    <div className="border-b border-slate-100 dark:border-slate-850 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
      >
        <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
          {faq.question}
        </span>
        <span className="shrink-0 text-slate-400">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="pb-4 text-xs font-semibold text-blue-700 dark:text-blue-300 leading-relaxed animate-fadeIn">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HelpCenterScreen() {
  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Page header */}
      <div className="border-b border-slate-150/40 pb-5 dark:border-slate-850">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Help Center
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
          Documentation, FAQs, and support resources.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RESOURCES.map(({ icon: Icon, title, description, color }) => (
          <Card
            key={title}
            className="border-slate-100/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-5 flex flex-col gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {title}
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="border-slate-100/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/10 px-6 py-4 border-b border-slate-100 dark:border-slate-900">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-300">
            Frequently Asked Questions
          </h2>
        </div>
        <CardContent className="px-6 py-0">
          {FAQS.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </CardContent>
      </Card>

      {/* Still need help CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-blue-500/15">
        <div>
          <h3 className="text-base font-bold text-white">Still need help?</h3>
          <p className="text-xs font-semibold text-blue-100 mt-0.5">
            Our support team is available 24/7 to assist you with any platform questions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold text-xs flex items-center gap-1.5"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Live Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5"
          >
            <Ticket className="h-3.5 w-3.5" />
            Submit Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
