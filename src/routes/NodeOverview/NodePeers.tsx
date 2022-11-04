import { CommonTable } from '@ironfish/ui-kit'
import { FC } from 'react'
import useNodePeers from 'Hooks/node/useNodePeers'
import { truncateHash } from 'Utils/hash'

const NodePeers: FC = () => {
  const { loaded, data, error } = useNodePeers()
  return (
    <CommonTable
      data={data || []}
      columns={[
        {
          key: 'peer-id',
          label: 'Peer ID',
          WrapperProps: {
            w: '16rem',
          },
          render: ({ identity }) => truncateHash(identity, 2),
        },
        {
          key: 'peer-name',
          label: 'Name',
          WrapperProps: {
            w: '16rem',
          },
          render: ({ name }) => name,
        },
        {
          key: 'connection-status',
          label: 'Status',
          WrapperProps: {
            w: '16rem',
          },
          render: ({ state }) => state,
        },
      ]}
    />
  )
}

export default NodePeers
