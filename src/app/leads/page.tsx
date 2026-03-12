'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      if (json.success) setLeads(json.leads);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New Lead': return 'badge-new';
      case 'Contacted': return 'badge-warning';
      case 'Visit Scheduled':
      case 'Visit Completed': return 'badge-info';
      case 'Booked': return 'badge-success';
      case 'Lost Lead': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1>Leads Pipeline</h1>
          <p className="text-secondary">Manage and track all incoming leads</p>
        </div>
        <button className="btn btn-primary" onClick={fetchLeads}>Refresh Pipeline</button>
      </div>

      {loading ? (
        <div className="animate-pulse-glow">Loading Pipeline...</div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Source</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Owner</th>
                <th style={{ padding: '16px' }}>SLA Alerts</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{lead.name}<br /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{lead.phone}</span></td>
                  <td style={{ padding: '16px' }}>{lead.source}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${getStatusBadge(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>{lead.owner?.name || 'Unassigned'}</td>
                  <td style={{ padding: '16px' }}>
                    {lead.slaBreached ? (
                      <span className="badge badge-danger">Breached</span>
                    ) : lead.firstRespondedAt ? (
                      <span className="badge badge-success">Met</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Link href={`/leads/${lead.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No leads in the pipeline yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
