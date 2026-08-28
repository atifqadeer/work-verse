import type { UserRole } from '../types';

export const ROLE_HOME_TAB: Record<UserRole, string> = {
  freelancer: 'find-work',
  client: 'client-jobs',
  agency: 'agency-overview',
  admin: 'admin-analytics',
  support: 'support-tickets',
  guest: 'guest-explore'
};

export const LOGIN_ROLES: { id: Exclude<UserRole, 'guest'>; label: string; blurb: string }[] = [
  { id: 'freelancer', label: 'Freelancer', blurb: 'Find work, send proposals, track contracts' },
  { id: 'client', label: 'Client', blurb: 'Post jobs, hire talent, release escrow' },
  { id: 'agency', label: 'Agency', blurb: 'Manage roster, jobs, and commission' },
  { id: 'admin', label: 'Admin', blurb: 'Revenue, disputes, and security logs' },
  { id: 'support', label: 'Support', blurb: 'Tickets, disputes, and scam inspection' }
];

export function canPostJob(role: UserRole) {
  return role === 'client';
}

export function canSubmitProposal(role: UserRole) {
  return role === 'freelancer' || role === 'agency';
}

export function canUseSkillTests(role: UserRole) {
  return role === 'freelancer';
}

export function canUseConnects(role: UserRole) {
  return role === 'freelancer' || role === 'agency';
}

export function canUseWallet(role: UserRole) {
  return role !== 'guest';
}

export function canUseMessages(role: UserRole) {
  return role !== 'guest';
}

export function canUseNotifications(role: UserRole) {
  return role !== 'guest';
}

export function canUseScamGuard(role: UserRole) {
  return role === 'admin' || role === 'support' || role === 'freelancer' || role === 'client';
}

export function canManageBilling(role: UserRole) {
  return role === 'client' || role === 'freelancer' || role === 'agency';
}

export function canSearchJobs(role: UserRole) {
  return role === 'freelancer' || role === 'agency' || role === 'guest' || role === 'client';
}
