# Nonce 2D Service

This utility library exists to create and work with 2D nonces as discribed in the [Eth-Infinitism](https://docs.google.com/document/d/1MywdH_TCkyEjD3QusLZ_kUZg4ZEI00qp97mBze9JI4k/edit#heading=h.gyhqxhuyd59n) document. The implementation can be found in their [EntryPoint](https://github.com/eth-infinitism/account-abstraction/pull/247/files).

This lib has been checked against what is currently deployed by Eth-Infinitism which is [Release v0.6](https://github.com/eth-infinitism/account-abstraction/releases/tag/v0.6.0) on ethereum at [0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789](https://optimistic.etherscan.io/address/0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789#code)

To use the library, install it.

The 2D nonce is devided into 2 parts. It is 256 bits long, with 192 bits reserved for a key and 64 reserved for numerical sequence that increments for each tx.

`nonce-2d = [192 key | 64 seq]`

The key part of the nonce is derived from the destination chain and address that the sender wants to send tokens too.

`key = [32 bit chain| 160 bit eth address]`

To generate the key for a given address and destination chain id:

`Nonce2D.getHexKeyForDestination('0xe7f1725e7734ce288f8367e1bb143e90bb3f0512', 5)`

To parse a 2d nonce that is already on chain:

`Nonce2D.fromHexNonce('0x5e7f1725e7734ce288f8367e1bb143e90bb3f05120000000000000001')`

Once you have the `Nonce2D` object, you can call it to increment its sequence nonce and use it for a tx:

```
  const nonce = Nonce2D.fromHexNonce('0x5e7f1725e7734ce288f8367e1bb143e90bb3f05120000000000000001')
  const txNonceHex = nonce.increment().toHexNonce()
```
