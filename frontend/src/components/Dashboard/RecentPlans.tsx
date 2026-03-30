import { Landmark, Target, FileText, Plus, ArrowRight, Clock, Users, Lock } from 'lucide-react'

interface RecentPlansProps {
  hasPlans: boolean
  onCreatePlan: () => void
}

const plans = [
  {
    icon: Landmark,
    accentColor: 'var(--cyan)',
    accentBg: 'var(--cyan-dim)',
    name: 'Family Inheritance',
    heirs: 2,
    trigger: '180 days',
    locked: '1.5 ETH',
    badge: 'Active',
    badgeClass: 'pb-active',
  },
  {
    icon: Target,
    accentColor: 'var(--gold)',
    accentBg: 'var(--gold-dim)',
    name: 'College Fund — Emma',
    heirs: 1,
    trigger: 'On graduation',
    locked: '0.8 ETH',
    badge: 'Pending',
    badgeClass: 'pb-pend',
  },
]

export default function RecentPlans({ hasPlans, onCreatePlan }: RecentPlansProps) {
  return (
    <div className="panel plans-panel">
      <div className="panel-header">
        <div className="panel-title">Recent Plans</div>
        <div className="view-all" onClick={onCreatePlan}>
          View All <ArrowRight size={12} strokeWidth={2} />
        </div>
      </div>

      {!hasPlans ? (
        <div className="empty-state">
          <div className="empty-visual">
            <div className="empty-ring" />
            <FileText size={28} strokeWidth={1.2} style={{ color: 'var(--t3)' }} />
          </div>
          <div className="empty-title">No inheritance plans yet</div>
          <div className="empty-sub">Create your first plan to secure your digital legacy with FHE encryption.</div>
          <button className="btn-empty" onClick={onCreatePlan}>
            <Plus size={14} strokeWidth={2.5} /> Create First Plan
          </button>
        </div>
      ) : (
        <div className="plans-list">
          {plans.map((p) => (
            <div className="plan-row" key={p.name}>
              <div className="pr-icon" style={{ background: p.accentBg, color: p.accentColor }}>
                <p.icon size={16} strokeWidth={1.8} />
              </div>
              <div className="pr-info">
                <div className="pr-name">{p.name}</div>
                <div className="pr-details">
                  <span className="pr-detail"><Users size={10} strokeWidth={2} /> {p.heirs}</span>
                  <span className="pr-detail"><Clock size={10} strokeWidth={2} /> {p.trigger}</span>
                  <span className="pr-detail"><Lock size={10} strokeWidth={2} /> {p.locked}</span>
                </div>
              </div>
              <div className={`pr-badge ${p.badgeClass}`}>{p.badge}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
