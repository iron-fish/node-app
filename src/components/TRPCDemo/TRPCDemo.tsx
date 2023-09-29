import { trpcReact } from 'Providers/TRPCProvider'
import { useState } from 'react'

export function TRPCDemo() {
  return (
    <>
      <SimpleGetter />
      <Subscription />
      <Accounts />
    </>
  )
}

function SimpleGetter() {
  const { data, isLoading, isError, error } = trpcReact.greeting.useQuery({
    name: 'Electron',
  })

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (isError) {
    return <h1>Error: {error?.message}</h1>
  }

  if (!data) {
    return null
  }

  return <h1>{data.text}</h1>
}

function Subscription() {
  const [subscriptionData, setSubscriptionData] = useState<string | null>(null)
  trpcReact.subscriptionDemo.useSubscription(undefined, {
    onData: data => {
      setSubscriptionData(data?.text || null)
    },
  })

  return <h1>Data: {subscriptionData}</h1>
}

function Accounts() {
  const { data } = trpcReact.getAccounts.useQuery()

  if (!data) {
    return null
  }

  return <div>{JSON.stringify(data, null, 2)}</div>
}
