import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { HeartPulse, FileText, ShieldCheck, AlertTriangle, Clock, Hexagon } from 'lucide-react'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { INHERITX_ABI } from '../lib/contracts'

interface ActivityItem {
  icon: typeof FileText
  color: string
  bg: string
  label: string
  detail: string
  time: string
  blockNumber: bigint
}

export default function ActivityPage() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicClient || !address || !CONTRACT_ADDRESS) {
      setLoading(false)
      return
    }

    async function fetchEvents() {
      try {
        const currentBlock = await publicClient!.getBlockNumber()
        const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n

        const [planCreated, checkIns, kycSubmitted, kycVerified, planTriggered] = await Promise.all([
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: {
              type: 'event', name: 'PlanCreated',
              inputs: [
                { indexed: true, name: 'planId', type: 'uint256' },
                { indexed: true, name: 'owner', type: 'address' },
                { indexed: false, name: 'planType', type: 'uint8' },
                { indexed: false, name: 'name', type: 'string' },
              ],
            },
            args: { owner: address },
            fromBlock, toBlock: currentBlock,
          }),
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: {
              type: 'event', name: 'CheckIn',
              inputs: [
                { indexed: true, name: 'planId', type: 'uint256' },
                { indexed: true, name: 'owner', type: 'address' },
                { indexed: false, name: 'timestamp', type: 'uint256' },
              ],
            },
            args: { owner: address },
            fromBlock, toBlock: currentBlock,
          }),
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: {
              type: 'event', name: 'KYCSubmitted',
              inputs: [{ indexed: true, name: 'wallet', type: 'address' }],
            },
            args: { wallet: address },
            fromBlock, toBlock: currentBlock,
          }),
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: {
              type: 'event', name: 'KYCVerified',
              inputs: [{ indexed: true, name: 'wallet', type: 'address' }],
            },
            args: { wallet: address },
            fromBlock, toBlock: currentBlock,
          }),
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: {
              type: 'event', name: 'PlanTriggered',
              inputs: [
                { indexed: true, name: 'planId', type: 'uint256' },
                { indexed: false, name: 'timestamp', type: 'uint256' },
              ],
            },
            fromBlock, toBlock: currentBlock,
          }),
        ])

        const items: ActivityItem[] = []

        for (const log of planCreated) {
          const args = log.args as any
          const block = await publicClient!.getBlock({ blockNumber: log.blockNumber! })
          items.push({
            icon: FileText, color: 'var(--cyan)', bg: 'rgba(0,212,232,0.06)',
            label: 'Plan Created',
            detail: `${args.name || 'Plan'} — ETH amount encrypted on-chain`,
            time: timeAgo(Number(block.timestamp)),
            blockNumber: log.blockNumber!,
          })
        }

        for (const log of checkIns) {
          const block = await publicClient!.getBlock({ blockNumber: log.blockNumber! })
          items.push({
            icon: HeartPulse, color: 'var(--green)', bg: 'rgba(0,201,138,0.06)',
            label: 'Check-in',
            detail: `Proof of life confirmed — timer reset`,
            time: timeAgo(Number(block.timestamp)),
            blockNumber: log.blockNumber!,
          })
        }

        for (const log of kycSubmitted) {
          const block = await publicClient!.getBlock({ blockNumber: log.blockNumber! })
          items.push({
            icon: ShieldCheck, color: 'var(--gold)', bg: 'rgba(240,160,32,0.06)',
            label: 'KYC Submitted',
            detail: 'Identity verification submitted on-chain',
            time: timeAgo(Number(block.timestamp)),
            blockNumber: log.blockNumber!,
          })
        }

        for (const log of kycVerified) {
          const block = await publicClient!.getBlock({ blockNumber: log.blockNumber! })
          items.push({
            icon: ShieldCheck, color: 'var(--green)', bg: 'rgba(0,201,138,0.06)',
            label: 'KYC Verified',
            detail: 'Identity verification complete',
            time: timeAgo(Number(block.timestamp)),
            blockNumber: log.blockNumber!,
          })
        }

        for (const log of planTriggered) {
          const block = await publicClient!.getBlock({ blockNumber: log.blockNumber! })
          items.push({
            icon: AlertTriangle, color: 'var(--gold)', bg: 'rgba(240,160,32,0.06)',
            label: 'Plan Triggered',
            detail: `Plan #${(log.args as any).planId?.toString()} triggered — heirs can now claim`,
            time: timeAgo(Number(block.timestamp)),
            blockNumber: log.blockNumber!,
          })
        }

        // Sort by block number descending
        items.sort((a, b) => Number(b.blockNumber - a.blockNumber))
        setActivities(items)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [address, publicClient])

  return (
    <div className="page-container-wide">
      <style>{styles}</style>
      <div className="act-header">
        <h1 className="pg-title">Activity</h1>
        <p className="pg-sub">Your on-chain activity from the InheritX contract.</p>
      </div>

      {loading ? (
        <div className="act-loading">
          <Hexagon size={20} strokeWidth={1.5} className="spin" style={{ color: 'var(--cyan)' }} />
          <span>Loading on-chain events...</span>
        </div>
      ) : activities.length > 0 ? (
        <div className="act-list">
          {activities.map((item, i) => (
            <div className="act-row" key={i}>
              <div className="act-icon" style={{ background: item.bg, color: item.color }}>
                <item.icon size={15} strokeWidth={1.8} />
              </div>
              <div className="act-info">
                <div className="act-label">{item.label}</div>
                <div className="act-detail">{item.detail}</div>
              </div>
              <div className="act-time"><Clock size={10} strokeWidth={2} /> {item.time}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="act-empty">
          <Hexagon size={28} strokeWidth={1} style={{ color: 'var(--t3)', opacity: 0.3 }} />
          <p>No activity yet. Submit KYC or create a plan to see events here.</p>
        </div>
      )}
    </div>
  )
}

function timeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(timestamp * 1000).toLocaleDateString()
}

const styles = `
.page-container-wide { max-width: 800px; }
.act-header { margin-bottom: 20px; }
.pg-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 2px; }
.pg-sub { font-size: 13px; color: var(--t3); }
.act-list { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; }
.act-row { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.12s; }
.act-row:last-child { border-bottom: none; }
.act-row:hover { background: rgba(255,255,255,0.015); }
.act-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-info { flex: 1; }
.act-label { font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }
.act-detail { font-size: 12px; color: var(--t3); }
.act-time { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--t3); white-space: nowrap; font-family: 'JetBrains Mono', monospace; }
.act-loading { display: flex; align-items: center; gap: 10px; justify-content: center; padding: 40px; color: var(--t3); font-size: 13px; }
.act-empty { text-align: center; padding: 48px 20px; color: var(--t3); font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`
