import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import {
  FileText, Plus, Landmark, Target, Clock, Users, Lock,
  HeartPulse, AlertTriangle, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react'
import { useOwnerPlans, usePlan } from '../hooks/usePlans'
import { CONTRACT_ADDRESS } from '../lib/constants'

export default function MyPlans({ onCreatePlan, onNavigate }: { onCreatePlan: () => void; onNavigate: (page: string) => void }) {
  const { address } = useAccount()
  const { planIds } = useOwnerPlans(address)
  const isLive = !!CONTRACT_ADDRESS

  return (
    <div className="page-container-wide">
      <style>{styles}</style>
      <div className="mp-header">
        <div>
          <h1 className="pg-title">My Plans</h1>
          <p className="pg-sub">Manage your inheritance and future goal plans.</p>
        </div>
        <button className="mp-create-btn" onClick={onCreatePlan}>
          <Plus size={14} strokeWidth={2.5} /> New Plan
        </button>
      </div>

      {isLive && planIds && planIds.length > 0 ? (
        <div className="mp-list">
          {planIds.map((id) => (
            <PlanRow key={id.toString()} planId={Number(id)} />
          ))}
        </div>
      ) : (
        /* Demo plans when contract not deployed */
        <div className="mp-list">
          <DemoPlanRow
            type="inheritance"
            name="Family Inheritance"
            heirs={2}
            trigger="180 days"
            locked="1.5 ETH"
            status="active"
            daysLeft={154}
          />
          <DemoPlanRow
            type="goal"
            name="College Fund — Emma"
            heirs={1}
            trigger="Dec 2027"
            locked="0.8 ETH"
            status="pending"
          />
          <div className="mp-empty-add">
            <button className="mp-add-btn" onClick={onCreatePlan}>
              <Plus size={16} strokeWidth={2} /> Create New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PlanRow({ planId }: { planId: number }) {
  const { plan } = usePlan(planId)
  if (!plan) return null

  const isInheritance = plan.planType === 0
  const StatusIcon = plan.triggered ? AlertTriangle : plan.cancelled ? XCircle : CheckCircle2
  const statusColor = plan.triggered ? 'var(--gold)' : plan.cancelled ? 'var(--red)' : 'var(--green)'
  const statusLabel = plan.triggered ? 'Triggered' : plan.cancelled ? 'Cancelled' : 'Active'

  return (
    <div className="mp-row">
      <div className="mp-row-icon" style={{
        background: isInheritance ? 'rgba(0,212,232,0.06)' : 'rgba(240,160,32,0.06)',
        color: isInheritance ? 'var(--cyan)' : 'var(--gold)',
      }}>
        {isInheritance ? <Landmark size={18} strokeWidth={1.5} /> : <Target size={18} strokeWidth={1.5} />}
      </div>
      <div className="mp-row-info">
        <div className="mp-row-name">Plan #{planId}</div>
        <div className="mp-row-meta">
          <span><Users size={10} strokeWidth={2} /> {plan.beneficiaryCount}</span>
          <span><Clock size={10} strokeWidth={2} /> {plan.inactivityDays.toString()}d</span>
          <span><Lock size={10} strokeWidth={2} /> {formatEther(plan.ethLocked)} ETH</span>
        </div>
      </div>
      <div className="mp-row-status" style={{ color: statusColor }}>
        <StatusIcon size={12} strokeWidth={2} /> {statusLabel}
      </div>
      <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--t4)' }} />
    </div>
  )
}

function DemoPlanRow({ type, name, heirs, trigger, locked, status, daysLeft }: {
  type: 'inheritance' | 'goal'; name: string; heirs: number; trigger: string; locked: string; status: 'active' | 'pending'; daysLeft?: number
}) {
  const isInheritance = type === 'inheritance'
  return (
    <div className="mp-row">
      <div className="mp-row-icon" style={{
        background: isInheritance ? 'rgba(0,212,232,0.06)' : 'rgba(240,160,32,0.06)',
        color: isInheritance ? 'var(--cyan)' : 'var(--gold)',
      }}>
        {isInheritance ? <Landmark size={18} strokeWidth={1.5} /> : <Target size={18} strokeWidth={1.5} />}
      </div>
      <div className="mp-row-info">
        <div className="mp-row-name">{name}</div>
        <div className="mp-row-meta">
          <span><Users size={10} strokeWidth={2} /> {heirs}</span>
          <span><Clock size={10} strokeWidth={2} /> {trigger}</span>
          <span><Lock size={10} strokeWidth={2} /> {locked}</span>
        </div>
      </div>
      {daysLeft !== undefined && (
        <div className="mp-row-days">
          <HeartPulse size={11} strokeWidth={2} /> {daysLeft}d left
        </div>
      )}
      <div className={`mp-row-badge ${status === 'active' ? 'badge-active' : 'badge-pending'}`}>
        {status === 'active' ? 'Active' : 'Pending'}
      </div>
      <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--t4)' }} />
    </div>
  )
}

const styles = `
.page-container-wide { max-width: 800px; }
.mp-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.pg-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.pg-sub { font-size: 13px; color: var(--t3); }

.mp-create-btn {
  display: flex; align-items: center; gap: 6px; padding: 9px 16px;
  background: var(--cyan); border: none; border-radius: 8px; color: #000;
  font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.mp-create-btn:hover { background: var(--cyan-hi); box-shadow: 0 4px 16px rgba(0,212,232,0.3); }

.mp-list {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; overflow: hidden;
}
.mp-row {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer; transition: background 0.12s;
}
.mp-row:last-child { border-bottom: none; }
.mp-row:hover { background: rgba(255,255,255,0.02); }

.mp-row-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mp-row-info { flex: 1; min-width: 0; }
.mp-row-name { font-size: 14px; font-weight: 600; color: var(--t1); margin-bottom: 4px; }
.mp-row-meta {
  display: flex; gap: 14px; font-size: 11px; color: var(--t3);
  font-family: 'JetBrains Mono', monospace;
}
.mp-row-meta span { display: flex; align-items: center; gap: 3px; }

.mp-row-days {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: var(--green);
  font-family: 'JetBrains Mono', monospace;
}
.mp-row-badge {
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 5px; white-space: nowrap;
}
.badge-active { background: rgba(0,201,138,0.08); color: var(--green); border: 1px solid rgba(0,201,138,0.15); }
.badge-pending { background: rgba(240,160,32,0.08); color: var(--gold); border: 1px solid rgba(240,160,32,0.15); }

.mp-row-status {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; white-space: nowrap;
}

.mp-empty-add { padding: 16px 18px; }
.mp-add-btn {
  display: flex; align-items: center; gap: 6px; width: 100%;
  padding: 14px; border-radius: 10px;
  background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08);
  color: var(--t3); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; justify-content: center;
  font-family: 'Inter', sans-serif;
}
.mp-add-btn:hover { border-color: rgba(0,212,232,0.2); color: var(--cyan); background: rgba(0,212,232,0.03); }
`
