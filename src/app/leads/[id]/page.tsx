'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // UI States
  const [note, setNote] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [property, setProperty] = useState('');

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      const json = await res.json();
      if (json.success) setLead(json.lead);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchLead();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addNote: note })
    });
    setNote('');
    fetchLead();
  };

  const scheduleVisit = async () => {
    if (!visitDate || !property) return alert('Fill visit details');
    await fetch(`/api/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: id, property, visitDate })
    });
    setVisitDate('');
    setProperty('');
    fetchLead();
  };

  if (loading) return <div className="animate-pulse-glow">Loading lead...</div>;
  if (!lead) return <div>Lead not found.</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
      {/* Left Column: Details & Actions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div>
              <h1 style={{ marginBottom: '4px' }}>{lead.name}</h1>
              <p className="text-secondary">{lead.phone} • {lead.source}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-info" style={{ marginBottom: '8px', display: 'inline-block' }}>{lead.status}</span>
              <p className="text-xs text-muted">Owner: {lead.owner?.name}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Pipeline Actions</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => updateStatus('Contacted')}>Mark Contacted</button>
              <button className="btn btn-secondary" onClick={() => updateStatus('Requirement Collected')}>Req. Collected</button>
              <button className="btn btn-secondary" onClick={() => updateStatus('Property Suggested')}>Prop. Suggested</button>
              <button className="btn btn-success" style={{ background: 'var(--success)', color: '#fff', border: 'none' }} onClick={() => updateStatus('Booked')}>Booked</button>
              <button className="btn btn-danger" onClick={() => updateStatus('Lost Lead')}>Lost Lead</button>
            </div>
          </div>
        </div>

        {/* Visit Scheduling */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Schedule Visit</h3>
          <div className="form-group">
            <label className="form-label">Property</label>
            <input type="text" className="form-input" value={property} onChange={e => setProperty(e.target.value)} placeholder="e.g. Gharpayy Koramangala 1" />
          </div>
          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input type="datetime-local" className="form-input" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={scheduleVisit}>Schedule Visit</button>

          {lead.visits && lead.visits.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <h4 className="text-secondary" style={{ marginBottom: '8px' }}>Upcoming Visits</h4>
              {lead.visits.map((v: any) => (
                <div key={v.id} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                  <p><strong>{v.property}</strong></p>
                  <p className="text-sm text-secondary">{new Date(v.visitDate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interaction Log */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Interaction History</h3>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
          {lead.interactions?.map((int: any) => (
            <div key={int.id} style={{
              background: int.type === 'System Note' ? 'var(--bg-secondary)' : 'rgba(99, 102, 241, 0.1)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              borderLeft: int.type === 'System Note' ? '3px solid var(--text-muted)' : '3px solid var(--accent-primary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="text-xs" style={{ color: int.type === 'System Note' ? 'var(--text-muted)' : 'var(--accent-primary)', fontWeight: 600 }}>{int.type}</span>
                <span className="text-xs text-muted">{new Date(int.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>{int.content}</p>
            </div>
          ))}
          {lead.interactions?.length === 0 && <p className="text-muted">No interactions recorded.</p>}
        </div>

        <div style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--card-border)', paddingTop: 'var(--spacing-md)' }}>
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <textarea
              className="form-input"
              placeholder="Add a manual note or log a WhatsApp message..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={addNote}>Log Interaction</button>
        </div>
      </div>
    </div>
  );
}
