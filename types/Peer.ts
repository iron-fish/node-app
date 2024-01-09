import { RpcPeerResponse } from '@ironfish/sdk'

type Peer = Omit<RpcPeerResponse, 'features'>

export default Peer
