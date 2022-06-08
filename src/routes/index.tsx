export * from './data'

import ROUTES from './data'

import Overview from './Overview'

export const ROUTED_COMPONENTS = [
  [ROUTES.ONBOARDING, Overview],
  [ROUTES.ACCOUNTS, Overview],
  [ROUTES.SEND, Overview],
  [ROUTES.RECEIVE, Overview],
  [ROUTES.ADDRESS_BOOK, Overview],
  [ROUTES.RESOURCES, Overview],
  [ROUTES.NODE, Overview],
  [ROUTES.MINER, Overview],
]

export default ROUTED_COMPONENTS
