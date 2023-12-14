import { add } from '../index' // Assuming your index.ts file is in the root directory

describe('Addition function', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('adds negative numbers correctly', () => {
    expect(add(-2, 3)).toBe(1)
  })

  // Add more test cases as needed
})
//0x1234567890123456789012345678901234567890123456789012345678901234
// 0xbbe19a04f57b9d64f4bccbe7b5142b9f561b079666940f344ff1c5c7dea724c8