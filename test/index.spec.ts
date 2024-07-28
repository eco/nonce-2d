import { Nonce2D } from '../src/index'

enum ChainID {
  EthereumMainnet = 1,
  EthereumGoerli = 5,
  Optimism = 10,
  OptimismGoerli = 420,
}

// Test meta data
const testMeta = '0x' + ChainID.EthereumGoerli.toString(16)
// 256 bit nonce = 32 bytes
const testsHexNonce =
  '0x5e7f1725e7734ce288f8367e1bb143e90bb3f05120000000000000001'
// 192 bit key = 4 bytes for meta = 5(00000005), 20 bytes for address(e7f1725E7734CE288F8367e1Bb143E90bb3F0512)
const testsKey = '0x5e7f1725e7734ce288f8367e1bb143e90bb3f0512'
// 64 bit sequence = 8 bytes
const testsSeq = '0x0000000000000001'
// 160 bit address
const testsAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

describe('Nonce2D tests', () => {
  describe('fromHexNonce tests', () => {
    it('should throw an error when provided with an invalid hex nonce', () => {
      const hexNonce = '0xinvalid'
      expect(() => {
        Nonce2D.fromHexNonce(hexNonce)
      }).toThrow()
    })

    it('should create a Nonce2D object from a valid hex nonce', () => {
      const n = Nonce2D.fromHexNonce(testsHexNonce)
      expect(n.key).toBe(testsKey)
      expect(n.seq).toBe(testsSeq)
      expect(n.meta).toBe(testMeta)
      expect(n.address).toBe(testsAddress)
    })
  })

  describe('fromHexKey tests', () => {
    it('should create a Nonce2D object from a valid key', () => {
      const n = Nonce2D.fromHex(testsKey, '0x1')
      expect(n.meta).toBe(testMeta)
      expect(n.address).toBe(testsAddress)
      expect(n.seq).toBe(testsSeq)
    })

    it('should create a Nonce2D object from a valid key with optional seq', () => {
      const seq: string = '0x000000000000000d'
      const n = Nonce2D.fromHex(testsKey, seq)
      expect(n.meta).toBe(testMeta)
      expect(n.address).toBe(testsAddress)
      expect(n.seq).toBe(seq)
    })
  })

  describe('getHexKeyForDestination tests', () => {
    it('should create a key from an address and chain', () => {
      const hexKey = Nonce2D.getHexKeyForDestination(testsAddress, testMeta)
      expect(hexKey).toBe(testsKey)

      const nonce2D = Nonce2D.fromHex(hexKey)
      expect(nonce2D.meta).toBe(testMeta)
      expect(nonce2D.address).toBe(testsAddress)
    })
  })

  describe('increment tests', () => {
    it('should increment the sequence number', () => {
      const n = Nonce2D.fromHexNonce(testsHexNonce)
      const seq = Number(n.seq)
      const key = Number(n.key)
      const meta = Number(n.meta)
      const address = Number(n.address)
      n.increment()
      expect(Number(n.seq)).toBe(seq + 1)
      //nothing else should change
      expect(Number(n.key)).toBe(key)
      expect(Number(n.meta)).toBe(meta)
      expect(Number(n.address)).toBe(address)
    })
  })

  describe('toHexNonce tests', () => {
    it('should return the hex nonce', () => {
      const n = Nonce2D.fromHexNonce(testsHexNonce)
      expect(n.toHexNonce()).toBe(testsHexNonce)
    })

    it('should not cut off leading 0 in address', () => {
      // const nonceHash = '50C77C13C2A7736140B2B9FA9F4E16B4BECCD665A0000000000000007'
      const destinationAddress =
        '0x0C77C13c2a7736140b2b9Fa9F4e16B4bECCd665A'.toLocaleLowerCase()
      const stable = '5'
      const key = Nonce2D.getHexKeyForDestination(destinationAddress, stable)
      const nonceHash = ((BigInt(key) << BigInt(64)) + BigInt(7)).toString(16)
      const n = Nonce2D.fromHexNonce(nonceHash)
      expect(n.address).toBe(destinationAddress)
    })

    it('should support lack of 0x infrom of string', () => {
      const missing = testsHexNonce.substring(2)
      const n = Nonce2D.fromHexNonce(missing)
      expect(n.toHexNonce()).toBe(testsHexNonce)
    })

    it('should be able to increment and reconstitute a new hex nonce', () => {
      // construct new nonce by incrementing the sequence number
      const nextNonce =
        testsHexNonce.substring(0, testsHexNonce.length - 1) + '2'

      const n = Nonce2D.fromHexNonce(testsHexNonce)
      n.increment()
      // check that the new nonce is correct
      expect(n.toHexNonce()).toBe(nextNonce)
    })
  })
})
