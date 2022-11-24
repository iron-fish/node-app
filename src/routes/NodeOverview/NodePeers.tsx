import { CommonTable } from '@ironfish/ui-kit'
import { FC } from 'react'
import useNodePeers from 'Hooks/node/useNodePeers'

const NodePeers: FC = () => {
  const { loaded, data, error } = useNodePeers()
  return (
    <CommonTable
      data={data || []}
      columns={[
        {
          key: 'peer-id',
          label: 'Peer ID',
          render: ({ identity }) => identity,
        },
        {
          key: 'connection-type',
          label: 'Connection Type',
          render: ({ connectionWebRTC, connectionWebSocket }) =>
            connectionWebRTC
              ? 'WebRTC'
              : connectionWebSocket
              ? 'WebSocket'
              : 'Unknown',
        },
      ]}
    />
  )
}

export default NodePeers
