import { useState } from 'react'
import { useAccount } from 'wagmi'
import {
  Landmark, Target, Plus, Trash2, ArrowRight, ArrowLeft,
  Lock, Hexagon, Loader2, CheckCircle2, Users, Clock
} from 'lucide-react'

interface Heir {
  address: string
  name: string
  sharePct: number
}

const STEPS = ['Plan Type', 'Beneficiaries', 'Conditions', 'Review']

export default function CreatePlan() {
  const { isConnected } = useAccount()
  const [step, setStep] = useState(0)
  const [planType, setPlanType] = useState<'inheritance' | 'goal'>('inheritance')
  const [heirs, setHeirs] = useState<Heir[]>([{ address: '', name: '', sharePct: 100 }])
  const [inactivityDays, setInactivityDays] = useState('180')
  const [unlockDate, setUnlockDate] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const addHeir = () => {
    if (heirs.length >= 10) return
    setHeirs([...heirs, { address: '', name: '', sharePct: 0 }])
  }

  const removeHeir = (i: number) => {
    if (heirs.length <= 1) return
    setHeirs(heirs.filter((_, idx) => idx !== i))
  }

  const updateHeir = (i: number, field: keyof Heir, value: string | number) => {
    const updated = [...heirs]
    updated[i] = { ...updated[i], [field]: value }
    setHeirs(updated)
  }

  const totalShare = heirs.reduce((sum, h) => sum + h.sharePct, 0)

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Demo: simulate tx
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
    }, 3000)
  }

  if (isComplete) {
    return (
      <div className="page-container">
        <style>{styles}</style>
        <div className="cp-complete">
          <div className="cp-complete-icon"><CheckCircle2 size={40} strokeWidth={1.5} /></div>
          <h2 className="cp-complete-title">Plan Created Successfully</h2>
          <p className="cp-complete-sub">
            Your inheritance plan has been encrypted and deployed on-chain.
            Heir addresses are now stored as <code>eaddress</code> ciphertext — invisible to everyone.
          </p>
          <button className="cp-btn-primary" onClick={() => { setIsComplete(false); setStep(0) }}>
            Create Another Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <style>{styles}</style>

      {/* Header */}
      <div className="cp-header">
        <div>
          <h1 className="pg-title">Create Plan</h1>
          <p className="pg-sub">Set up a new inheritance or future goal plan.</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="cp-progress">
        {STEPS.map((s, i) => (
          <div key={s} className={`cp-prog-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="cp-prog-dot">{i < step ? <CheckCircle2 size={14} strokeWidth={2.5} /> : i + 1}</div>
            <span className="cp-prog-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Plan Type */}
      {step === 0 && (
        <div className="cp-step-content">
          <h2 className="cp-step-title">Choose plan type</h2>
          <p className="cp-step-sub">Select how your assets will be released to beneficiaries.</p>
          <div className="cp-type-grid">
            <div className={`cp-type-card ${planType === 'inheritance' ? 'selected' : ''}`} onClick={() => setPlanType('inheritance')}>
              <Landmark size={24} strokeWidth={1.5} />
              <h3>Inheritance</h3>
              <p>Transfer assets to heirs if you stop checking in. Dead-man's switch mechanism.</p>
            </div>
            <div className={`cp-type-card ${planType === 'goal' ? 'selected' : ''}`} onClick={() => setPlanType('goal')}>
              <Target size={24} strokeWidth={1.5} />
              <h3>Future Goal</h3>
              <p>Release assets on a specific date — graduation, birthday, milestone.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Beneficiaries */}
      {step === 1 && (
        <div className="cp-step-content">
          <h2 className="cp-step-title">Add beneficiaries</h2>
          <p className="cp-step-sub">Addresses are encrypted as <code>eaddress</code> before storing on-chain.</p>

          <div className="cp-heir-list">
            {heirs.map((h, i) => (
              <div className="cp-heir-row" key={i}>
                <div className="cp-heir-num">{i + 1}</div>
                <div className="cp-heir-fields">
                  <input
                    className="cp-input"
                    placeholder="Name (optional)"
                    value={h.name}
                    onChange={e => updateHeir(i, 'name', e.target.value)}
                  />
                  <input
                    className="cp-input cp-input-addr"
                    placeholder="0x... wallet address"
                    value={h.address}
                    onChange={e => updateHeir(i, 'address', e.target.value)}
                  />
                  <div className="cp-heir-pct-wrap">
                    <input
                      className="cp-input cp-input-pct"
                      type="number"
                      min={0}
                      max={100}
                      value={h.sharePct}
                      onChange={e => updateHeir(i, 'sharePct', Number(e.target.value))}
                    />
                    <span className="cp-pct-sign">%</span>
                  </div>
                </div>
                {heirs.length > 1 && (
                  <button className="cp-heir-remove" onClick={() => removeHeir(i)}>
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="cp-heir-actions">
            <button className="cp-add-heir" onClick={addHeir}>
              <Plus size={14} strokeWidth={2} /> Add Beneficiary
            </button>
            <div className={`cp-share-total ${totalShare === 100 ? 'valid' : 'invalid'}`}>
              Total: {totalShare}% {totalShare === 100 ? '✓' : '(must equal 100%)'}
            </div>
          </div>

          <div className="cp-enc-note">
            <Lock size={12} strokeWidth={2} />
            All addresses will be encrypted via Zama fhEVM before on-chain storage.
          </div>
        </div>
      )}

      {/* Step 2: Conditions */}
      {step === 2 && (
        <div className="cp-step-content">
          <h2 className="cp-step-title">Set conditions</h2>
          <p className="cp-step-sub">Define the trigger and lock your assets.</p>

          <div className="cp-fields">
            {planType === 'inheritance' ? (
              <div className="cp-field">
                <label className="cp-label"><Clock size={13} strokeWidth={2} /> Inactivity Trigger</label>
                <select className="cp-input" value={inactivityDays} onChange={e => setInactivityDays(e.target.value)}>
                  <option value="1">1 day (demo)</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                </select>
                <span className="cp-field-hint">If you don't check in for this long, the plan triggers.</span>
              </div>
            ) : (
              <div className="cp-field">
                <label className="cp-label"><Clock size={13} strokeWidth={2} /> Unlock Date</label>
                <input
                  className="cp-input"
                  type="date"
                  value={unlockDate}
                  onChange={e => setUnlockDate(e.target.value)}
                />
                <span className="cp-field-hint">Assets release on this date automatically.</span>
              </div>
            )}

            <div className="cp-field">
              <label className="cp-label"><Hexagon size={13} strokeWidth={2} /> ETH to Lock</label>
              <input
                className="cp-input"
                type="number"
                step="0.001"
                placeholder="0.00"
                value={ethAmount}
                onChange={e => setEthAmount(e.target.value)}
              />
              <span className="cp-field-hint">This ETH will be locked in the smart contract until trigger.</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="cp-step-content">
          <h2 className="cp-step-title">Review & deploy</h2>
          <p className="cp-step-sub">Confirm your plan details before deploying on-chain.</p>

          <div className="cp-review">
            <div className="cp-review-row">
              <span className="cp-review-key">Plan Type</span>
              <span className="cp-review-val">{planType === 'inheritance' ? 'Inheritance' : 'Future Goal'}</span>
            </div>
            <div className="cp-review-row">
              <span className="cp-review-key">Beneficiaries</span>
              <span className="cp-review-val">{heirs.length}</span>
            </div>
            {heirs.map((h, i) => (
              <div className="cp-review-row cp-review-heir" key={i}>
                <span className="cp-review-key">{h.name || `Heir ${i + 1}`}</span>
                <span className="cp-review-val">
                  <code>{h.address ? `${h.address.slice(0, 6)}...${h.address.slice(-4)}` : 'No address'}</code>
                  <span className="cp-review-pct">{h.sharePct}%</span>
                </span>
              </div>
            ))}
            <div className="cp-review-row">
              <span className="cp-review-key">
                {planType === 'inheritance' ? 'Inactivity Window' : 'Unlock Date'}
              </span>
              <span className="cp-review-val">
                {planType === 'inheritance' ? `${inactivityDays} days` : unlockDate || 'Not set'}
              </span>
            </div>
            <div className="cp-review-row">
              <span className="cp-review-key">ETH Locked</span>
              <span className="cp-review-val">{ethAmount || '0'} ETH</span>
            </div>
          </div>

          <div className="cp-enc-note">
            <Lock size={12} strokeWidth={2} />
            All heir addresses and shares will be encrypted before deployment. Nobody can read them on-chain.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="cp-nav">
        {step > 0 && (
          <button className="cp-btn-ghost" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < 3 ? (
          <button className="cp-btn-primary" onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={14} strokeWidth={2} />
          </button>
        ) : (
          <button className="cp-btn-primary cp-btn-deploy" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 size={14} className="spin" /> Encrypting & Deploying...</>
            ) : (
              <><Hexagon size={14} strokeWidth={2} /> Encrypt & Deploy Plan</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

const styles = `
.page-container { max-width: 680px; }

.cp-header { margin-bottom: 20px; }
.pg-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px;
}
.pg-sub { font-size: 13px; color: var(--t3); }

/* Progress */
.cp-progress {
  display: flex; gap: 4px; margin-bottom: 28px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px; padding: 12px 16px;
}
.cp-prog-step {
  flex: 1; display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--t3); font-weight: 500;
}
.cp-prog-step.active { color: var(--t1); }
.cp-prog-step.done .cp-prog-dot { background: rgba(0,201,138,0.1); border-color: rgba(0,201,138,0.3); color: var(--green); }
.cp-prog-dot {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.cp-prog-step.active .cp-prog-dot { background: rgba(0,212,232,0.08); border-color: rgba(0,212,232,0.25); color: var(--cyan); }

/* Step content */
.cp-step-content { margin-bottom: 20px; }
.cp-step-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px; font-weight: 700; color: var(--t1); margin-bottom: 4px;
}
.cp-step-sub { font-size: 13px; color: var(--t3); margin-bottom: 20px; }

/* Plan type cards */
.cp-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cp-type-card {
  padding: 24px; border-radius: 14px;
  background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06);
  cursor: pointer; transition: all 0.2s; text-align: center;
  color: var(--t3);
}
.cp-type-card:hover { border-color: rgba(0,212,232,0.2); background: rgba(0,212,232,0.03); color: var(--t2); }
.cp-type-card.selected { border-color: rgba(0,212,232,0.35); background: rgba(0,212,232,0.05); color: var(--cyan); }
.cp-type-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px; font-weight: 600; color: var(--t1); margin: 12px 0 6px;
}
.cp-type-card p { font-size: 12px; line-height: 1.5; color: var(--t2); }

/* Heir rows */
.cp-heir-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.cp-heir-row {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px; padding: 12px;
}
.cp-heir-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(0,212,232,0.06); border: 1px solid rgba(0,212,232,0.15);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px; font-weight: 700; color: var(--cyan); flex-shrink: 0; margin-top: 4px;
}
.cp-heir-fields { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.cp-heir-pct-wrap { position: relative; width: 80px; }
.cp-pct-sign {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  font-size: 12px; color: var(--t3);
}
.cp-heir-remove {
  background: none; border: none; color: var(--t3); cursor: pointer;
  padding: 6px; border-radius: 6px; transition: all 0.15s; margin-top: 4px;
}
.cp-heir-remove:hover { color: var(--red); background: rgba(224,80,80,0.06); }

.cp-heir-actions { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.cp-add-heir {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--cyan); background: none; border: none;
  cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif;
  padding: 6px 0; transition: opacity 0.15s;
}
.cp-add-heir:hover { opacity: 0.8; }
.cp-share-total { font-size: 12px; font-family: 'JetBrains Mono', monospace; }
.cp-share-total.valid { color: var(--green); }
.cp-share-total.invalid { color: var(--gold); }

/* Inputs */
.cp-input {
  width: 100%; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
  padding: 9px 12px; color: var(--t1); font-size: 13px;
  font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s;
}
.cp-input:focus { border-color: rgba(0,212,232,0.3); box-shadow: 0 0 0 3px rgba(0,212,232,0.06); }
.cp-input::placeholder { color: var(--t4); }
.cp-input-addr { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.cp-input-pct { padding-right: 28px; }

/* Fields */
.cp-fields { display: flex; flex-direction: column; gap: 16px; }
.cp-field { display: flex; flex-direction: column; gap: 6px; }
.cp-label {
  font-size: 12px; font-weight: 500; color: var(--t2);
  display: flex; align-items: center; gap: 6px;
}
.cp-field-hint { font-size: 11px; color: var(--t3); }

/* Encryption note */
.cp-enc-note {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 8px;
  background: rgba(0,212,232,0.03); border: 1px solid rgba(0,212,232,0.1);
  font-size: 11px; color: var(--t2); margin-top: 16px;
}

/* Review */
.cp-review {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; overflow: hidden;
}
.cp-review-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
}
.cp-review-row:last-child { border-bottom: none; }
.cp-review-heir { background: rgba(255,255,255,0.01); }
.cp-review-key { font-size: 13px; color: var(--t3); }
.cp-review-val {
  font-size: 13px; color: var(--t1); font-weight: 500;
  display: flex; align-items: center; gap: 8px;
}
.cp-review-pct { color: var(--cyan); font-family: 'JetBrains Mono', monospace; font-size: 12px; }

/* Navigation */
.cp-nav { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.cp-btn-primary {
  display: flex; align-items: center; gap: 7px;
  padding: 11px 22px; background: var(--cyan);
  border: none; border-radius: 9px; color: #000;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.cp-btn-primary:hover { background: var(--cyan-hi); box-shadow: 0 6px 24px rgba(0,212,232,0.3); transform: translateY(-1px); }
.cp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
.cp-btn-deploy { background: var(--green); }
.cp-btn-deploy:hover { background: #00d99a; box-shadow: 0 6px 24px rgba(0,201,138,0.3); }
.cp-btn-ghost {
  display: flex; align-items: center; gap: 6px;
  padding: 11px 18px; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06); border-radius: 9px;
  color: var(--t2); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
}
.cp-btn-ghost:hover { color: var(--t1); background: rgba(255,255,255,0.05); }

/* Complete */
.cp-complete {
  text-align: center; padding: 60px 20px;
  display: flex; flex-direction: column; align-items: center;
}
.cp-complete-icon { color: var(--green); margin-bottom: 16px; }
.cp-complete-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 8px;
}
.cp-complete-sub { font-size: 13px; color: var(--t2); max-width: 380px; line-height: 1.6; margin-bottom: 24px; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`
