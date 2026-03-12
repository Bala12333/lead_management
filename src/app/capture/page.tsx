'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeadCapturePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', source: 'Direct Form' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/leads');
        }, 2000);
      } else {
        alert(json.error || 'Failed to capture lead');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-center" style={{ height: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Book a Property Visit</h2>
        <p className="text-secondary" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Drop your details and we will respond within 5 minutes.
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--success-bg)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto var(--spacing-md)'
            }}>
              ✓
            </div>
            <h3>Request Received!</h3>
            <p className="text-muted">Redirecting to pipeline...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <label className="form-label">Lead Source (For Demo)</label>
              <select
                className="form-input"
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                style={{ appearance: 'none' }}
              >
                <option>Direct Form</option>
                <option>WhatsApp API</option>
                <option>Instagram Request</option>
              </select>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
