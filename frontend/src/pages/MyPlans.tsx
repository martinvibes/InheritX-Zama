import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Eye, EyeOff } from 'lucide-react'
// ETH amount is encrypted on-chain (euint128) — not readable from view functions
import {
  Plus, Landmark, Target, Clock, Users, Lock,
  HeartPulse, CheckCircle2, XCircle, ChevronRight,
  ArrowLeft, AlertTriangle, Hexagon, Calendar
} from 'lucide-react'
import { useOwnerPlans, usePlan, useCheckIn, useTimeUntilTrigger, usePlanBalance } from '../hooks/usePlans'
import { formatEther } from 'viem'

export default function MyPlans({ onCreatePlan }: { onCreatePlan: () => void; onNavigate: (page: string) => void }) {
  const { address } = useAccount()
  const { planIds } = useOwnerPlans(address)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

  if (selectedPlanId !== null) {
    return <PlanDetail planId={selectedPlanId} onBack={() => setSelectedPlanId(null)} />
  }

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

      {planIds && planIds.length > 0 ? (
        <div className="mp-list">
          {planIds.map((id) => (
            <PlanRow key={id.toString()} planId={Number(id)} onClick={() => setSelectedPlanId(Number(id))} />
          ))}
        </div>
      ) : (
        <div className="mp-empty">
          <Hexagon size={32} strokeWidth={1} style={{ color: 'var(--t3)', opacity: 0.4 }} />
          <h3>No plans yet</h3>
          <p>Create your first inheritance plan to get started.</p>
          <button className="mp-create-btn" onClick={onCreatePlan}>
            <Plus size={14} strokeWidth={2.5} /> Create First Plan
          </button>
        </div>
      )}
    </div>
  )
}

function PlanRow({ planId, onClick }: { planId: number; onClick: () => void }) {
  const { plan } = usePlan(planId)
  if (!plan) return null

  const isInheritance = plan.planType === 0
  const statusColor = plan.cancelled ? 'var(--red)' : plan.triggered ? 'var(--gold)' : 'var(--green)'
  const statusLabel = plan.cancelled ? 'Cancelled' : plan.triggered ? 'Triggered' : plan.claimed ? 'Claimed' : 'Active'
  const StatusIcon = plan.cancelled ? XCircle : plan.triggered ? AlertTriangle : CheckCircle2

  return (
    <div className="mp-row" onClick={onClick}>
      <div className="mp-row-icon" style={{
        background: isInheritance ? 'rgba(0,212,232,0.06)' : 'rgba(240,160,32,0.06)',
        color: isInheritance ? 'var(--cyan)' : 'var(--gold)',
      }}>
        {isInheritance ? <Landmark size={18} strokeWidth={1.5} /> : <Target size={18} strokeWidth={1.5} />}
      </div>
      <div className="mp-row-info">
        <div className="mp-row-name">{plan.name}</div>
        <div className="mp-row-meta">
          <span><Users size={10} strokeWidth={2} /> {plan.beneficiaryCount}</span>
          <span><Clock size={10} strokeWidth={2} /> {plan.inactivityDays.toString()}d</span>
          <span><Lock size={10} strokeWidth={2} /> Encrypted</span>
        </div>
      </div>
      <div className="mp-row-badge" style={{ background: `${statusColor}12`, color: statusColor, borderColor: `${statusColor}25` }}>
        <StatusIcon size={10} strokeWidth={2.5} /> {statusLabel}
      </div>
      <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--t4)' }} />
    </div>
  )
}

function PlanDetail({ planId, onBack }: { planId: number; onBack: () => void }) {
  const { plan, refetch } = usePlan(planId)
  const { data: timeLeft } = useTimeUntilTrigger(planId)
  const { data: rawBalance } = usePlanBalance(planId)
  const { checkIn, isPending, isConfirming, isSuccess } = useCheckIn()
  const ethBalance = rawBalance ? formatEther(rawBalance as bigint) : null

  if (!plan) return <div className="pd-loading">Loading plan...</div>

  const isInheritance = plan.planType === 0
  const daysLeft = timeLeft ? Math.ceil(Number(timeLeft) / 86400) : 0
  const lastCheckinDate = new Date(Number(plan.lastCheckin) * 1000)
  const isCheckingIn = isPending || isConfirming
  const [showBalance, setShowBalance] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    })
  }

  return (
    <div className="page-container-wide">
      <style>{styles}</style>
      <button className="pd-back" onClick={onBack}>
        <ArrowLeft size={14} strokeWidth={2} /> Back to Plans
      </button>

      <div className="pd-header">
        <div className="pd-icon" style={{
          background: isInheritance ? 'rgba(0,212,232,0.08)' : 'rgba(240,160,32,0.08)',
          color: isInheritance ? 'var(--cyan)' : 'var(--gold)',
        }}>
          {isInheritance ? <Landmark size={24} strokeWidth={1.5} /> : <Target size={24} strokeWidth={1.5} />}
        </div>
        <div>
          <h1 className="pd-title">{plan.name}</h1>
          <p className="pd-subtitle">{isInheritance ? 'Inheritance Plan' : 'Future Goal Plan'} · Plan #{planId}</p>
        </div>
        <div className={`pd-status ${plan.triggered ? 'pd-triggered' : plan.cancelled ? 'pd-cancelled' : 'pd-active'}`}>
          {plan.cancelled ? 'Cancelled' : plan.triggered ? 'Triggered' : plan.claimed ? 'Claimed' : 'Active'}
        </div>
      </div>

      {/* Check-in card */}
      {!plan.triggered && !plan.cancelled && isInheritance && (
        <div className="pd-checkin-card">
          <div className="pd-checkin-left">
            <div className="pd-pulse-dot" />
            <div>
              <div className="pd-checkin-title">Proof of Life</div>
              <div className="pd-checkin-sub">
                {daysLeft > 0 ? (
                  <>Triggers in <strong style={{ color: daysLeft > 30 ? 'var(--green)' : 'var(--gold)' }}>{daysLeft} days</strong></>
                ) : (
                  <strong style={{ color: 'var(--red)' }}>Ready to trigger</strong>
                )}
              </div>
            </div>
          </div>
          <button className="pd-checkin-btn" onClick={() => checkIn(planId)} disabled={isCheckingIn}>
            {isCheckingIn ? 'Confirming...' : isSuccess ? '✓ Checked In' : '♥ I\'m Alive'}
          </button>
        </div>
      )}

      {/* Description */}
      {plan.description && (
        <div className="pd-desc">
          <div className="pd-desc-label">Owner's Message</div>
          <div className="pd-desc-text">{plan.description}</div>
        </div>
      )}

      {/* Info grid */}
      <div className="pd-grid">
        <div className="pd-card">
          <div className="pd-card-label">ETH Locked</div>
          {showBalance && ethBalance ? (
            <div className="pd-card-value">{ethBalance} ETH</div>
          ) : (
            <div className="pd-card-value pd-encrypted"><Lock size={14} strokeWidth={2} /> ••••••</div>
          )}
          <button className="pd-reveal-btn" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <><EyeOff size={11} strokeWidth={2} /> Hide</> : <><Eye size={11} strokeWidth={2} /> Reveal</>}
          </button>
        </div>
        <div className="pd-card">
          <div className="pd-card-label">Beneficiaries</div>
          <div className="pd-card-value">{plan.beneficiaryCount}</div>
        </div>
        <div className="pd-card">
          <div className="pd-card-label">{isInheritance ? 'Inactivity Window' : 'Unlock Date'}</div>
          <div className="pd-card-value">
            {isInheritance ? `${plan.inactivityDays.toString()} days` : new Date(Number(plan.unlockDate) * 1000).toLocaleDateString()}
          </div>
        </div>
        <div className="pd-card">
          <div className="pd-card-label">Last Check-in</div>
          <div className="pd-card-value">{formatTime(lastCheckinDate)}</div>
        </div>
      </div>

      {/* Details table */}
      <div className="pd-details">
        <div className="pd-details-title">Plan Details</div>
        <div className="pd-row"><span>Plan ID</span><code>{planId}</code></div>
        <div className="pd-row"><span>Owner</span><code>{plan.owner.slice(0, 6)}...{plan.owner.slice(-4)}</code></div>
        <div className="pd-row"><span>Type</span><span>{isInheritance ? 'Inheritance (Dead-Man\'s Switch)' : 'Future Goal (Time-Lock)'}</span></div>
        <div className="pd-row"><span>Triggered</span><span style={{ color: plan.triggered ? 'var(--gold)' : 'var(--green)' }}>{plan.triggered ? 'Yes' : 'No'}</span></div>
        <div className="pd-row"><span>Claimed</span><span>{plan.claimed ? 'Yes' : 'No'}</span></div>
        <div className="pd-row"><span>Encryption</span><span style={{ color: 'var(--cyan)' }}>eaddress + euint32 via fhEVM</span></div>
      </div>

      <div className="pd-etherscan">
        <a href={`https://sepolia.etherscan.io/address/${plan.owner}`} target="_blank" rel="noopener">
          View on Etherscan →
        </a>
      </div>
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

.mp-empty {
  text-align: center; padding: 60px 20px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.mp-empty h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; color: var(--t2); }
.mp-empty p { font-size: 13px; color: var(--t3); margin-bottom: 12px; }

.mp-list {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; overflow: hidden;
}
.mp-row {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.03);
  cursor: pointer; transition: all 0.15s;
}
.mp-row:last-child { border-bottom: none; }
.mp-row:hover { background: rgba(255,255,255,0.025); }
.mp-row-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mp-row-info { flex: 1; min-width: 0; }
.mp-row-name { font-size: 14px; font-weight: 600; color: var(--t1); margin-bottom: 4px; }
.mp-row-meta { display: flex; gap: 14px; font-size: 11px; color: var(--t3); font-family: 'JetBrains Mono', monospace; }
.mp-row-meta span { display: flex; align-items: center; gap: 3px; }
.mp-row-badge {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 5px; white-space: nowrap; border: 1px solid;
}

/* ─── Plan Detail ─── */
.pd-loading { padding: 40px; text-align: center; color: var(--t3); }
.pd-back {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; color: var(--t3); font-size: 13px;
  cursor: pointer; margin-bottom: 20px; padding: 0; font-family: 'Inter', sans-serif;
  transition: color 0.15s;
}
.pd-back:hover { color: var(--cyan); }

.pd-header {
  display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
}
.pd-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pd-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--t1); }
.pd-subtitle { font-size: 12px; color: var(--t3); margin-top: 2px; }
.pd-status {
  margin-left: auto; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; padding: 5px 12px; border-radius: 6px;
}
.pd-active { background: rgba(0,201,138,0.08); color: var(--green); border: 1px solid rgba(0,201,138,0.15); }
.pd-triggered { background: rgba(240,160,32,0.08); color: var(--gold); border: 1px solid rgba(240,160,32,0.15); }
.pd-cancelled { background: rgba(224,80,80,0.08); color: var(--red); border: 1px solid rgba(224,80,80,0.15); }

.pd-checkin-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; margin-bottom: 16px;
  background: rgba(0,201,138,0.03); border: 1px solid rgba(0,201,138,0.12);
  border-radius: 12px;
}
.pd-checkin-left { display: flex; align-items: center; gap: 12px; }
.pd-pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 8px var(--green);
  animation: pd-pulse 2s ease-in-out infinite;
}
@keyframes pd-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.pd-checkin-title { font-size: 14px; font-weight: 600; color: var(--t1); }
.pd-checkin-sub { font-size: 12px; color: var(--t3); }
.pd-checkin-btn {
  padding: 9px 18px; background: var(--green); border: none; border-radius: 8px;
  color: #000; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.pd-checkin-btn:hover { box-shadow: 0 4px 16px rgba(0,201,138,0.3); }
.pd-checkin-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.pd-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;
}
.pd-card {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; padding: 16px;
}
.pd-card-label { font-size: 11px; color: var(--t3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.pd-card-value { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--t1); }

.pd-details {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; overflow: hidden; margin-bottom: 12px;
}
.pd-details-title {
  padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.04);
  font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: var(--t1);
}
.pd-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 18px; border-bottom: 1px solid rgba(255,255,255,0.03);
  font-size: 13px;
}
.pd-row:last-child { border-bottom: none; }
.pd-row span:first-child { color: var(--t3); }
.pd-row span:last-child { color: var(--t1); font-weight: 500; }
.pd-row code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--t2); }

.pd-etherscan {
  text-align: right;
}
.pd-etherscan a {
  font-size: 12px; color: var(--cyan); font-family: 'JetBrains Mono', monospace;
  transition: opacity 0.15s;
}
.pd-etherscan a:hover { opacity: 0.8; }

.pd-desc {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; padding: 16px 18px; margin-bottom: 16px;
}
.pd-desc-label { font-size: 11px; color: var(--t3); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
.pd-desc-text { font-size: 14px; color: var(--t2); line-height: 1.6; font-style: italic; }
.pd-encrypted { display: flex; align-items: center; gap: 6px; color: var(--t3); font-size: 14px; letter-spacing: 0.05em; }
.pd-encrypted svg { color: var(--cyan); }
.pd-reveal-btn {
  display: flex; align-items: center; gap: 4px;
  margin-top: 8px; padding: 4px 10px; border-radius: 5px;
  background: rgba(0,212,232,0.06); border: 1px solid rgba(0,212,232,0.12);
  color: var(--cyan); font-size: 10px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  font-family: 'Inter', sans-serif; letter-spacing: 0.02em;
}
.pd-reveal-btn:hover { background: rgba(0,212,232,0.1); border-color: rgba(0,212,232,0.2); }

@media(max-width:800px) { .pd-grid { grid-template-columns: repeat(2, 1fr); } }
`
