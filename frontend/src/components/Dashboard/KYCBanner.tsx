import { AlertTriangle, ArrowRight } from 'lucide-react'

interface KYCBannerProps {
  onComplete: () => void
}

export default function KYCBanner({ onComplete }: KYCBannerProps) {
  return (
    <div className="kyc-banner">
      <div className="kyc-banner-left">
        <div className="kyc-icon-wrap">
          <AlertTriangle size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="kyc-banner-title">Identity verification required</div>
          <div className="kyc-banner-sub">Complete KYC to unlock plan creation. Takes under 30 seconds.</div>
        </div>
      </div>
      <button className="kyc-complete-btn" onClick={onComplete}>
        Verify Now <ArrowRight size={13} strokeWidth={2} />
      </button>
    </div>
  )
}
