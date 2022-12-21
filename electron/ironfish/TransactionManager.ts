import { Account, CurrencyUtils, IronfishNode } from '@ironfish/sdk'
import { TransactionValue } from '@ironfish/sdk/build/src/wallet/walletdb/transactionValue'
import {
  IIronfishTransactionManager,
  TransactionFeeStatistic,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'
import Transaction, { Payment, TransactionStatus } from 'Types/Transaction'

class TransactionManager implements IIronfishTransactionManager {
  private node: IronfishNode

  constructor(node: IronfishNode) {
    this.node = node
  }

  async pay(
    accountId: string,
    payment: Payment,
    transactionFee?: number
  ): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const fee = transactionFee || (await this.averageFee())
    const transaction = await this.node.wallet.pay(
      this.node.memPool,
      account,
      [payment],
      BigInt(fee),
      this.node.config.get('defaultTransactionExpirationSequenceDelta'),
      0
    )

    const result = await this.resolveTransactionFields(
      account,
      headSequence,
      await account.getTransactionByUnsignedHash(transaction.unsignedHash())
    )

    return result
  }

  private async getFees(numOfBlocks = 100) {
    let startBlock
    const endBlock = this.node.chain.latest.sequence
    const fees: number[] = []

    let hash = this.node.chain.latest.hash

    for (let i = 0; i < numOfBlocks; i++) {
      const block = await this.node.chain.getBlock(hash)
      hash = block.header.previousBlockHash

      if (block) {
        startBlock = block.header.sequence
        block.transactions.forEach(transaction => {
          !transaction.isMinersFee() && fees.push(Number(transaction.fee()))
        })
      }
    }

    return {
      startBlock,
      endBlock,
      fees,
    }
  }

  async fees(numOfBlocks = 100): Promise<TransactionFeeStatistic> {
    const { startBlock, endBlock, fees } = await this.getFees(numOfBlocks)

    fees.sort((a, b) => a - b)

    return {
      startBlock,
      endBlock,
      p25: fees[Math.floor(fees.length * 0.25)],
      p50: fees[Math.floor(fees.length * 0.5)],
      p75: fees[Math.floor(fees.length * 0.75)],
      p100: fees[fees.length - 1],
    }
  }

  async averageFee(numOfBlocks = 100): Promise<number> {
    const { fees } = await this.getFees(numOfBlocks)

    return fees.reduce((prev, curr) => prev + curr, 0) / fees.length
  }

  async get(hash: string, accountId: string): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const transaction = await account.getTransactionByUnsignedHash(
      Buffer.from(hash, 'hex')
    )

    if (transaction) {
      return await this.resolveTransactionFields(
        account,
        headSequence,
        transaction
      )
    }

    return null
  }

  private async status(
    account: Account,
    headSequence: number,
    transaction: Readonly<TransactionValue>
  ) {
    let status
    try {
      status = await this.node.wallet.getTransactionStatus(
        account,
        transaction,
        { headSequence }
      )
    } catch (e) {
      status = TransactionStatus.UNKNOWN
    }

    return status
  }

  private async resolveTransactionFields(
    account: Account,
    headSequence: number,
    transaction: Readonly<TransactionValue>
  ): Promise<Transaction> {
    const status = await this.status(account, headSequence, transaction)
    const created = transaction?.blockHash
      ? await this.node.chain.getBlock(transaction.blockHash)
      : null
    const spends = []
    let creator
    for await (const spend of transaction?.transaction?.spends() || []) {
      const noteHash = await account.getNoteHash(spend.nullifier)

      if (noteHash) {
        const decryptedNote = await account.getDecryptedNote(noteHash)
        creator = decryptedNote
      }

      spends.push(spend)
    }
    const notes = transaction
      ? await account.getTransactionNotes(transaction.transaction)
      : []

    return {
      accountId: account.id,
      hash: transaction.transaction.unsignedHash().toString('hex'),
      isMinersFee: transaction.transaction.isMinersFee(),
      fee: transaction.transaction.fee().toString(),
      notesCount: transaction.transaction.notesLength(),
      spendsCount: transaction.transaction.spendsLength(),
      expirationSequence: transaction.transaction.expirationSequence(),
      status,
      notes: notes.map(n => ({
        value: n.note.value(),
        memo: n.note.memo(),
      })),
      spends,
      creator: !!creator,
      from: creator ? account.publicAddress : '',
      to: creator ? '' : account.publicAddress,
      created: created?.header?.timestamp || new Date(),
      amount: CurrencyUtils.renderIron(
        notes
          .map(note => note.note.value())
          .reduce((prev, curr) => prev + curr, BigInt(0)) -
          (creator?.note?.value()
            ? creator?.note?.value() - transaction.transaction.fee()
            : BigInt(0))
      ),
    }
  }

  async findByAccountId(
    accountId: string,
    searchTerm?: string,
    sort?: SortType
  ): Promise<Transaction[]> {
    const account = this.node.wallet.getAccount(accountId)
    const headSequence = await this.node.wallet.getAccountHeadSequence(account)
    const transactions = []
    for await (const transaction of account.getTransactions()) {
      transactions.push(
        await this.resolveTransactionFields(account, headSequence, transaction)
      )
    }
    const search = searchTerm?.toLowerCase()

    return transactions
      .filter(
        transaction =>
          !search ||
          transaction.from.toLowerCase().includes(search) ||
          transaction.to.toLowerCase().includes(search) ||
          transaction.notes.find(note =>
            note.memo?.toLowerCase().includes(search)
          ) ||
          transaction.amount.toString().includes(search)
      )
      .sort((t1, t2) => {
        const date1: number = (t1.created || new Date()).getTime()
        const date2: number = (t2.created || new Date()).getTime()

        return sort === SortType.ASC ? date1 - date2 : date2 - date1
      })
  }

  async findByAddress(address: string, searchTerm?: string, sort?: SortType) {
    const transactions: Transaction[] = await Promise.resolve([])

    return transactions
  }
}

export default TransactionManager
