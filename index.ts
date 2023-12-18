// Bit length of the nonce
export const NONCE_2D_BIT_LENGTH = 256

// Bit length of the Key
export const NONCE_2D_KEY_BIT_LENGTH = 192 // 24 *8

// Bit length of the Sequence
export const NONCE_2D_SEQ_BIT_LENGTH = 64 // 8*8

// Bit length of the Address
export const NONCE_2D_KEY_ADDRESS_BIT_LENGTH = 160 // 20*8

// Bit length of the Chain
export const NONCE_2D_KEY_CHAIN_BIT_LENGTH = 32 // 4*8

// Radix for hex
const HEX_RADIS = 16

export enum ChainID {
  EthereumMainnet = 1,
  EthereumGoerli = 5,
  Optimism = 10,
  OptimismGoerli = 420,
}
/**
 * The structure of the Nonce2D, [key, seq] == [192|64] == 256 bits
 * @param key The key as a hex string
 * @param seq The sequence as a hex string
 */
export class Nonce2D {
  // the key is the first 192 bits of the 256 bit Nonce2D, it includes the address and chain id
  private _key: string
  // the sequence number is the last 64 bits of the 256 bit Nonce2D
  private _seq: string
  // the chain is the first 32 bits of the key
  private _chain: string
  // the address is the 160 bits of the key, following the _chain bits
  private _address: string

  private constructor(hexNonce2D: string) {
    const { key, chain, address } = this.getKeyHex(BigInt(hexNonce2D))
    this._key = key
    this._chain = chain
    this._address = address

    this._seq = this.getSequenceHex(BigInt(hexNonce2D))
  }

  /**
   * Increments the sequence number of the 2d nonce and returns it
   * @returns The Nonce2D
   */
  public increment(): Nonce2D {
    this._seq = this.toHex(BigInt(this.seq) + BigInt(1))
    return this
  }

  /**
   * Generate the 2d nonce hex string of the current state of the Nonce2D
   * @returns The 256 bit Nonce2D as a hex string
   */
  public toHexNonce(): string {
    //shift the key left by NONCE_2D_SEQ_BIT_LENGTH bits
    let sum = BigInt(this._key) << BigInt(NONCE_2D_SEQ_BIT_LENGTH)
    //add the NONCE_2D_SEQ_BIT_LENGTH sequence number bits
    sum += BigInt(this._seq)
    return this.toHex(sum)
  }

  /**
   * Takes a onchain 2d nonce hex string and converts it to a Nonce2D object
   *
   * @param hexNonce2D The 256 bit Nonce2D as a hex string
   * @returns
   */
  static fromHexNonce(hexNonce2D: string): Nonce2D {
    return new Nonce2D(hexNonce2D)
  }

  /**
   * Generates a sequence number for a given hex key and sequence number
   *
   * @param hexKey the 192 bit hex key containing the chain and address
   * @param seq the 64 bit sequence number or 1 if not provided
   * @returns
   */
  static fromHexKey(hexKey: string, seq: number = 1): Nonce2D {
    const hexNonce = hexKey + hexPad(seq.toString(HEX_RADIS), 16)
    return new Nonce2D(hexNonce)
  }

  /**
   * Function generates a 192 bit hex key for the 2d nonce on the entrypoint contract. Can be used
   * to look up the full nonce on-chain for the wallet.
   *
   * @param ethAddress the destination address in the key(not the address of the 4337 wallet)
   * @param chain the destination chain in the key
   * @returns the 192 bit hex key for the destination address-chain pair
   */
  static getHexKeyForDestination(ethAddress: string, chain: ChainID): string {
    ethAddress = stripOx(ethAddress)
    return ('0x' + chain.toString(HEX_RADIS) + ethAddress).toLocaleLowerCase()
  }

  /**
   * Creates a mask for the last maskLength bits and applies it to the input
   * @returns The masked number
   */
  static mask256BitNumber(input: bigint, maskLength: number): bigint {
    const mask = (BigInt(1) << BigInt(maskLength)) - BigInt(1) // Create a bitmask for the last maskLength bits
    return input & mask // Apply the bitmask to retain the last maskLength bits
  }

  // Returns the (up to)192 bit key as a hex string
  get key(): string {
    return this._key
  }

  // Returns the (up to) 32 bit chain as a hex string
  get chain(): string {
    return this._chain
  }

  // Returns the 160 bit address as a hex string
  get address(): string {
    return this._address
  }

  // Returns the (up to) 64 bit sequence as a hex string
  get seq(): string {
    return this._seq
  }

  /**
   * Gets the 192 bit key from a 256 bit Nonce2D
   * @returns The 192 bit key as a hex string
   */
  private getKeyHex(hexNonce2D: bigint): {
    key: string
    chain: string
    address: string
  } {
    const key = this.getKeyNumber(hexNonce2D)
    const chain = key >> BigInt(NONCE_2D_KEY_ADDRESS_BIT_LENGTH)
    const address = Nonce2D.mask256BitNumber(
      key,
      NONCE_2D_KEY_ADDRESS_BIT_LENGTH,
    )
    return {
      key: this.toHex(key),
      chain: this.toHex(chain),
      address: this.toHex(address),
    }
  }

  /**
   * Gets the 192 bit key from a 256 bit Nonce2D
   * @returns The 192 bit key
   */
  private getKeyNumber(hexNonce2D: bigint): bigint {
    return hexNonce2D >> BigInt(NONCE_2D_SEQ_BIT_LENGTH)
  }

  /**
   * Gets the 64 bit sequence from a 256 bit Nonce2D
   * @returns The 64 bit sequence as a hex string
   */
  private getSequenceHex(hexNonce2D: bigint): string {
    return this.toHex(this.getSequenceNumber(hexNonce2D))
  }

  /**
   * Gets the 64 bit sequence from a 256 bit Nonce2D
   * @returns The 64 bit sequence
   */
  private getSequenceNumber(hexNonce2D: bigint): bigint {
    return Nonce2D.mask256BitNumber(hexNonce2D, NONCE_2D_SEQ_BIT_LENGTH)
  }

  /**
   * Converts a bigint to a hex string with the '0x' prefix
   * @returns The hex string with the '0x' prefix
   */
  private toHex(input: bigint): string {
    return '0x' + input.toString(HEX_RADIS)
  }
}

/**
 * helper function to strip the 0x prefix from a hex string
 * @param hex the hex number to strip
 * @returns
 */
function stripOx(hex: string): string {
  if (hex.startsWith('0x')) {
    return hex.slice(2)
  }
  return hex
}

/**
 * Helper function to padd a string with leading 0s
 * @param hexInput string to pad
 * @param padHex number of padding characters
 * @returns
 */
function hexPad(hexInput: string, padHex: number): string {
  return stripOx(hexInput).padStart(padHex, '0')
}
