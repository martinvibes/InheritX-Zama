import { useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { INHERITX_ABI } from '../lib/contracts'

export default function KYCVerification() {
  const { address, isConnected } = useAccount()

  // Read current KYC status from chain
  const { data: rawStatus, refetch: refetchStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: INHERITX_ABI,
    functionName: 'kycStatus',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT_ADDRESS },
  })

  const kycStatus = rawStatus !== undefined ? Number(rawStatus) : 0
  // 0 = NOT_SUBMITTED, 1 = SUBMITTED, 2 = VERIFIED

  // Submit KYC tx
  const { writeContract: writeSubmit, data: submitHash, isPending: submitPending, error: submitError } = useWriteContract()
  const { isLoading: submitConfirming, isSuccess: submitSuccess } = useWaitForTransactionReceipt({ hash: submitHash })

  // Verify KYC tx (self-verify since deployer = user)
  const { writeContract: writeVerify, data: verifyHash, isPending: verifyPending } = useWriteContract()
  const { isLoading: verifyConfirming, isSuccess: verifySuccess } = useWaitForTransactionReceipt({ hash: verifyHash })

  // After submit confirms, auto-verify
  useEffect(() => {
    if (submitSuccess && address && CONTRACT_ADDRESS) {
      const timer = setTimeout(() => {
        writeVerify({
          address: CONTRACT_ADDRESS,
          abi: INHERITX_ABI,
          functionName: 'verifyKYC' as any,
          args: [address] as any,
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [submitSuccess])

  // After verify confirms, refetch status
  useEffect(() => {
    if (verifySuccess) {
      refetchStatus()
    }
  }, [verifySuccess])

  const handleSubmit = () => {
    if (!CONTRACT_ADDRESS || !address) return
    writeSubmit({
      address: CONTRACT_ADDRESS,
      abi: INHERITX_ABI,
      functionName: 'submitKYC',
    })
  }

  const isSubmitting = submitPending || submitConfirming
  const isVerifying = verifyPending || verifyConfirming
  const isVerified = kycStatus === 2 || verifySuccess

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="kyc-page-header">
        <ShieldCheck size={20} strokeWidth={1.8} style={{ color: 'var(--cyan)' }} />
        <div>
          <h1 className="pg-title">KYC Verification</h1>
          <p className="pg-sub">Identity verification is required to create inheritance plans.</p>
        </div>
      </div>

      <div className="kyc-card">
        {isVerified ? (
          <>
            <div className="kyc-status-icon kyc-si-ok"><CheckCircle2 size={28} strokeWidth={1.5} /></div>
            <h2 className="kyc-card-title">Verified</h2>
            <p className="kyc-card-sub">Your identity is verified on-chain. You can now create inheritance plans.</p>
            <div className="kyc-verified-badge"><CheckCircle2 size={12} strokeWidth={2.5} /> KYC Verified</div>
          </>
        ) : isVerifying ? (
          <>
            <div className="kyc-status-icon kyc-si-pending"><Loader2 size={28} strokeWidth={1.5} className="spin" /></div>
            <h2 className="kyc-card-title">Verifying...</h2>
            <p className="kyc-card-sub">Confirming verification on-chain. Please approve the transaction in your wallet.</p>
          </>
        ) : submitSuccess || kycStatus === 1 ? (
          <>
            <div className="kyc-status-icon kyc-si-pending"><Clock size={28} strokeWidth={1.5} /></div>
            <h2 className="kyc-card-title">Submitted — Verifying</h2>
            <p className="kyc-card-sub">KYC submitted. Auto-verification in progress...</p>
            <div className="kyc-loader-bar"><div className="kyc-loader-fill" /></div>
          </>
        ) : isSubmitting ? (
          <>
            <div className="kyc-status-icon kyc-si-pending"><Loader2 size={28} strokeWidth={1.5} className="spin" /></div>
            <h2 className="kyc-card-title">Submitting KYC...</h2>
            <p className="kyc-card-sub">{submitPending ? 'Please approve the transaction in your wallet.' : 'Waiting for on-chain confirmation...'}</p>
          </>
        ) : (
          <>
            <div className="kyc-status-icon kyc-si-warn"><AlertTriangle size={28} strokeWidth={1.5} /></div>
            <h2 className="kyc-card-title">Verification Required</h2>
            <p className="kyc-card-sub">Complete identity verification to unlock plan creation. Two transactions — submit then verify.</p>
            <div className="kyc-steps">
              <div className="kyc-step"><span className="kyc-step-num">1</span><span>Submit KYC (sign transaction)</span></div>
              <div className="kyc-step"><span className="kyc-step-num">2</span><span>Auto-verify (sign second transaction)</span></div>
              <div className="kyc-step"><span className="kyc-step-num">3</span><span>Start creating plans</span></div>
            </div>
            {submitError && (
              <div className="kyc-error">{submitError.message.includes('already submitted') ? 'KYC already submitted' : 'Transaction failed. Try again.'}</div>
            )}
            {!isConnected ? (
              <p className="kyc-connect-hint">Connect your wallet first.</p>
            ) : (
              <button className="kyc-submit-btn" onClick={handleSubmit}>
                Submit KYC <ArrowRight size={14} strokeWidth={2} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = `
.page-container { max-width: 640px; }
.kyc-page-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
.pg-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.pg-sub { font-size: 13px; color: var(--t3); }
.kyc-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.kyc-status-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.kyc-si-warn { background: rgba(240,160,32,0.08); color: var(--gold); border: 1px solid rgba(240,160,32,0.15); }
.kyc-si-pending { background: rgba(0,212,232,0.08); color: var(--cyan); border: 1px solid rgba(0,212,232,0.15); }
.kyc-si-ok { background: rgba(0,201,138,0.08); color: var(--green); border: 1px solid rgba(0,201,138,0.15); }
.kyc-card-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--t1); margin-bottom: 8px; }
.kyc-card-sub { font-size: 13px; color: var(--t2); max-width: 380px; line-height: 1.6; margin-bottom: 24px; }
.kyc-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; width: 100%; max-width: 320px; }
.kyc-step { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--t2); text-align: left; }
.kyc-step-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,212,232,0.06); border: 1px solid rgba(0,212,232,0.15); display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; color: var(--cyan); flex-shrink: 0; }
.kyc-submit-btn { display: flex; align-items: center; gap: 8px; padding: 12px 28px; background: var(--cyan); border: none; border-radius: 10px; color: #000; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.kyc-submit-btn:hover { background: var(--cyan-hi); box-shadow: 0 6px 24px rgba(0,212,232,0.3); transform: translateY(-1px); }
.kyc-connect-hint { font-size: 12px; color: var(--t3); font-style: italic; }
.kyc-loader-bar { width: 200px; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.kyc-loader-fill { height: 100%; width: 30%; background: var(--cyan); border-radius: 2px; animation: kyc-load 1.5s ease-in-out infinite; }
@keyframes kyc-load { 0%{width:0;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0;margin-left:100%} }
.kyc-verified-badge { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--green); background: rgba(0,201,138,0.08); border: 1px solid rgba(0,201,138,0.15); padding: 6px 14px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; }
.kyc-error { padding: 8px 14px; border-radius: 8px; background: rgba(224,80,80,0.06); border: 1px solid rgba(224,80,80,0.15); font-size: 12px; color: var(--red); margin-bottom: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`
