import { FC } from 'react'
import { chakra } from '@ironfish/ui-kit'

const SnapshotRequirement: FC<{
  isMinified: boolean
}> = ({ isMinified }) => {
  return (
    <>
      <chakra.h5
        color="inherit"
        m="0.5rem"
        display={isMinified ? 'none' : 'inherit'}
      >
        Choosing how to sync the chain
      </chakra.h5>
    </>
  )
}

export default SnapshotRequirement
