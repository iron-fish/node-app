import {
  Box,
  CopyValueToClipboard,
  Flex,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { FC } from 'react'
import useNodePeers from 'Hooks/node/useNodePeers'
import { truncateHash } from 'Utils/hash'
import WalletCommonTable from 'Components/WalletCommonTable'

const NodePeers: FC = () => {
  const { loaded, data, error } = useNodePeers()
  const sizes = useBreakpointValue({
    base: {
      parts: 2,
      minW: '8rem',
    },
    md: {
      parts: 3,
      minW: '12rem',
    },
    lg: {
      parts: 4,
      minW: '16rem',
    },
  })
  return (
    <WalletCommonTable
      data={data || []}
      columns={[
        {
          key: 'peer-id',
          label: 'Peer ID',
          WrapperProps: {
            w: '33%',
            minW: sizes.minW,
          },
          render: ({ identity }) => (
            <CopyValueToClipboard
              label={truncateHash(identity, sizes.parts)}
              value={identity}
              copyTooltipText={'Copy peer identity'}
              copiedTooltipText={'Peer identity copied'}
            />
          ),
        },
        {
          key: 'connection-type',
          label: 'Connection Type',
          WrapperProps: {
            w: '33%',
          },
          ItemProps: {
            whiteSpace: 'nowrap',
          },
          render: ({ connectionWebRTC, connectionWebSocket }) =>
            connectionWebRTC
              ? 'WebRTC'
              : connectionWebSocket
              ? 'WebSocket'
              : 'Unknown',
        },
        {
          key: 'peer-address',
          label: 'Address',
          WrapperProps: {
            w: '33%',
          },
          render: ({ address }) => (
            <Flex alignItems="center">
              <Box minW="6.875rem" wordBreak="break-word">
                {address}
              </Box>
            </Flex>
          ),
        },
      ]}
    />
  )
}

export default NodePeers
