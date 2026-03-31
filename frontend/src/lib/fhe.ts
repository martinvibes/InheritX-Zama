/**
 * FHE encryption helpers for Zama fhEVM
 * Handles client-side encryption of values before sending to contract
 */

// Contract addresses on Sepolia (from ZamaConfig.sol)
const COPROCESSOR_ADDRESS = '0x92C920834Ec8941d2C77D188936E1f7A6f49c127'

/**
 * For demo/hackathon: generate mock encrypted inputs.
 * In production, use @zama-fhe/relayer-sdk for real TFHE encryption.
 *
 * The contract's FHE.fromExternal() validates these with the coprocessor.
 * On a live fhEVM network, we need real encrypted handles + proofs.
 * For demo purposes, we pass raw values that the coprocessor can process.
 */
export function encodeAddressForFHE(address: string): { handle: `0x${string}`; proof: `0x${string}` } {
  // Pad address to bytes32
  const handle = ('0x' + address.slice(2).padStart(64, '0')) as `0x${string}`
  const proof = '0x' as `0x${string}`
  return { handle, proof }
}

export function encodeUint32ForFHE(value: number): { handle: `0x${string}`; proof: `0x${string}` } {
  const handle = ('0x' + value.toString(16).padStart(64, '0')) as `0x${string}`
  const proof = '0x' as `0x${string}`
  return { handle, proof }
}

export function encodeUint128ForFHE(value: bigint): { handle: `0x${string}`; proof: `0x${string}` } {
  const handle = ('0x' + value.toString(16).padStart(64, '0')) as `0x${string}`
  const proof = '0x' as `0x${string}`
  return { handle, proof }
}
