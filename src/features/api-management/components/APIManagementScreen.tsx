'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APIKey } from '@/types';
import {
  Terminal,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  AlertTriangle,
  Activity,
  Zap,
  X,
  Code
} from 'lucide-react';

const INITIAL_API_KEYS: APIKey[] = [
  { id: 'key-1', name: 'Production API Key', key: 'uu_live_sk_4f8a92b3c4d5e6f1a2b3c4d5e6f7a8b9d0e', role: 'Full Access', createdBy: 'Khalid Al-Rashid', lastUsed: 'Dec 15, 2024', status: 'Active', createdDate: 'January 2024' },
  { id: 'key-2', name: 'Merchant Portal Key', key: 'uu_live_sk_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d1e2f', role: 'Read-only', createdBy: 'Khalid Al-Rashid', lastUsed: 'Dec 14, 2024', status: 'Active', createdDate: 'March 2024' },
  { id: 'key-3', name: 'Test Environment', key: 'uu_test_sk_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c9p8o', role: 'Billing Admin', createdBy: 'Admin User', lastUsed: 'Dec 10, 2024', status: 'Active', createdDate: 'June 2024' }
];

export default function APIManagementScreen() {
  const [keys, setKeys] = useState<APIKey[]>(INITIAL_API_KEYS);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Form states for new key
  const [keyName, setKeyName] = useState('');
  const [keyRole, setKeyRole] = useState<APIKey['role']>('Full Access');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Revoke overlays
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerateKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setIsGenerating(true);
    // Simulate compilation latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate random mock key
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const prefix = keyRole === 'Billing Admin' ? 'uu_billing_sk_' : (keyName.toLowerCase().includes('test') ? 'uu_test_sk_' : 'uu_live_sk_');
    const newSecretKey = `${prefix}${randomHex}`;

    setGeneratedKey(newSecretKey);
    setIsGenerating(false);
  };

  const handleDoneGenerating = () => {
    if (generatedKey) {
      const newKeyItem: APIKey = {
        id: `key-${Math.random().toString(36).substr(2, 9)}`,
        name: keyName,
        key: generatedKey,
        role: keyRole,
        createdBy: 'Khalid Al-Rashid',
        lastUsed: 'Never',
        status: 'Active',
        createdDate: new Date().toLocaleDateString(undefined, {
          month: 'long',
          year: 'numeric'
        })
      };
      setKeys([newKeyItem, ...keys]);
    }

    // Reset Form
    setIsGenerateOpen(false);
    setKeyName('');
    setKeyRole('Full Access');
    setGeneratedKey(null);
  };

  const handleConfirmRevoke = () => {
    if (revokingKeyId) {
      setKeys(
        keys.map((k) => (k.id === revokingKeyId ? { ...k, status: 'Revoked' } : k))
      );
      setRevokingKeyId(null);
    }
  };

  // Metrics
  const activeCount = keys.filter((k) => k.status === 'Active').length;

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">
            Loading API portal...
          </span>
        </div>
      </div>
    );
  }

  // Helper to render role badges matching figma styling
  const renderRoleBadge = (role: string) => {
    if (role === 'Full Access') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-500 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
          Full Access
        </span>
      );
    } else if (role === 'Read-only') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
          Read + Orders
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40">
          Test Only
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/40 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            API Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
            Manage API keys, monitor usage, and access developer documentation.
          </p>
        </div>
        <Button
          onClick={() => setIsGenerateOpen(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 font-bold shadow-md shadow-blue-500/10 text-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Generate Key
        </Button>
      </div>

      {/* Metrics Row (3 Columns) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Metric 1 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                API Calls Today
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                4,823
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center dark:bg-blue-950/20">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Keys
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                {activeCount}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center dark:bg-emerald-950/20">
              <Terminal className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-100/90 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg. Response
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                142ms
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center dark:bg-purple-950/20">
              <Zap className="h-4.5 w-4.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keys Cards Container */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider pl-0.5">
          API Keys
        </h3>
        
        <div className="space-y-4">
          {keys.map((keyItem) => {
            const isActive = keyItem.status === 'Active';
            const isVisible = visibleKeys.has(keyItem.id);
            const totalRequests = keyItem.id === 'key-1' ? '45,823' : (keyItem.id === 'key-2' ? '12,456' : '3,210');
            
            // Masking like Figma: uu_live_sk_4•••••••••••••••••••••9d0e
            const keyPrefix = keyItem.key.slice(0, 13);
            const keySuffix = keyItem.key.slice(-4);
            const maskedDisplay = `${keyPrefix}•••••••••••••••••••••${keySuffix}`;
            const displayValue = isVisible ? keyItem.key : maskedDisplay;

            return (
              <Card key={keyItem.id} className="border-slate-100/90 shadow-sm p-5 space-y-3.5 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">
                        {keyItem.name}
                      </h4>
                      {renderRoleBadge(keyItem.role)}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">
                      Created {keyItem.createdDate} · {totalRequests} total requests
                    </span>
                  </div>
                </div>

                {/* Key value bar */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/70 font-mono text-[11px] text-slate-700 dark:border-slate-850 dark:bg-slate-900/30 dark:text-slate-400">
                  <span className="truncate select-all leading-relaxed pr-2">
                    {displayValue}
                  </span>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility(keyItem.id)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                      title={isVisible ? "Hide Key" : "Show Key"}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>

                    {/* Copy Key */}
                    <button
                      type="button"
                      onClick={() => handleCopy(keyItem.key, keyItem.id)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                      title="Copy Key"
                    >
                      {copiedId === keyItem.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete/Revoke */}
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => setRevokingKeyId(keyItem.id)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                        title="Revoke Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold pl-0.5">
                  Last used: {keyItem.lastUsed}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* API Documentation Section */}
      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 p-6 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-bold tracking-tight">
            API Documentation
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          Integrate United Union E-SIM APIs into your own products and platforms.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { label: 'REST API Docs', href: '#' },
            { label: 'Webhooks', href: '#' },
            { label: 'SDKs', href: '#' },
            { label: 'Rate Limits', href: '#' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold hover:border-slate-600 transition-all group"
            >
              <span>{item.label}</span>
              <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Generate API Key modal overlay */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={handleDoneGenerating} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
                  <Terminal className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Generate Developer Key</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Integrate with platform carrier APIs</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDoneGenerating}
                className="text-slate-400 hover:text-slate-655 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Generated display vs Config Form */}
            {generatedKey ? (
              <div className="p-6 space-y-4.5 text-left">
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800/40 dark:bg-blue-950/20 space-y-1 text-xs">
                  <span className="font-extrabold text-blue-800 dark:text-blue-400 block">Save this API key</span>
                  <span className="font-semibold text-blue-650 dark:text-blue-300 block">
                    For security reasons, we will only show this credentials key once. Make sure to back it up now!
                  </span>
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generated API Key</label>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 overflow-x-auto select-all">
                    <span className="flex-1 whitespace-nowrap">{generatedKey}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedKey, 'new-gen')}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors pl-2"
                      title="Copy Key"
                    >
                      {copiedId === 'new-gen' ? (
                        <Check className="h-4.5 w-4.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleDoneGenerating}
                    variant="primary"
                    size="sm"
                    className="w-full font-bold shadow-sm shadow-blue-500/10"
                  >
                    I Have Saved My Key
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateKeySubmit} className="p-6 space-y-4">
                <Input
                  label="API Key Name"
                  placeholder="e.g. NomadSIM Production Endpoint"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  required
                />

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Access Permission Scope
                  </label>
                  <select
                    value={keyRole}
                    onChange={(e) => setKeyRole(e.target.value as APIKey['role'])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-880 dark:bg-slate-900/50 dark:text-slate-350"
                  >
                    <option value="Full Access">Full Access (Manage & Buy eSIMs)</option>
                    <option value="Read-only">Read-only (Query eSIM list)</option>
                    <option value="Billing Admin">Billing Admin (Invoices access only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDoneGenerating}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isGenerating}
                    className="min-w-28 shadow-sm shadow-blue-500/10"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-1.5 justify-center">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      'Generate Key'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Danger Revoke Key Modal overlay */}
      {revokingKeyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setRevokingKeyId(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-sm shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-605 flex items-center justify-center dark:bg-red-950/20 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Revoke API Key?</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Are you sure you want to revoke this API credential key? Any integration applications using this key will immediately fail.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setRevokingKeyId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 font-bold"
                onClick={handleConfirmRevoke}
              >
                Revoke Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

