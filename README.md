<p align="center">
  <img src="frontend/public/logo.svg" alt="InheritX Logo" width="120" />
</p>

<h1 align="center">InheritX</h1>

<p align="center">
  <strong>The first FHE-encrypted on-chain inheritance protocol.</strong><br/>
  Your heirs are invisible until you're gone.
</p>

<p align="center">
  <a href="#features">Features</a> · <a href="#how-it-works">How It Works</a> · <a href="#the-problem">The Problem</a> · <a href="#tech-stack">Tech Stack</a> · <a href="#getting-started">Getting Started</a> · <a href="#demo">Demo</a>
</p>

<p align="center">
  <img src="frontend/public/doc_img.png" alt="InheritX Preview" width="100%" style="border-radius: 12px;" />
</p>

---

## The Problem

An estimated **$140 billion** in cryptocurrency is permanently lost because owners died without passing on their private keys. Their families had no way to access the funds.

The obvious solution — write a smart contract that transfers your crypto to your heirs — has a fatal flaw on transparent blockchains:

> **Anyone can read who your heir is.**

On regular Ethereum, if you store your heir's wallet address in a contract, block explorers like Etherscan can see it. Your heir becomes a target *before you even die*. Attackers can monitor that address, phish your family, or front-run the claim transaction.

Existing solutions all compromise:

| Approach | Problem |
|----------|---------|
| **Commit-reveal** | The "reveal" transaction can be front-run by MEV bots |
| **Multisig wallets** | Requires trusting multiple key holders |
| **Centralized platforms** | The company can go offline, get hacked, or freeze your account |
| **Paper wills** | No on-chain enforcement — relies on lawyers and courts |

**InheritX solves all of this with one technology: Fully Homomorphic Encryption.**

---

## What is InheritX?

InheritX is a decentralized inheritance protocol that lets you create a cryptographic plan for your digital assets. You lock your crypto, designate your heirs, and set a dead-man's switch — if you stop proving you're alive, your assets automatically go to the people you chose.

The difference? **Nobody can see who your heirs are.** Not block explorers. Not validators. Not even the smart contract itself. The heir addresses are encrypted using Zama's fhEVM (Fully Homomorphic Encryption Virtual Machine) and stored as unreadable ciphertext on-chain.

Only when the plan triggers — and only through the fhEVM threshold decryption network — are the heir addresses decrypted and the assets released.

---

## Features

**Privacy by Default**
Beneficiary wallet addresses are stored as `eaddress` — FHE-encrypted ciphertext. Nobody can read them on-chain until the plan triggers. This is mathematically guaranteed, not just hidden behind access controls.

**Dead-Man's Switch**
Set an inactivity window (30 days to 5 years). If you don't check in within that window, anyone can trigger your plan. Your heirs can then claim their share.

**Multi-Heir Splits**
Distribute assets across multiple beneficiaries with encrypted percentage splits (`euint32`). Nobody sees who gets what percentage until the moment of distribution.

**Encrypted Vault**
Attach private messages, seed phrases, passwords, or final letters to your plan. Stored as encrypted `euint128` chunks on-chain. Only your designated heir can decrypt their personal message after claiming.

**Two Plan Types**
- **Inheritance Plan** — Triggers on owner inactivity (dead-man's switch)
- **Future Goal Plan** — Triggers on a specific date (e.g., "My daughter gets 1 ETH on her 18th birthday")

**KYC-Gated**
Plan creation requires identity verification. This prevents spam and adds a layer of trust without compromising on-chain privacy.

**Fully Non-Custodial**
Your assets stay in the smart contract — not on a server, not in a company's wallet. Nobody can access, freeze, or redirect your funds. The contract executes automatically.

---

## How It Works

```
1. Connect        →  Link your Web3 wallet (MetaMask, WalletConnect, etc.)
2. Verify          →  Complete a quick KYC check
3. Create a Plan   →  Add heirs, set your inactivity trigger, lock ETH
4. Stay Alive      →  Check in periodically to reset your timer
5. If you stop...  →  Plan triggers → fhEVM decrypts → Heirs claim
```

### What happens under the hood

When you add a beneficiary:
```
Your heir's address: 0x4a2B...c8E9
         ↓ encrypted via fhEVM
Stored on-chain as:  0x8f3a...████  (unreadable ciphertext)
```

When the plan triggers:
```
Inactivity window expires
         ↓
fhEVM KMS threshold network decrypts the heir address
         ↓
Heir connects wallet → address verified → assets transferred
```

There is no "reveal transaction" to front-run. The decryption happens inside the threshold network, not in a public transaction. This is what makes FHE fundamentally different from commit-reveal schemes.

---

## Why FHE?

| | Without FHE | With InheritX |
|---|---|---|
| **Heir address** | Visible on-chain | Encrypted as `eaddress` |
| **Asset amount** | Public on block explorer | Encrypted as `euint128` |
| **Claim process** | Front-runnable via MEV | Threshold decryption — no mempool exposure |
| **Trust model** | Requires trusted third party | Trustless — math only |
| **Heir safety** | Heir is a public target | Heir is completely invisible |

**FHE (Fully Homomorphic Encryption)** allows computation on encrypted data without ever decrypting it. Zama's fhEVM brings this to the EVM — meaning the InheritX contract can verify conditions and execute logic on encrypted values without ever seeing the plaintext.

This is not theoretical. This is deployed. This is working.

---

## Tech Stack

### Smart Contracts
- **Solidity 0.8.24** with Zama fhEVM
- **FHE Library**: `@fhevm/solidity` ^0.11.1
- **FHE types**: `eaddress`, `euint128`, `euint64`, `euint32`, `ebool`
- **Framework**: Hardhat + `@fhevm/hardhat-plugin`
- **Network**: Ethereum Sepolia

### Frontend
- **Next.js** + React 19 + TypeScript
- **Web3**: wagmi v2, viem, RainbowKit
- **FHE Client**: `@zama-fhe/relayer-sdk`
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## Project Structure

```
inheritx/
├── contract/                 # Smart contracts (Hardhat)
│   ├── contracts/            # Solidity source
│   ├── test/                 # Test suite
│   └── scripts/              # Deploy scripts
├── frontend/                 # Next.js application
│   └── src/
│       ├── pages/            # Landing, Dashboard, etc.
│       ├── components/       # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Utilities & constants
│       └── styles/           # Global CSS
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- A Web3 wallet (MetaMask recommended)

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:3000`.

### Deploy Contracts

```bash
cd contract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

### Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_deployer_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
```

---

## Demo

### Flow

1. **Landing page** — See what InheritX does and why it matters
2. **Connect wallet** — One click, no sign-up
3. **Complete KYC** — Mock auto-verify in testnet (30 seconds)
4. **Create a plan** — Choose heirs, set inactivity window, lock ETH
5. **Watch encryption** — Heir address scrambles before your eyes
6. **Check in** — Hit "I'm Alive" to reset the timer
7. **Trigger** — Wait for the timer to expire, then trigger the plan
8. **Claim** — Switch to heir wallet, claim the inheritance

### What to look for on-chain

After creating a plan, check the contract on Etherscan Sepolia. The heir address field shows `0x8f3a...` — encrypted ciphertext. Not the real address. This is the core value proposition of InheritX.

---

## Roadmap

| Phase | What ships |
|-------|-----------|
| **Phase 1** | Landing page, Dashboard, Core contract (`createPlan`, `checkIn`, `trigger`, `claim`), Mock KYC, Inheritance plan type |
| **Phase 2** | Future Goal plans (time-lock), Real KYC, Multi-heir splits with encrypted percentages |
| **Phase 3** | Encrypted vault — seed phrases, notes, private letters |
| **Phase 4** | EncryptedERC20 support — inherit ERC20 tokens with encrypted balances |
| **Phase 5** | Mobile responsive, Chainlink oracle triggers, ENS resolution |
| **Phase 6** | Mainnet deployment, Email reminders, Legal disclaimer |

---

## Security Considerations

- All beneficiary data is encrypted client-side via `@zama-fhe/relayer-sdk` before reaching the contract
- `FHE.allowThis()` is called after every FHE operation to maintain proper access control
- Encrypted inputs are validated on-chain via `FHE.fromExternal(input, proof)` with cryptographic proofs
- Proof of life timestamps are plaintext by design — the trigger logic needs to run on-chain without decryption
- FHE operations use a minimum `gasLimit` of 5,000,000
- The contract is non-custodial — no admin can withdraw locked funds
- Threshold decryption requires consensus from the fhEVM KMS network — no single party can decrypt

---

## Built With

- [Zama fhEVM](https://www.zama.org/) — Fully Homomorphic Encryption for smart contracts
- [Ethereum Sepolia](https://sepolia.etherscan.io/) — Testnet deployment network
- [Next.js](https://nextjs.org/) + [React](https://react.dev/) — Frontend framework
- [wagmi](https://wagmi.sh/) + [RainbowKit](https://www.rainbowkit.com/) — Wallet connection
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide](https://lucide.dev/) — Icon system

---

<p align="center">
  <strong>InheritX</strong> — Secure Your Digital Legacy<br/>
  <sub>Built on Zama fhEVM · Deployed on Ethereum Sepolia</sub>
</p>
