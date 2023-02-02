import { PeerResponse } from '@ironfish/sdk'

type Peer = PeerResponse & { country: string }

export default Peer
