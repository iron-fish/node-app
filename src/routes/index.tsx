export * from './data'

import ROUTES from './data'

import PageLayout from './PageLayout'

export const ROUTED_COMPONENTS = [
  [ROUTES.TELEMETRY, PageLayout],
  [ROUTES.ONBOARDING, PageLayout],
  [ROUTES.ACCOUNTS, PageLayout],
  [ROUTES.SEND, PageLayout],
  [ROUTES.RECEIVE, PageLayout],
  [ROUTES.ADDRESS_BOOK, PageLayout],
  [ROUTES.RESOURCES, PageLayout],
  [ROUTES.NODE, PageLayout],
  [ROUTES.MINER, PageLayout],
]

export default ROUTED_COMPONENTS
