import { FC } from 'react'
import { DataSyncContextProps } from 'Providers/DataSyncProvider'
import { chakra } from '@ironfish/ui-kit'

const getWalletSyncStatus = (
  status: 'stopped' | 'idle' | 'stopping' | 'syncing',
  progress: number
) => {
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

const DELIMETERS = [
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
      `${Math.floor(remaining % DELIMETERS[index].value)}${
        DELIMETERS[index].unit
      }`
    )
    remaining = Math.floor(remaining / DELIMETERS[index].value)

    if (index === 2 && remaining > 0) {
      result.push(`${remaining}d`)
      break
    } else {
      index++
    }
  }

  return result.reverse().join(' ')
}

const WalletSyncStatus: FC<DataSyncContextProps> = ({ data, synced }) => (
  <>
    <chakra.h5 color="inherit">
      Wallet Status:{' '}
      {getWalletSyncStatus(
        data?.blockSyncer.status,
        data?.blockSyncer?.syncing?.progress
      )}
    </chakra.h5>
    {!synced &&
      data?.blockSyncer.status !== 'stopped' &&
      (data?.blockSyncer.status === 'syncing' ||
        data?.blockSyncer.status === 'idle') && (
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
  </>
)

export default WalletSyncStatus
