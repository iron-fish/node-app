import { FC } from 'react'
import { DataSyncContextProps } from 'Providers/DataSyncProvider'
import { chakra } from '@ironfish/ui-kit'

const getNodeSyncStatus = (
  status: 'stopped' | 'idle' | 'stopping' | 'syncing',
  progress: number,
  peerNetworkConnected: boolean
) => {
  if (!peerNetworkConnected) {
    return 'Connecting'
  }

  if ((status === 'idle' || !status) && progress > 0 && progress < 1) {
    return (progress * 100).toFixed(2) + '%'
  }

  switch (status) {
    case 'stopped':
      return 'Stopped'
    case 'idle':
      return 'Idle'
    case 'stopping':
      return 'Stopping'
    case 'syncing':
      return 'Syncing'
    default:
      return 'Idle'
  }
}

const DELIMITERS = [
  {
    unit: 's',
    value: 60,
  },
  {
    unit: 'm',
    value: 60,
  },
  {
    unit: 'h',
    value: 24,
  },
]

const renderTime = (time: number) => {
  if (!time) {
    return '...'
  }
  let remaining = time
  const result = []
  let index = 0
  while (remaining > 0) {
    result.push(
      `${Math.floor(remaining % DELIMITERS[index].value)}${
        DELIMITERS[index].unit
      }`
    )
    remaining = Math.floor(remaining / DELIMITERS[index].value)

    if (index === 2 && remaining > 0) {
      result.push(`${remaining}d`)
      break
    } else {
      index++
    }
  }

  return result.reverse().join(' ')
}

const NodeSyncStatus: FC<DataSyncContextProps> = ({ data, synced }) => {
  const leastSyncedAccount =
    data?.accounts?.length > 0
      ? data.accounts.reduce((prev, current) =>
          !Number.isNaN(+current.sequence) &&
          Number(current.sequence) < Number(data?.blockchain.head) &&
          current.sequence < prev.sequence
            ? current
            : prev
        )
      : undefined
  return (
    <>
      <chakra.h5 color="inherit">
        Node Status:{' '}
        {getNodeSyncStatus(
          data?.blockSyncer.status,
          data?.blockSyncer?.syncing?.progress,
          data?.peerNetwork?.isReady && data?.peerNetwork?.peers > 0
        )}
      </chakra.h5>
      {!synced &&
        data?.peerNetwork?.isReady &&
        data?.peerNetwork?.peers > 0 &&
        data?.blockSyncer.status === 'syncing' && (
          <>
            <chakra.h5 color="inherit">
              {`${(data?.blockSyncer.syncing.progress * 100).toFixed(2)}%`}
              {' | '}
              {`${renderTime(
                (Number(data?.blockchain?.totalSequences || 0) -
                  Number(data?.blockchain?.head || 0)) /
                  (data?.blockSyncer?.syncing?.speed || 1)
              )}`}
            </chakra.h5>
            <chakra.h5 color="inherit">
              {`${data?.blockchain.head}`}
              {' / '}
              {`${data?.blockchain.totalSequences}`}
              {' blocks'}
            </chakra.h5>
          </>
        )}
      {synced &&
        leastSyncedAccount &&
        Number(leastSyncedAccount.sequence) <
          Number(data?.blockchain.head) - 2 && (
          <>
            <chakra.h5 color="inherit">
              {`Account ${leastSyncedAccount.name} syncing: ${(
                ((Number(leastSyncedAccount.sequence) * 1.0) /
                  Number(data?.blockchain.head)) *
                100
              ).toFixed(2)}%`}
            </chakra.h5>
          </>
        )}
    </>
  )
}

export default NodeSyncStatus
