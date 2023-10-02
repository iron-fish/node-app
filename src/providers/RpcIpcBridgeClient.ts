/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { Stream } from 'Types/Stream'

export type ServerResponse<T> = {
  data: T
  error?: string
}

export class RpcIpcBridgeClient {
  isConnected = false
  private messageIds = 0

  private pending = new Map<
    number,
    {
      stream: Stream<unknown>
    }
  >()

  connect() {
    window.RpcBridge.onMessage(this.onData)
    this.isConnected = true
  }

  request<TStream = unknown>(route: string, data?: unknown): Stream<TStream> {
    const messageId = ++this.messageIds
    const stream = new Stream<TStream>()

    this.pending.set(messageId, {
      stream,
    })

    window.RpcBridge.sendMessage(messageId, route, data)
    return stream
  }

  protected onData = async (
    messageId: number,
    isStream: boolean,
    { data, error }: ServerResponse<unknown>
  ): Promise<void> => {
    const request = this.pending.get(messageId)
    if (error) {
      request.stream.close(error)
      return
    } else {
      request.stream.write(data)
    }
  }
}

const client = new RpcIpcBridgeClient()
client.connect()
window.rpcClient = client

export default client
