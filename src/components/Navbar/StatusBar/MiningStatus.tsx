import { forwardRef } from 'react'
import { chakra } from '@ironfish/ui-kit'

const MiningStatus = forwardRef<HTMLHeadElement>((props, ref) => (
  <chakra.h5 color="inherit">Miner Running: 300 h/s</chakra.h5>
))

export default MiningStatus
