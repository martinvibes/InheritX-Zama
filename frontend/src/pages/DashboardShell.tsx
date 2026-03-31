import { Outlet, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Topbar from '../components/Layout/Topbar'
import Sidebar from '../components/Layout/Sidebar'
import { useKYC } from '../hooks/useKYC'
import '../styles/dashboard.css'

export default function DashboardShell() {
  const { address } = useAccount()
  const kyc = useKYC(address)
  const location = useLocation()

  // Get first segment after /dashboard/ — e.g. /dashboard/plans/0 → "plans"
  const segments = location.pathname.replace('/dashboard', '').split('/').filter(Boolean)
  const activePage = segments[0] || 'overview'

  return (
    <div className="dashboard-root">
      <Topbar />
      <div className="body">
        <Sidebar active={activePage} onNavigate={() => {}} kycStatus={kyc.status} />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
