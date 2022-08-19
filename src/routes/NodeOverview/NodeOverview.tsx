import { FC } from 'react'
import { chakra } from '@ironfish/ui-kit'
import NodeStatus from './NodeStatus'
import NodePeers from './NodePeers'

const NodeOverview: FC = () => (
  <>
    <chakra.h2 mb="1rem">Your Node</chakra.h2>
    <NodeStatus mb="2rem" />
    <chakra.h3 mb="1rem">Connected Peers</chakra.h3>
    <NodePeers />
  </>
)

export default NodeOverview
