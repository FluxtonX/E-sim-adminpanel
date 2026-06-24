'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  X,
  Mail,
  ChevronDown,
  Check,
  Paperclip,
  Trash2,
  FileImage,
  Send
} from 'lucide-react';

interface EmailComposerModalProps {
  customer: { name: string; email: string; id?: string };
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: TemplateType;
}

type TemplateType = 'custom' | 'activation' | 'data_usage' | 'expiry' | 'receipt';

const getTemplateData = (type: TemplateType, name: string) => {
  switch (type) {
    case 'activation':
      return {
        subject: `Your eSIM Profile is Ready - United Union`,
        body: `Dear ${name},\n\nThank you for choosing United Union. Your eSIM profile is ready for download.\n\nLPA Code: LPA:1$rsp.unitedunion.com$activation_ref_898823\nPackage: 10GB Europe Data\nValidity: 30 Days\n\nPlease find your activation QR Code attached to this email. Scan it with your device settings (Settings > Mobile Data > Add eSIM) to provision your cellular connection.\n\nBest regards,\nOperations Team`,
        attachments: [{ name: 'esim_activation_qr.png', size: '42 KB', type: 'image' }]
      };
    case 'data_usage':
      return {
        subject: `Data Usage Alert: 80% Quota Reached`,
        body: `Dear ${name},\n\nThis is an automated notification from United Union. You have consumed 80% of your data quota on your current eSIM package.\n\nRemaining Balance: 2.0 GB of 10.0 GB.\n\nTo ensure uninterrupted service and avoid suspension, please log in to your dashboard to top up your balance or purchase an add-on.\n\nBest regards,\nSystem Administration`,
        attachments: []
      };
    case 'expiry':
      return {
        subject: `Service Warning: eSIM Validity Exposing Soon`,
        body: `Dear ${name},\n\nPlease be advised that your eSIM validity period is expiring in 48 hours.\n\nOnce expired, cellular data connectivity will terminate automatically. You may purchase a renewal package directly from the reseller portal to maintain service.\n\nBest regards,\nBilling Operations`,
        attachments: []
      };
    case 'receipt':
      return {
        subject: `Settled Transaction Statement - Order ORD-2024-001`,
        body: `Dear ${name},\n\nA reseller balance settlement has completed successfully on your account.\n\nAmount: $24.99\nSettlement Ref: tx_829038421\nPayment Method: res_balance\n\nA detailed PDF invoice breakdown is attached to this statement.\n\nBest regards,\nFinance Department`,
        attachments: [{ name: 'invoice_ORD-2024-001.pdf', size: '128 KB', type: 'pdf' }]
      };
    case 'custom':
    default:
      return { subject: '', body: '', attachments: [] };
  }
};

export default function EmailComposerModal({ customer, isOpen, onClose, initialTemplate = 'custom' }: EmailComposerModalProps) {
  const initData = getTemplateData(initialTemplate, customer.name);
  
  const [template, setTemplate] = useState<TemplateType>(initialTemplate);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [subject, setSubject] = useState(initData.subject);
  const [body, setBody] = useState(initData.body);
  const [isSending, setIsSending] = useState(false);
  
  // Attachments state
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>(initData.attachments);

  // Update form inputs when template changes
  const applyTemplate = (type: TemplateType) => {
    setTemplate(type);
    const data = getTemplateData(type, customer.name);
    setSubject(data.subject);
    setBody(data.body);
    setAttachments(data.attachments);
  };

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsSending(false);
    alert(`Email successfully sent to ${customer.email}!`);
    onClose();
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-lg shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Compose Notification</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Prefilled Reseller Communications</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSend} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          
          {/* Recipient Field */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              To Recipient
            </label>
            <input
              type="text"
              disabled
              value={`${customer.name} <${customer.email}>`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
            />
          </div>

          {/* Template Selector Dropdown */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Message Template
            </label>
            <button
              type="button"
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 outline-none transition-all dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
            >
              <span>
                {template === 'custom' && 'Custom Message'}
                {template === 'activation' && 'eSIM Activation Details & QR'}
                {template === 'data_usage' && 'Data Threshold Warning (80%)'}
                {template === 'expiry' && 'Package Expiration Warning'}
                {template === 'receipt' && 'Reseller Invoice Settlement'}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {templateDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTemplateDropdownOpen(false)} />
                <div className="absolute left-0 right-0 mt-1.5 z-20 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-950 animate-fadeIn origin-top">
                  {[
                    { id: 'custom', label: 'Custom Message' },
                    { id: 'activation', label: 'eSIM Activation Details & QR' },
                    { id: 'data_usage', label: 'Data Threshold Warning (80%)' },
                    { id: 'expiry', label: 'Package Expiration Warning' },
                    { id: 'receipt', label: 'Reseller Invoice Settlement' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        applyTemplate(t.id as TemplateType);
                        setTemplateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                        template === t.id
                          ? 'bg-slate-50 text-blue-600 dark:bg-slate-900 dark:text-blue-400'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span>{t.label}</span>
                      {template === t.id && (
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Subject Line */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject line..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Message Body
            </label>
            <textarea
              required
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type message text here..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-none font-sans"
            />
          </div>

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                System Attachments
              </label>
              <div className="space-y-1.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2 border border-slate-100/80 dark:bg-slate-900/40 dark:border-slate-850"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-blue-100/60 text-blue-600 flex items-center justify-center dark:bg-blue-950/40 dark:text-blue-400">
                        {file.type === 'image' ? (
                          <FileImage className="h-4 w-4" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">
                          {file.name}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
                          {file.size}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-slate-405 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons Row */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50 dark:border-slate-900/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="border-slate-200 text-slate-700 bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSending}
              className="flex items-center gap-1.5 shadow-md shadow-blue-500/10"
            >
              <Send className="h-3.5 w-3.5" />
              Send Email
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
