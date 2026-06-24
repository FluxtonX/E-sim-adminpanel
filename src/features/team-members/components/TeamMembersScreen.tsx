'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TeamMember } from '@/types';
import {
  Users,
  Plus,
  Mail,
  Edit2,
  Loader2,
  AlertTriangle,
  X,
  Check,
  Send,
  MoreVertical,
} from 'lucide-react';

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'mem-1', name: 'Khalid Al-Rashid', email: 'khalid@unitedunion.com', role: 'Super Admin', lastActive: 'Active Now', status: 'Active' },
  { id: 'mem-2', name: 'Fatima Al-Mutawa', email: 'fatima@unitedunion.com', role: 'Finance Manager', lastActive: '12 mins ago', status: 'Active' },
  { id: 'mem-3', name: 'Tariq Mahmood', email: 'tariq@unitedunion.com', role: 'Operations Manager', lastActive: '2 hours ago', status: 'Active' },
  { id: 'mem-4', name: 'Sarah Connor', email: 'sarah.c@unitedunion.com', role: 'Support Agent', lastActive: '1 day ago', status: 'Active' },
  { id: 'mem-5', name: 'John Smith', email: 'john.smith@unitedunion.com', role: 'Merchant Manager', lastActive: 'Invite Sent', status: 'Pending' },
  { id: 'mem-6', name: 'Emily Davis', email: 'emily.d@unitedunion.com', role: 'Support Agent', lastActive: 'Invite Sent', status: 'Pending' },
  { id: 'mem-7', name: 'Robert Chen', email: 'robert.c@unitedunion.com', role: 'Operations Manager', lastActive: '3 days ago', status: 'Active' },
  { id: 'mem-8', name: 'Amanda Ross', email: 'amanda.r@unitedunion.com', role: 'Finance Manager', lastActive: '20 days ago', status: 'Inactive' }
];

const ROLES: TeamMember['role'][] = [
  'Super Admin',
  'Operations Manager',
  'Finance Manager',
  'Merchant Manager',
  'Support Agent'
];

export default function TeamMembersScreen() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal toggle states
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [messagingMember, setMessagingMember] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // Form states
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Support Agent');
  const [isInviting, setIsInviting] = useState(false);

  // Message form states
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageSuccessData, setMessageSuccessData] = useState<{ memberName: string; email: string } | null>(null);

  // Edit role states
  const [selectedRole, setSelectedRole] = useState<TeamMember['role']>('Support Agent');
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setIsInviting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMember: TeamMember = {
      id: `mem-${Math.random().toString(36).substr(2, 9)}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Invite Sent',
      status: 'Pending'
    };

    setMembers([newMember, ...members]);
    setIsInviting(false);
    setIsInviteOpen(false);

    // Reset Form
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Support Agent');
  };

  const handleEditRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setIsSavingRole(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setMembers(
      members.map((m) =>
        m.id === editingMember.id ? { ...m, role: selectedRole } : m
      )
    );

    setIsSavingRole(false);
    setEditingMember(null);
  };

  const handleSendMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingMember || !messageBody.trim()) return;

    setIsSendingMessage(true);
    await new Promise((resolve) => setTimeout(resolve, 850));

    setIsSendingMessage(false);
    
    // Close composer and show success overlay
    const recipient = messagingMember;
    setMessagingMember(null);
    setMessageSubject('');
    setMessageBody('');
    
    setMessageSuccessData({
      memberName: recipient.name,
      email: recipient.email
    });
  };

  const handleConfirmDelete = () => {
    if (deletingMemberId) {
      setMembers(members.filter((m) => m.id !== deletingMemberId));
      setDeletingMemberId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">
            Loading team member registry...
          </span>
        </div>
      </div>
    );
  }

  // Helpers to format roles matching figma badge colors
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'Admin';
      case 'Operations Manager': return 'Manager';
      case 'Finance Manager': return 'Finance';
      case 'Merchant Manager': return 'Developer';
      default: return 'Support';
    }
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40';
      case 'Operations Manager':
        return 'bg-purple-50 text-purple-500 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/40';
      case 'Finance Manager':
        return 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40';
      case 'Merchant Manager':
        return 'bg-teal-50 text-teal-500 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/40';
      default:
        return 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/40 pb-5 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Members
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
            Configure markup rules, volume discounts, and promotional pricing.
          </p>
        </div>
        <Button
          onClick={() => setIsInviteOpen(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5 font-bold shadow-md shadow-blue-500/10 text-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Staff Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => {
          const initials = member.name.split(' ').map((n) => n[0]).join('');
          const isInactive = member.status === 'Inactive';
          const isPending = member.status === 'Pending';
          
          return (
            <Card key={member.id} className="border-slate-100/90 shadow-sm p-5 space-y-4 relative flex flex-col justify-between">
              {/* Top Row with initials, name, email and Menu */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs dark:bg-blue-950/30 dark:text-blue-400 shrink-0">
                    {initials}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate max-w-[130px]">
                      {member.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-[150px]">
                      {member.email}
                    </span>
                  </div>
                </div>
                
                {/* Menu/Three dots with action dropdown */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-6 w-32 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl shadow-lg hidden group-hover:block hover:block z-10 py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingMember(member)}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Edit Role
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingMemberId(member.id)}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-55 bg-white text-red-600 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-900/50 pt-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleBadgeClasses(member.role)}`}>
                  {getRoleDisplay(member.role)}
                </span>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  isInactive
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-900'
                    : isPending
                      ? 'bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-950/20'
                      : 'bg-emerald-50 text-emerald-500 border border-emerald-100 dark:bg-emerald-950/20'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                Last active: {member.lastActive}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 dark:border-slate-900/50">
                <button
                  type="button"
                  onClick={() => setMessagingMember(member)}
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900 text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Message
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMember(member)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900 text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-colors"
                >
                  Edit Role
                </button>
              </div>
            </Card>
          );
        })}

        {/* Invite Team Member dotted card */}
        <Card
          onClick={() => setIsInviteOpen(true)}
          className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[190px]"
        >
          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3 dark:bg-blue-950/20">
            <Plus className="h-4.5 w-4.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-850 dark:text-white">
            Invite Team Member
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 mb-3.5">
            Add a new member to your platform
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full max-w-[130px] font-bold text-[10px] py-1.5"
            onClick={(e) => { e.stopPropagation(); setIsInviteOpen(true); }}
          >
            Send Invite
          </Button>
        </Card>
      </div>

      {/* Invite Member modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsInviteOpen(false)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Invite Team Colleague</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Grant panel access to new staff</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. John Smith"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />

              <Input
                label="Corporate Email"
                type="email"
                placeholder="e.g. john.smith@unitedunion.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Administrative Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-880 dark:bg-slate-900/50 dark:text-slate-350"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteOpen(false)}
                  disabled={isInviting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isInviting}
                  className="min-w-28 shadow-sm shadow-blue-500/10"
                >
                  {isInviting ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setEditingMember(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
                  <Edit2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Modify Staff Role</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{editingMember.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleEditRoleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Scope Permission Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as TeamMember['role'])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-880 dark:bg-slate-900/50 dark:text-slate-350"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMember(null)}
                  disabled={isSavingRole}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSavingRole}
                  className="min-w-28 shadow-sm shadow-blue-500/10"
                >
                  {isSavingRole ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Role'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Message / Compose Modal Dialog Box */}
      {messagingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setMessagingMember(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-md shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20 dark:text-blue-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Compose Message</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Send panel notifications or mail</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessagingMember(null)}
                className="text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-colors p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleSendMessageSubmit} className="p-6 space-y-4">
              <Input
                label="To"
                value={`${messagingMember.name} (${messagingMember.email})`}
                disabled
              />

              <Input
                label="Subject"
                placeholder="e.g. Action Required: System Upgrades"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                required
              />

              <div className="w-full text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Message Details
                </label>
                <textarea
                  placeholder="Type message here..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white min-h-[120px]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMessagingMember(null)}
                  disabled={isSendingMessage}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSendingMessage}
                  className="min-w-28 shadow-sm shadow-blue-500/10 flex items-center justify-center gap-1.5"
                >
                  {isSendingMessage ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Success Dialog Box overlay */}
      {messageSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setMessageSuccessData(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-sm shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20 dark:text-emerald-450 animate-bounce">
              <Check className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Message Dispatched</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Notification successfully sent to coworker.
              </p>
            </div>

            {/* Recipient Details */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4.5 text-xs font-semibold space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Name</span>
                <span className="text-slate-800 dark:text-white font-bold">{messageSuccessData.memberName}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-2">
                <span className="text-slate-400">Email Address</span>
                <span className="text-slate-800 dark:text-white font-bold truncate max-w-[180px]">{messageSuccessData.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full font-bold shadow-md shadow-blue-500/10"
                onClick={() => setMessageSuccessData(null)}
              >
                Close Dialog
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {deletingMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setDeletingMemberId(null)} />
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 w-full max-w-sm shadow-2xl animate-scaleIn z-10 overflow-hidden flex flex-col p-6 text-center space-y-4">
            
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center dark:bg-red-950/20 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Remove Team Colleague?</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Are you sure you want to remove this staff profile? They will immediately lose dashboard panel access scopes.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold"
                onClick={() => setDeletingMemberId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 font-bold animate-pulse"
                onClick={handleConfirmDelete}
              >
                Remove Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
