import { PeerResponse } from '@ironfish/sdk'

type Peer = Omit<PeerResponse, 'features'> & { country: string }

export default Peer
