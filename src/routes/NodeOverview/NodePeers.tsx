import {
  Box,
  CommonTable,
  CopyValueToClipboard,
  Flex,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { FC } from 'react'
import { FlagIcon } from 'react-flag-kit'
import useNodePeers from 'Hooks/node/useNodePeers'
import { truncateHash } from 'Utils/hash'

const NodePeers: FC = () => {
  const { loaded, data, error } = useNodePeers()
  const sizes = useBreakpointValue({
    base: {
      parts: 2,
      maxW: '8rem',
    },
    md: {
      parts: 3,
      maxW: '12rem',
    },
    lg: {
      parts: 4,
      maxW: '16rem',
    },
  })
  return (
    <CommonTable
      data={data || []}
      columns={[
        {
          key: 'peer-id',
          label: 'Peer ID',
          WrapperProps: {
            maxW: sizes.maxW,
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
          render: ({ address, country }) => (
            <Flex alignItems="center">
              {country && (
                <Box mr="1rem">
                  <FlagIcon code={country} size={24} />
                </Box>
              )}
              <Box>{address}</Box>
            </Flex>
          ),
        },
      ]}
    />
  )
}

export default NodePeers
