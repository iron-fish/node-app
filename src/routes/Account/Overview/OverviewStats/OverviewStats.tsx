import { useEffect, useRef } from 'react'
import { Box } from '@ironfish/ui-kit'
import Account from 'Types/Account'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import AccountAssetsView from '../AccountAssetsView/AccountAssetsView'
import OverviewBalance from '../OverviewBalance/OverviewBalance'
import { Container } from 'Routes/Account/Shared/Container'

type Props = {
  account: Account
  setSize: (size: number) => void
}

export function OverviewStats({ account, setSize }: Props) {
  const wrapper = useRef<HTMLDivElement>()
  const observer = useRef(
    new ResizeObserver(entries => {
      const { height } = entries[0].contentRect
      setSize(height)
    })
  )

  useEffect(() => {
    if (wrapper.current) {
      observer.current.observe(wrapper.current)
    }

    const observerClosure = observer.current
    const wrapperClosure = wrapper.current

    return () => wrapperClosure && observerClosure.unobserve(wrapperClosure)
  }, [wrapper, observer])

  return (
    <Box ref={wrapper}>
      <Box py="2rem">
        <Container>
          <SyncWarningMessage mb="2rem" />
          <OverviewBalance account={account} />
          <AccountAssetsView assets={account.balances.assets} />
        </Container>
      </Box>
    </Box>
  )
}
