import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Gift, Search, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function ClaimInheritance() {
  const { isConnected } = useAccount()
  const [planId, setPlanId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [found, setFound] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setFound(true)
    }, 1500)
  }

  const handleClaim = () => {
    setIsClaiming(true)
    setTimeout(() => {
      setIsClaiming(false)
      setClaimed(true)
    }, 3000)
  }

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="cl-header">
        <Gift size={20} strokeWidth={1.8} style={{ color: 'var(--cyan)' }} />
        <div>
          <h1 className="pg-title">Claim Inheritance</h1>
          <p className="pg-sub">If you're a designated beneficiary, claim your assets here.</p>
        </div>
      </div>

      {claimed ? (
        <div className="cl-card cl-success">
          <CheckCircle2 size={40} strokeWidth={1.5} style={{ color: 'var(--green)' }} />
          <h2>Inheritance Claimed</h2>
          <p>Assets have been transferred to your wallet. Check your balance.</p>
        </div>
      ) : (
        <div className="cl-card">
          <div className="cl-step">
            <div className="cl-step-header">
              <div className="cl-step-num">1</div>
              <span className="cl-step-label">Enter Plan ID</span>
            </div>
            <p className="cl-step-desc">Enter the plan ID shared by the plan owner or found in your notifications.</p>
            <div className="cl-input-row">
              <input
                className="cl-input"
                placeholder="Plan ID (e.g., 0)"
                value={planId}
                onChange={e => setPlanId(e.target.value)}
                type="number"
              />
              <button className="cl-search-btn" onClick={handleSearch} disabled={!planId || isSearching}>
                {isSearching ? <Loader2 size={14} className="spin" /> : <Search size={14} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {found && (
            <>
              <div className="cl-divider" />
              <div className="cl-step">
                <div className="cl-step-header">
                  <div className="cl-step-num cl-step-ok">2</div>
                  <span className="cl-step-label">Plan Found — Verifying Identity</span>
                </div>
                <div className="cl-verify-box">
                  <div className="cl-verify-row">
                    <ShieldCheck size={13} strokeWidth={2} style={{ color: 'var(--cyan)' }} />
                    <span>fhEVM is decrypting your <code>eaddress</code> to verify you're a designated heir.</span>
                  </div>
                  <div className="cl-verify-row">
                    <Lock size={13} strokeWidth={2} style={{ color: 'var(--green)' }} />
                    <span>KMS threshold network confirms your identity — no single party involved.</span>
                  </div>
                </div>
              </div>

              <div className="cl-divider" />
              <div className="cl-step">
                <div className="cl-step-header">
                  <div className="cl-step-num">3</div>
                  <span className="cl-step-label">Claim Your Share</span>
                </div>
                {!isConnected ? (
                  <p className="cl-connect-hint">Connect your wallet to claim.</p>
                ) : (
                  <button className="cl-claim-btn" onClick={handleClaim} disabled={isClaiming}>
                    {isClaiming ? (
                      <><Loader2 size={14} className="spin" /> Processing claim...</>
                    ) : (
                      <><Gift size={14} strokeWidth={2} /> Claim Inheritance</>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const styles = `
.page-container { max-width: 580px; }
.cl-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
.pg-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.pg-sub { font-size: 13px; color: var(--t3); }

.cl-card {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px; padding: 28px;
}
.cl-success { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 48px 28px; }
.cl-success h2 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--t1); }
.cl-success p { font-size: 13px; color: var(--t2); }

.cl-step { }
.cl-step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.cl-step-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(0,212,232,0.06); border: 1px solid rgba(0,212,232,0.15);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--cyan); flex-shrink: 0;
}
.cl-step-ok { background: rgba(0,201,138,0.08); border-color: rgba(0,201,138,0.2); color: var(--green); }
.cl-step-label { font-size: 14px; font-weight: 600; color: var(--t1); }
.cl-step-desc { font-size: 12px; color: var(--t3); margin-bottom: 12px; line-height: 1.5; }

.cl-input-row { display: flex; gap: 8px; }
.cl-input {
  flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; padding: 10px 14px; color: var(--t1); font-size: 13px;
  font-family: 'JetBrains Mono', monospace; outline: none; transition: border-color 0.15s;
}
.cl-input:focus { border-color: rgba(0,212,232,0.3); }
.cl-input::placeholder { color: var(--t4); }
.cl-search-btn {
  width: 40px; height: 40px; border-radius: 8px;
  background: rgba(0,212,232,0.08); border: 1px solid rgba(0,212,232,0.15);
  color: var(--cyan); cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.cl-search-btn:hover { background: rgba(0,212,232,0.12); }
.cl-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cl-divider { height: 1px; background: rgba(255,255,255,0.04); margin: 20px 0; }

.cl-verify-box {
  display: flex; flex-direction: column; gap: 8px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
  border-radius: 10px; padding: 14px;
}
.cl-verify-row {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 12px; color: var(--t2); line-height: 1.5;
}

.cl-claim-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 24px; background: var(--green);
  border: none; border-radius: 10px; color: #000;
  font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; margin-top: 4px;
}
.cl-claim-btn:hover { box-shadow: 0 6px 24px rgba(0,201,138,0.3); transform: translateY(-1px); }
.cl-claim-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

.cl-connect-hint { font-size: 12px; color: var(--t3); font-style: italic; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`
