import z from 'zod'
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { ifNode } from '../ironfish/IronFishManager'

const ee = new EventEmitter()
const t = initTRPC.create({ isServer: true })

let count = 1
function emitEveryFiveSecs() {
  setInterval(() => {
    ee.emit('demo-event', `Count is ${count++}`)
  }, 5000)
}
emitEveryFiveSecs()

export const router = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query(req => {
    const { input } = req

    return {
      text: `Hello ${input.name}` as const,
    }
  }),
  subscriptionDemo: t.procedure.subscription(() => {
    return observable<{ text: string }>(emit => {
      function onGreet(text: string) {
        emit.next({ text })
      }

      ee.on('demo-event', onGreet)

      return () => {
        ee.off('demo-event', onGreet)
      }
    })
  }),
  getAccounts: t.procedure.query(async () => {
    if (!ifNode) {
      throw new Error('Node not foound')
    }

    const accounts = await ifNode.wallet.listAccounts()

    return accounts.map(account => {
      return account.publicAddress
    })
  }),
})

export type AppRouter = typeof router
