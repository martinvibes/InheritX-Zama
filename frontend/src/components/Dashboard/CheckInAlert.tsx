import { useState, useEffect } from 'react'
import { HeartPulse, Check, Loader2 } from 'lucide-react'
import { useCheckIn } from '../../hooks/usePlans'

interface CheckInAlertProps {
  daysLeft: number
  planId: number
}

export default function CheckInAlert({ daysLeft, planId }: CheckInAlertProps) {
  const { checkIn, isPending, isConfirming, isSuccess } = useCheckIn()
  const [days, setDays] = useState(daysLeft)

  useEffect(() => {
    if (isSuccess) setDays(180) // Reset to full window after successful check-in
  }, [isSuccess])

  const isLoading = isPending || isConfirming
  const pct = Math.round((days / 180) * 100)

  return (
    <div className="heartbeat-card">
      <div className="hb-left">
        <div className="hb-header">
          <div className="hb-pulse-dot" />
          <span className="hb-title">Proof of Life</span>
          <span className={`hb-status ${days > 30 ? 'hb-safe' : 'hb-warn'}`}>
            {days > 30 ? 'Safe' : 'Action Needed'}
          </span>
        </div>
        <div className="hb-ecg-wrap">
          <svg className="hb-ecg" viewBox="0 0 300 60" preserveAspectRatio="none">
            <polyline className="ecg-line" fill="none" stroke="var(--green)" strokeWidth="1.5"
              points="0,30 30,30 40,30 50,10 55,50 60,20 65,35 70,30 100,30 130,30 140,30 150,10 155,50 160,20 165,35 170,30 200,30 230,30 240,30 250,10 255,50 260,20 265,35 270,30 300,30" />
          </svg>
        </div>
        <div className="hb-meta">
          <div className="hb-days">
            <span className="hb-days-num">{days}</span>
            <span className="hb-days-label">days remaining</span>
          </div>
          <div className="hb-progress-wrap">
            <div className="hb-progress-bar"><div className="hb-progress-fill" style={{ width: `${pct}%` }} /></div>
            <span className="hb-progress-pct">{pct}%</span>
          </div>
        </div>
      </div>
      <div className="hb-right">
        <button className={`btn-checkin ${isSuccess ? 'checked' : ''}`} onClick={() => checkIn(planId)} disabled={isLoading}>
          {isLoading ? (
            <><Loader2 size={16} strokeWidth={2} className="spin" /> {isPending ? 'Confirm...' : 'Checking in...'}</>
          ) : isSuccess ? (
            <><Check size={16} strokeWidth={2.5} /> Confirmed</>
          ) : (
            <><HeartPulse size={16} strokeWidth={2} /> I'm Alive</>
          )}
        </button>
        <div className="hb-hint">Sends on-chain transaction</div>
      </div>
    </div>
  )
}
