'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse-glow">Loading metrics...</div>;
  if (!data) return <div>Failed to load metrics.</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1>Overview</h1>
          <p className="text-secondary">Real-time performance metrics</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDashboard}>Refresh Data</button>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="glass-panel">
          <h3 className="text-secondary">Total Leads</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className="text-gradient">{data.totalLeads}</div>
        </div>

        <div className="glass-panel" style={{ borderColor: data.sla.slaBreached > 0 ? 'var(--danger)' : 'var(--card-border)' }}>
          <h3 className="text-secondary">SLA Breaches (&gt;5m)</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: data.sla.slaBreached > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {data.sla.slaBreached}
          </div>
        </div>

        <div className="glass-panel">
          <h3 className="text-secondary">Avg Response Time</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className="text-gradient">
            {data.sla.avgResponseMinutes} <span style={{ fontSize: '1rem' }}>min</span>
          </div>
        </div>

        <div className="glass-panel">
          <h3 className="text-secondary">Visits Converted</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className="text-gradient-accent">
            {data.visits.converted} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {data.visits.scheduled}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Summary */}
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Pipeline Status</h2>
      <div className="grid-cols-4">
        <div className="glass-panel" style={{ borderTop: '3px solid var(--info)' }}>
          <h4 className="text-secondary">New Leads</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.pipeline.newLeads}</p>
        </div>
        <div className="glass-panel" style={{ borderTop: '3px solid var(--warning)' }}>
          <h4 className="text-secondary">Contacted</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.pipeline.contacted}</p>
        </div>
        <div className="glass-panel" style={{ borderTop: '3px solid var(--accent-primary)' }}>
          <h4 className="text-secondary">Visited</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.pipeline.visited}</p>
        </div>
        <div className="glass-panel" style={{ borderTop: '3px solid var(--success)' }}>
          <h4 className="text-secondary">Booked</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.pipeline.booked}</p>
        </div>
      </div>
    </div>
  );
}
