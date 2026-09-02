'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  LayoutDashboard,
  Users,
  BarChart3,
  UserCheck,
  Database,
  Sliders,
  Search,
  RefreshCw,
  Plus,
  Download,
  Copy,
  Check,
  Trash2,
  X,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  UserPlus,
} from 'lucide-react';
import { WaitlistRecord } from '@/lib/services/waitlist.service';

interface PlannedFeature {
  name: string;
  description: string;
  icon: React.ElementType;
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [emailInput, setEmailInput] = useState('admin@hevn.app');
  const [passwordInput, setPasswordInput] = useState('hevn2026admin');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Waitlist data state
  const [entries, setEntries] = useState<WaitlistRecord[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active navigation view state
  const [activeTab, setActiveTab] = useState<'waitlist' | 'planned'>('waitlist');
  const [plannedFeature, setPlannedFeature] = useState<PlannedFeature | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadRole, setNewLeadRole] = useState('Professional');
  const [newLeadSource, setNewLeadSource] = useState('Direct');
  const [addLoading, setAddLoading] = useState(false);

  // Check auth status on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth', { method: 'GET' });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch waitlist data when authenticated
  const fetchWaitlist = async () => {
    setLoadingEntries(true);
    try {
      const res = await fetch('/api/admin/waitlist');
      const data = await res.json();
      if (res.ok && data.ok) {
        setEntries(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load waitlist entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWaitlist();
    }
  }, [isAuthenticated]);

  // Auth Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Copy email helper
  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Update Status
  const handleStatusChange = async (id: string, newStatus: 'pending' | 'contacted' | 'onboarded') => {
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEntries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete Entry
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this signup entry?')) return;
    try {
      const res = await fetch(`/api/admin/waitlist?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // Add Manual Entry
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadEmail.trim()) return;
    setAddLoading(true);

    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLeadName.trim(),
          email: newLeadEmail.trim(),
          role: newLeadRole,
          source: newLeadSource,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setShowAddModal(false);
        setNewLeadName('');
        setNewLeadEmail('');
        fetchWaitlist();
      }
    } catch (err) {
      console.error('Failed to add lead:', err);
    } finally {
      setAddLoading(false);
    }
  };

  // Planned feature trigger
  const triggerPlannedFeature = (name: string, description: string, icon: React.ElementType) => {
    setPlannedFeature({ name, description, icon });
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    window.open('/api/admin/export', '_blank');
  };

  // Filtered entries memo
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.role && item.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.source && item.source.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || item.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [entries, searchQuery, roleFilter, statusFilter]);

  // Statistics memo
  const stats = useMemo(() => {
    const total = entries.length;
    const todayCount = entries.filter((e) => {
      const created = new Date(e.createdAt);
      const now = new Date();
      return created.toDateString() === now.toDateString();
    }).length;

    const roleCounts: Record<string, number> = {};
    entries.forEach((e) => {
      const r = e.role || 'Unspecified';
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });

    const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Executive Assistant';
    const onboardedCount = entries.filter((e) => e.status === 'onboarded' || e.status === 'contacted').length;
    const conversionRate = total > 0 ? Math.round((onboardedCount / total) * 100) : 0;

    return { total, todayCount, topRole, conversionRate };
  }, [entries]);

  // If checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="admin-auth-container">
        <div style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RefreshCw className="spin" size={24} />
          <span>Verifying admin security credentials…</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // UNAUTHENTICATED LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-bg-glow" />
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <div className="admin-brand-logo">
              <Shield size={16} />
              <span>HEVN CONTROL</span>
            </div>
            <h1 className="admin-auth-title">Admin Sign In</h1>
            <p className="admin-auth-subtitle">
              Authorized personnel access only. Enter seeded credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="admin-auth-form">
            {authError && (
              <div className="admin-auth-error">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <div className="admin-field-group">
              <label className="admin-field-label">Admin Email</label>
              <div className="admin-input-wrapper">
                <Mail className="admin-input-icon" size={18} />
                <input
                  type="email"
                  className="admin-input"
                  placeholder="admin@hevn.app"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-field-group">
              <label className="admin-field-label">Access Password</label>
              <div className="admin-input-wrapper">
                <Lock className="admin-input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-auth-btn" disabled={authLoading}>
              {authLoading ? (
                <>
                  <RefreshCw className="spin" size={18} />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="admin-auth-seed-hint">
            <div>Default Seeded Credentials:</div>
            <div style={{ marginTop: '4px' }}>
              Email: <span className="admin-auth-seed-code">admin@hevn.app</span> | Password:{' '}
              <span className="admin-auth-seed-code">hevn2026admin</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD LAYOUT
  // ----------------------------------------------------
  return (
    <div className="admin-dashboard-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Shield size={20} />
            </div>
            <div>
              <div className="admin-brand-name">Hevn Admin</div>
              <div className="admin-brand-tag">PROD CONTROL</div>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-title">Core Tools</div>
          <button
            className={`admin-nav-item ${activeTab === 'waitlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('waitlist')}
          >
            <div className="admin-nav-item-left">
              <Users size={18} />
              <span>Waitlist Signups</span>
            </div>
            <span className={`admin-nav-badge ${activeTab === 'waitlist' ? 'active' : ''}`}>
              {entries.length}
            </span>
          </button>

          <div className="admin-nav-section-title">Management Tools</div>

          <button
            className="admin-nav-item"
            onClick={() =>
              triggerPlannedFeature(
                'Analytics & Insights',
                'Comprehensive visualization of signup velocity, conversion funnels, and demographic breakdown by workspace role.',
                BarChart3
              )
            }
          >
            <div className="admin-nav-item-left">
              <BarChart3 size={18} />
              <span>Analytics & Metrics</span>
            </div>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              triggerPlannedFeature(
                'Email Broadcast Campaigns',
                'Send targeted onboarding emails, feature announcements, and invite codes directly to waitlist cohorts.',
                Mail
              )
            }
          >
            <div className="admin-nav-item-left">
              <Mail size={18} />
              <span>Broadcast Emails</span>
            </div>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              triggerPlannedFeature(
                'Access & Permissions',
                'Manage team admin accounts, role-based access control (RBAC), and API keys.',
                UserCheck
              )
            }
          >
            <div className="admin-nav-item-left">
              <UserCheck size={18} />
              <span>Role Permissions</span>
            </div>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              triggerPlannedFeature(
                'Database & Backups',
                'Automated snapshot management, Supabase database synchronization status, and automated backup exports.',
                Database
              )
            }
          >
            <div className="admin-nav-item-left">
              <Database size={18} />
              <span>Backups & Sync</span>
            </div>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              triggerPlannedFeature(
                'System Settings',
                'Configure waitlist auto-reply templates, SendGrid integration settings, and spam protection thresholds.',
                Sliders
              )
            }
          >
            <div className="admin-nav-item-left">
              <Sliders size={18} />
              <span>System Settings</span>
            </div>
          </button>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{adminUser?.name || 'Administrator'}</span>
              <span className="admin-user-role">{adminUser?.email || 'admin@hevn.app'}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main-wrapper">
        {/* TOP HEADER BAR */}
        <header className="admin-top-header">
          <div className="admin-header-title-area">
            <div>
              <h1 className="admin-header-title">Waitlist Signups & Tracking</h1>
              <p className="admin-header-sub">
                Monitor, filter, and manage pre-launch signups in real-time
              </p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              className="admin-btn-secondary"
              onClick={fetchWaitlist}
              disabled={loadingEntries}
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loadingEntries ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <button className="admin-btn-secondary" onClick={handleExportCSV}>
              <Download size={16} />
              <span>Export CSV</span>
            </button>

            <button className="admin-btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={16} />
              <span>Add Lead</span>
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD PANEL */}
        <div className="admin-main-content">
          {/* STATS OVERVIEW CARDS */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <span className="admin-stat-label">Total Signups</span>
                <span className="admin-stat-value">{stats.total}</span>
                <span className="admin-stat-sub positive">
                  <Sparkles size={13} /> Waitlist leads active
                </span>
              </div>
              <div className="admin-stat-icon-wrapper blue">
                <Users size={22} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <span className="admin-stat-label">Signups Today</span>
                <span className="admin-stat-value">{stats.todayCount}</span>
                <span className="admin-stat-sub">New registrations today</span>
              </div>
              <div className="admin-stat-icon-wrapper orange">
                <UserPlus size={22} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <span className="admin-stat-label">Top Category / Role</span>
                <span className="admin-stat-value" style={{ fontSize: '18px', paddingTop: '4px' }}>
                  {stats.topRole}
                </span>
                <span className="admin-stat-sub">Highest conversion group</span>
              </div>
              <div className="admin-stat-icon-wrapper purple">
                <BarChart3 size={22} />
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-info">
                <span className="admin-stat-label">Engaged Rate</span>
                <span className="admin-stat-value">{stats.conversionRate}%</span>
                <span className="admin-stat-sub positive">Contacted or Onboarded</span>
              </div>
              <div className="admin-stat-icon-wrapper green">
                <UserCheck size={22} />
              </div>
            </div>
          </div>

          {/* TOOLBAR & SEARCH / FILTER */}
          <div className="admin-toolbar-card">
            <div className="admin-search-wrapper">
              <Search className="admin-search-icon" size={16} />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by name, email, role, or source…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="admin-filter-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(16,38,79,0.6)' }}>
                <Filter size={15} />
                <span>Filter:</span>
              </div>

              <select
                className="admin-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="Executive Assistant">Executive Assistant</option>
                <option value="Professional">Professional</option>
                <option value="Student">Student</option>
              </select>

              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="onboarded">Onboarded</option>
              </select>
            </div>
          </div>

          {/* WAITLIST TABLE */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User / Name</th>
                  <th>Email Address</th>
                  <th>Work Details / Role</th>
                  <th>Source</th>
                  <th>Date Signed Up</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((item) => {
                    const initials = item.name
                      ? item.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                      : item.email.charAt(0).toUpperCase();

                    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    // Role pill style
                    let roleBadgeClass = 'admin-badge role-other';
                    if (item.role === 'Executive Assistant') roleBadgeClass = 'admin-badge role-ea';
                    if (item.role === 'Professional') roleBadgeClass = 'admin-badge role-pro';
                    if (item.role === 'Student') roleBadgeClass = 'admin-badge role-student';

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-table-avatar">{initials}</div>
                            <span className="admin-table-name">{item.name || 'Anonymous User'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-email-cell">
                            <span>{item.email}</span>
                            <button
                              className="admin-copy-btn"
                              onClick={() => handleCopyEmail(item.email, item.id)}
                              title="Copy Email"
                            >
                              {copiedId === item.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={roleBadgeClass}>{item.role || 'Unspecified'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'rgba(16,38,79,0.7)' }}>
                            {item.source || 'Direct'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: 'rgba(16,38,79,0.6)' }}>
                            {formattedDate}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`admin-badge status-${item.status}`}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item.id,
                                e.target.value as 'pending' | 'contacted' | 'onboarded'
                              )
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="onboarded">Onboarded</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group" style={{ justifyContent: 'flex-end' }}>
                            <button
                              className="admin-icon-btn danger"
                              onClick={() => handleDelete(item.id)}
                              title="Delete Signup Entry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                          <Users size={24} />
                        </div>
                        <div className="admin-empty-title">No signups found</div>
                        <div className="admin-empty-desc">
                          {searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL'
                            ? 'No waitlist signups match your active search filters.'
                            : 'Waitlist is currently empty. New signups from the landing page will appear here.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* PLANNED FEATURE MODAL */}
      {plannedFeature && (
        <div className="admin-modal-overlay" onClick={() => setPlannedFeature(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <plannedFeature.icon size={20} color="#0c44be" />
                <span className="admin-modal-title">{plannedFeature.name}</span>
              </div>
              <button className="admin-modal-close" onClick={() => setPlannedFeature(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-planned-box">
              <div className="admin-planned-badge">
                <Sparkles size={14} />
                <span>Planned to be Implemented</span>
              </div>

              <h2 className="admin-planned-title">{plannedFeature.name}</h2>
              <p className="admin-planned-desc">{plannedFeature.description}</p>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn-primary"
                onClick={() => setPlannedFeature(null)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ADD LEAD MODAL */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#0c44be" />
                <span className="admin-modal-title">Add Manual Waitlist Lead</span>
              </div>
              <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#10264f', marginBottom: '6px', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="admin-search-input"
                  style={{ width: '100%', height: '42px', paddingLeft: '14px' }}
                  placeholder="e.g. Alex Taylor"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#10264f', marginBottom: '6px', display: 'block' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  className="admin-search-input"
                  style={{ width: '100%', height: '42px', paddingLeft: '14px' }}
                  placeholder="alex.taylor@company.com"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#10264f', marginBottom: '6px', display: 'block' }}>
                    Role / Work Details
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%', height: '42px' }}
                    value={newLeadRole}
                    onChange={(e) => setNewLeadRole(e.target.value)}
                  >
                    <option value="Executive Assistant">Executive Assistant</option>
                    <option value="Professional">Professional</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#10264f', marginBottom: '6px', display: 'block' }}>
                    Lead Source
                  </label>
                  <input
                    type="text"
                    className="admin-search-input"
                    style={{ width: '100%', height: '42px', paddingLeft: '14px' }}
                    placeholder="e.g. Inbound / Outbound"
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={addLoading}>
                  {addLoading ? 'Saving…' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
