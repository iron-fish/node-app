const bufio = require('bufio')

const a = {
  name: 'Primary Account',
  publicAddress:
    'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
  incomingViewKey:
    'K1lyvG5Oa8VIrq9DRF9zVwOq7wvET_rhw1bmJIa3U7cWkCzCHCii1XvHAKVyi5sh',
  outgoingViewKey:
    'xTbDAiLTrg7hcQg2B5YKFIwJ-u5_IWGs0gudoUInCv30oQSKBmL3ne9hQnn2_6fY',
  spendingKey:
    'JPq_yX-p2PdFev7gGdlCLF9GQw25JHWIb0rNvq-Dnlomj49GNTbOgyn79fHFIQrt',
}
const b = [
  {
    id: '8ae2825f-1203-4c89-8cc0-a7413972c1b7',
    name: 'my new account',
    spendingKey:
      'b8fa0b755ad7c933e793fa83790bb77a29f20b32245fc25c6293ff76f40731b9',
    incomingViewKey:
      '70d47b9044e9453149453ee922a806e2b37fcf212b4ac45e929f3af85c6e3a01',
    outgoingViewKey:
      '86b8733fe338a3b0723f75abc67c0a26f788d1981381ad3239dd9af78be16ca3',
    publicAddress:
      '876a8ff59edfd4ddf3dbd5123c76933dc653ee20c873aba59da7f54d7a8f7c65d46b646556c8ddddc66d23',
  },
  {
    id: 'd4692678-4d9e-4455-9642-39adf85ebbe6',
    name: 'default',
    spendingKey:
      '007cf0ca7e91270933e9d486439765e4d2f5e37e6626dab297b747124f5eaf4e',
    incomingViewKey:
      '36293df85dbe3cd25cef1b3452c160d000307cd203308d80ed429589ef346604',
    outgoingViewKey:
      'b80ee821b1677a46b83a3ab827b51aced5da1a762082a5f7cf61e96d0fca3f34',
    publicAddress:
      '1d8213e9b3291b2dc01c9ae621b1a56f8bf62c6adc3f365a40e5c575062ce158803b0571b034c59fd78682',
  },
  {
    id: 'c596b679-bfbc-43f4-b069-c4e64dd34d35',
    name: 'Zarm',
    spendingKey:
      '7b02ee8a0489835dd20f34e8aa147bed53e27da29c4e5cd088a019812dfe35f8',
    incomingViewKey:
      'b903dcc4286e56dc39df80662659cc017d5ced1c675f5fd317070c7371916407',
    outgoingViewKey:
      '6b53efec62111b12136cca9a4e45d67dd901a73c4d99e79b71159aea5c9fcaea',
    publicAddress:
      'f9a4ddff4618c66e7821188dd6251c9f456a88db7253290a2f38e78acf644f0b6abd82008bdc3452a26a5a',
  },
  {
    id: '8ae2825f-1203-4c89-8cc0-a7413972c1b7',
    name: 'my new account',
    spendingKey:
      'b8fa0b755ad7c933e793fa83790bb77a29f20b32245fc25c6293ff76f40731b9',
    incomingViewKey:
      '70d47b9044e9453149453ee922a806e2b37fcf212b4ac45e929f3af85c6e3a01',
    outgoingViewKey:
      '86b8733fe338a3b0723f75abc67c0a26f788d1981381ad3239dd9af78be16ca3',
    publicAddress:
      '876a8ff59edfd4ddf3dbd5123c76933dc653ee20c873aba59da7f54d7a8f7c65d46b646556c8ddddc66d23',
  },
]
const buf = Buffer.from(a.publicAddress, 'hex')

buf.length

console.log(buf.byteLength)
console.log(buf.length)

// console.log(
//   bufio
//     .read(Buffer.from(a.publicAddress, 'hex'), true)
//     .readBytes(43)
//     .toString('hex')
// )
