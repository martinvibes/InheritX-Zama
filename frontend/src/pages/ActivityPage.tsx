import { HeartPulse, FileText, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

const demoActivity = [
  { icon: FileText, color: 'var(--cyan)', bg: 'rgba(0,212,232,0.06)', label: 'Plan Created', detail: 'Family Inheritance — 1.5 ETH locked', time: '2 hours ago' },
  { icon: ShieldCheck, color: 'var(--green)', bg: 'rgba(0,201,138,0.06)', label: 'KYC Verified', detail: 'Identity verification complete', time: '3 hours ago' },
  { icon: HeartPulse, color: 'var(--green)', bg: 'rgba(0,201,138,0.06)', label: 'Check-in', detail: 'Proof of life confirmed — timer reset to 180 days', time: '1 day ago' },
  { icon: ShieldCheck, color: 'var(--gold)', bg: 'rgba(240,160,32,0.06)', label: 'KYC Submitted', detail: 'Waiting for on-chain verification', time: '1 day ago' },
  { icon: FileText, color: 'var(--cyan)', bg: 'rgba(0,212,232,0.06)', label: 'Plan Created', detail: 'College Fund — Emma — 0.8 ETH locked', time: '3 days ago' },
]

export default function ActivityPage() {
  return (
    <div className="page-container-wide">
      <style>{styles}</style>
      <div className="act-header">
        <h1 className="pg-title">Activity</h1>
        <p className="pg-sub">Your recent on-chain activity and plan events.</p>
      </div>

      <div className="act-list">
        {demoActivity.map((item, i) => (
          <div className="act-row" key={i}>
            <div className="act-icon" style={{ background: item.bg, color: item.color }}>
              <item.icon size={15} strokeWidth={1.8} />
            </div>
            <div className="act-info">
              <div className="act-label">{item.label}</div>
              <div className="act-detail">{item.detail}</div>
            </div>
            <div className="act-time">
              <Clock size={10} strokeWidth={2} /> {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = `
.page-container-wide { max-width: 800px; }
.act-header { margin-bottom: 20px; }
.pg-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.pg-sub { font-size: 13px; color: var(--t3); }

.act-list {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; overflow: hidden;
}
.act-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.12s;
}
.act-row:last-child { border-bottom: none; }
.act-row:hover { background: rgba(255,255,255,0.015); }

.act-icon {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.act-info { flex: 1; }
.act-label { font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }
.act-detail { font-size: 12px; color: var(--t3); }
.act-time {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--t3); white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
}
`
