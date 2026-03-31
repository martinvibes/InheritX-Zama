import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { FileText, Users, Wallet, Zap, Plus, Sparkles } from 'lucide-react'
import StatCard from '../components/Dashboard/StatCard'
import KYCBanner from '../components/Dashboard/KYCBanner'
import CheckInAlert from '../components/Dashboard/CheckInAlert'
import RecentPlans from '../components/Dashboard/RecentPlans'
import QuickActions from '../components/Dashboard/QuickActions'
import FHEBadge from '../components/shared/FHEBadge'
import { useKYC } from '../hooks/useKYC'
import { useOwnerPlans, usePlan, useTimeUntilTrigger } from '../hooks/usePlans'

function useTotalBeneficiaries(planIds: bigint[] | undefined) {
  // Read first 10 plans max
  const ids = planIds?.slice(0, 10) || []
  const p0 = usePlan(ids.length > 0 ? Number(ids[0]) : undefined)
  const p1 = usePlan(ids.length > 1 ? Number(ids[1]) : undefined)
  const p2 = usePlan(ids.length > 2 ? Number(ids[2]) : undefined)
  const p3 = usePlan(ids.length > 3 ? Number(ids[3]) : undefined)
  const p4 = usePlan(ids.length > 4 ? Number(ids[4]) : undefined)

  const plans = [p0, p1, p2, p3, p4]
  let total = 0
  for (let i = 0; i < ids.length && i < 5; i++) {
    total += plans[i].plan?.beneficiaryCount || 0
  }
  return total
}

export default function Overview() {
  const navigate = useNavigate()
  const { address } = useAccount()
  const kyc = useKYC(address)
  const { planIds } = useOwnerPlans(address)

  const kycStatus = kyc.status
  const planCount = planIds?.length || 0
  const totalBeneficiaries = useTotalBeneficiaries(planIds)
  const firstPlanId = planIds && planIds.length > 0 ? Number(planIds[0]) : undefined
  const { data: timeLeft } = useTimeUntilTrigger(firstPlanId)
  const daysLeft = timeLeft ? Math.ceil(Number(timeLeft) / 86400) : 0
  const hasPlans = planCount > 0

  const goCreate = () => navigate('/dashboard/create')
  const goKYC = () => navigate('/dashboard/kyc')
  const goPage = (page: string) => navigate(`/dashboard/${page}`)

  return (
    <>
      {/* Welcome hero */}
      <div className="welcome-hero">
        <div className="wh-content">
          <div className="wh-greeting">
            <Sparkles size={14} strokeWidth={2} style={{ color: 'var(--cyan)' }} />
            <span>Welcome back</span>
          </div>
          <h1 className="wh-title">Your Legacy Dashboard</h1>
          <p className="wh-sub">Monitor your inheritance plans, manage beneficiaries, and keep your digital assets secure.</p>
        </div>
        <button className="btn-create" onClick={goCreate}>
          <Plus size={15} strokeWidth={2.5} /> Create Plan
        </button>
      </div>

      {/* KYC Banner */}
      {kycStatus !== 'VERIFIED' && <KYCBanner onComplete={goKYC} />}

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard icon={FileText} iconClass="ic-blue" value={String(planCount)} label="Total Plans" trend={planCount > 0 ? '+1' : undefined} />
        <StatCard icon={Users} iconClass="ic-purple" value={String(totalBeneficiaries)} label="Beneficiaries" />
        <StatCard icon={Wallet} iconClass="ic-green" value="Encrypted" label="Assets Locked" />
        <StatCard icon={Zap} iconClass="ic-cyan" value={String(planCount)} label="Active Plans" />
      </div>

      {/* Check-in */}
      {hasPlans && firstPlanId !== undefined && <CheckInAlert daysLeft={daysLeft} planId={firstPlanId} />}

      {/* Bento grid */}
      <div className="bento-grid">
        <RecentPlans hasPlans={hasPlans} onCreatePlan={goCreate} />
        <QuickActions onCreatePlan={goCreate} onNavigate={goPage} planCount={planCount} kycStatus={kycStatus} />
      </div>

      <FHEBadge />
    </>
  )
}
