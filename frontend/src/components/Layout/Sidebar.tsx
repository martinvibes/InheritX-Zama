import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Activity,
  Lock,
  Settings,
  Gift,
  LogOut,
  CircleDot,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../shared/Logo'

interface NavItem { icon: LucideIcon; label: string; id: string; badge?: string }

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: FileText, label: 'My Plans', id: 'plans' },
  { icon: Activity, label: 'Activity', id: 'activity' },
]

const managementNav: NavItem[] = [
  { icon: ShieldCheck, label: 'KYC Verification', id: 'kyc' },
  { icon: Lock, label: 'Security', id: 'security' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

interface SidebarProps {
  active: string
  onNavigate: (id: string) => void
  kycStatus: 'NOT_SUBMITTED' | 'SUBMITTED' | 'VERIFIED'
}

export default function Sidebar({ active, onNavigate, kycStatus }: SidebarProps) {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      {/* Logo area */}
      <div className="sb-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <LogoMark size={24} />
        <div className="sb-brand-info">
          <span className="sb-brand-name">InheritX</span>
          <span className="sb-brand-ver">v1.0 · Testnet</span>
        </div>
      </div>

      <div className="sb-nav-scroll">
        {/* Main nav */}
        <NavGroup label="Navigate" items={mainNav} active={active} onNavigate={onNavigate} />

        {/* Claim — standalone highlight */}
        <div className="sb-section">
          <div className="sb-label">Beneficiary</div>
          <div
            className={`sb-item sb-item-claim${active === 'claim' ? ' active' : ''}`}
            onClick={() => onNavigate('claim')}
          >
            <div className="sb-item-inner">
              <Gift size={15} strokeWidth={1.8} />
              <span>Claim Inheritance</span>
            </div>
            <div className="sb-item-arrow">→</div>
          </div>
        </div>

        {/* Management */}
        <NavGroup label="Management" items={managementNav} active={active} onNavigate={onNavigate} />
      </div>

      {/* Bottom */}
      <div className="sb-footer">
        {/* FHE status */}
        <div className="sb-status-card">
          <div className="sb-status-row">
            <CircleDot size={10} strokeWidth={2.5} style={{ color: 'var(--green)' }} />
            <span className="sb-status-label">fhEVM Network</span>
            <span className="sb-status-val sb-status-live">Live</span>
          </div>
          <div className="sb-status-row">
            <ShieldCheck size={10} strokeWidth={2.5} style={{ color: kycStatus === 'VERIFIED' ? 'var(--green)' : 'var(--gold)' }} />
            <span className="sb-status-label">KYC Status</span>
            <span className={`sb-status-val ${kycStatus === 'VERIFIED' ? 'sb-status-live' : 'sb-status-warn'}`}>
              {kycStatus === 'NOT_SUBMITTED' ? 'Required' : kycStatus === 'SUBMITTED' ? 'Pending' : 'Verified'}
            </span>
          </div>
        </div>

        {/* Disconnect */}
        <div className="sb-item sb-disconnect" onClick={() => {}}>
          <div className="sb-item-inner">
            <LogOut size={14} strokeWidth={1.8} />
            <span>Disconnect</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavGroup({ label, items, active, onNavigate }: { label: string; items: NavItem[]; active: string; onNavigate: (id: string) => void }) {
  return (
    <div className="sb-section">
      <div className="sb-label">{label}</div>
      <div className="sb-group">
        {items.map((item) => (
          <div
            key={item.id}
            className={`sb-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <div className="sb-item-inner">
              <item.icon size={15} strokeWidth={1.8} />
              <span>{item.label}</span>
            </div>
            {item.badge && <span className="sb-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
