import { Nonce2D } from '../src/index'

enum ChainID {
  EthereumMainnet = 1,
  EthereumGoerli = 5,
  Optimism = 10,
  OptimismGoerli = 420,
}

// Test chain id
const testChain = ChainID.EthereumGoerli
// 256 bit nonce = 32 bytes
const testsHexNonce =
  '0x5e7f1725e7734ce288f8367e1bb143e90bb3f05120000000000000001'
// 192 bit key = 4 bytes for chainID = 5(00000005), 20 bytes for address(e7f1725E7734CE288F8367e1Bb143E90bb3F0512)
const testsKey = '0x5e7f1725e7734ce288f8367e1bb143e90bb3f0512'
// 64 bit sequence = 8 bytes
const testsSeq = '0x1'
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
      expect(Number(n.chain)).toBe(testChain)
      expect(n.address).toBe(testsAddress)
    })
  })

  describe('fromHexKey tests', () => {
    it('should create a Nonce2D object from a valid key', () => {
      const n = Nonce2D.fromHexKey(testsKey, 1)
      expect(Number(n.chain)).toBe(testChain)
      expect(n.address).toBe(testsAddress)
      expect(n.seq).toBe(testsSeq)
    })

    it('should create a Nonce2D object from a valid key with optional seq', () => {
      const seq: number = 13
      const n = Nonce2D.fromHexKey(testsKey, seq)
      expect(Number(n.chain)).toBe(testChain)
      expect(n.address).toBe(testsAddress)
      expect(n.seq).toBe('0x' + seq.toString(16))
    })
  })

  describe('getHexKeyForDestination tests', () => {
    it('should create a key from an address and chain', () => {
      const hexKey = Nonce2D.getHexKeyForDestination(
        testsAddress,
        ChainID.EthereumGoerli,
      )
      expect(hexKey).toBe(testsKey)

      const nonce2D = Nonce2D.fromHexKey(hexKey)
      expect(Number(nonce2D.chain)).toBe(ChainID.EthereumGoerli)
      expect(nonce2D.address).toBe(testsAddress)
    })
  })

  describe('increment tests', () => {
    it('should increment the sequence number', () => {
      const n = Nonce2D.fromHexNonce(testsHexNonce)
      const seq = Number(n.seq)
      const key = Number(n.key)
      const chain = Number(n.chain)
      const address = Number(n.address)
      n.increment()
      expect(Number(n.seq)).toBe(seq + 1)
      //nothing else should change
      expect(Number(n.key)).toBe(key)
      expect(Number(n.chain)).toBe(chain)
      expect(Number(n.address)).toBe(address)
    })
  })

  describe('toHexNonce tests', () => {
    it('should return the hex nonce', () => {
      const n = Nonce2D.fromHexNonce(testsHexNonce)
      expect(n.toHexNonce()).toBe(testsHexNonce)
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
