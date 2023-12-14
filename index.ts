//Bit length of the Key
export const NONCE_2D_KEY_LENGTH = 192

//Bit length of the Sequence
export const NONCE_2D_SEQ_LENGTH = 64

//Radix for hex
const HEX_RADIS = 16

/**
 * The structure of the Nonce2D, [key, seq] == [192|64] == 256 bits
 * @param key The key as a hex string
 * @param seq The sequence as a hex string
 */
export type Nonce2D = {
  key: string
  seq: string
}

/**
 * Converts a 256 bit 2d nonce hex string to a Nonce2D. Separating the key and sequence
 * @param hexNonce2D the 256 bit 2d nonce hex string
 * @returns 
 */
export function getNonce2D(hexNonce2D: string): Nonce2D {
  const originalNumber: bigint = BigInt(hexNonce2D)
  return { key: getKeyHex(originalNumber), seq: getSequenceHex(originalNumber) }
}

/**
 * Takes the 256 bit 2d nonce, and increments its sequence by 1.
 * @param hexNonce2D the 256 bit 2d nonce hex string
 */
export function getNextNonce2D(hexNonce2D: string): Nonce2D {
  // todo 
  return {key : '', seq : ''}
}

/**
 * Gets the 192 bit key from a 256 bit Nonce2D
 * @param nonce2D The Nonce2D to convert
 * @returns the 192 bit key as a hex string
 */
function getKeyHex(hexNonce2D: bigint): string {
  return toHex(getKeyNumber(hexNonce2D))
}

/**
 * Gets the 192 bit key from a 256 bit Nonce2D
 * @param hexNonce2D  The Nonce2D to convert
 * @returns the 192 bit key
 */
function getKeyNumber(hexNonce2D: bigint): bigint {
  return hexNonce2D >> BigInt(NONCE_2D_SEQ_LENGTH)
}

/**
 * Gets the 64 bit sequence from a 256 bit Nonce2D
 * @param nonce2D The Nonce2D to convert
 * @returns tge 64 bit sequence as a hex string
 */
function getSequenceHex(hexNonce2D: bigint): string {
  return toHex(getSequenceNumber(hexNonce2D))
}

/**
 * Gets the 64 bit sequence from a 256 bit Nonce2D
 * @param nonce2D The Nonce2D to convert
 * @returns tge 64 bit sequence 
 */
function getSequenceNumber(hexNonce2D: bigint): bigint {
  return mask256BitNumber(hexNonce2D, NONCE_2D_SEQ_LENGTH)
}

/**
 * Converts a bigint to a hex string with the '0x' prefix
 * @param input The number to convert to hex
 * @returns the hex string with the '0x' prefix
 */
function toHex(input: bigint): string {
  return '0x' + input.toString(HEX_RADIS)
}

/**
 * Creates a mask for the last maskLength bits and applies it to the input
 * @param input the number to mask
 * @param maskLength the number of bits to retain
 * @returns the masked number
 */
function mask256BitNumber(input: bigint, maskLength: number): bigint {
  const mask = (BigInt(1) << BigInt(maskLength)) - BigInt(1) // Create a bitmask for the last maskLength bits
  return input & mask // Apply the bitmask to retain the last maskLength bits
}