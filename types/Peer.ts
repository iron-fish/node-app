import { PeerResponse } from '@ironfish/sdk'

type Peer = Omit<PeerResponse, 'features'>

export default Peer
