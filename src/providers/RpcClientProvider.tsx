import RpcIpcBridgeClient from 'Providers/RpcIpcBridgeClient'
import { FC, ReactNode, createContext } from 'react'

const RpcClientContext = createContext(null)

export const RpcClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <RpcClientContext.Provider value={RpcIpcBridgeClient}>
      {children}
    </RpcClientContext.Provider>
  )
}
