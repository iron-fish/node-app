import { Asset } from '@ironfish/rust-nodejs'
import { Account, CurrencyUtils, IronfishNode } from '@ironfish/sdk'
import { PRIORITY_LEVELS } from '@ironfish/sdk/build/src/memPool/feeEstimator'
import { TransactionValue } from '@ironfish/sdk/build/src/wallet/walletdb/transactionValue'
import { sizeVarBytes } from 'bufio'
import {
  IIronfishTransactionManager,
  TransactionFeeStatistic,
  TransactionFeeEstimate,
  TransactionReceiver,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'
import Transaction, { Payment, TransactionStatus } from 'Types/Transaction'
import AbstractManager from './AbstractManager'
import AssetManager from './AssetManager'

class TransactionManager
  extends AbstractManager
  implements IIronfishTransactionManager
{
  private assetManager: AssetManager

  constructor(node: IronfishNode, assetManager: AssetManager) {
    super(node)
    this.assetManager = assetManager
  }

  async send(
    accountId: string,
    payment: Payment,
    transactionFee?: bigint
  ): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const head = await account.getHead()
    const fee = transactionFee || (await this.averageFee())
    const transaction = await this.node.wallet.send(
      this.node.memPool,
      account,
      [{ ...payment, assetId: Asset.nativeId() }],
      fee,
      this.node.config.get('transactionExpirationDelta'),
      0
    )

    const result = await this.resolveTransactionFields(
      account,
      head.sequence,
      await account.getTransaction(transaction.hash())
    )

    return result
  }

  private async getFees(numOfBlocks = 100) {
    let startBlock
    const endBlock = this.node.chain.latest.sequence
    const fees: bigint[] = []

    let hash = this.node.chain.latest.hash

    for (let i = 0; i < numOfBlocks; i++) {
      const block = await this.node.chain.getBlock(hash)
      hash = block.header.previousBlockHash

      if (block) {
        startBlock = block.header.sequence
        block.transactions.forEach(transaction => {
          !transaction.isMinersFee() && fees.push(transaction.fee())
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

    fees.sort((a, b) => Number(a) - Number(b))

    return {
      startBlock,
      endBlock,
      p25: fees[Math.floor(fees.length * 0.25)],
      p50: fees[Math.floor(fees.length * 0.5)],
      p75: fees[Math.floor(fees.length * 0.75)],
      p100: fees[fees.length - 1],
    }
  }

  async estimateFeeWithPriority(
    accountId: string,
    receive: TransactionReceiver
  ): Promise<TransactionFeeEstimate> {
    const account = this.node.wallet.getAccount(accountId)
    return Promise.all([
      this.node.memPool.feeEstimator.estimateFee(PRIORITY_LEVELS[0], account, [
        receive,
      ]),
      this.node.memPool.feeEstimator.estimateFee(PRIORITY_LEVELS[1], account, [
        receive,
      ]),
      this.node.memPool.feeEstimator.estimateFee(PRIORITY_LEVELS[2], account, [
        receive,
      ]),
    ]).then(([low, medium, high]) => ({ low, medium, high }))
  }

  async averageFee(numOfBlocks = 100): Promise<bigint> {
    const { fees } = await this.getFees(numOfBlocks)
    const totalFees = Number(
      CurrencyUtils.encodeIron(
        fees.reduce((prev, curr) => prev + curr, BigInt(0))
      )
    )
    const average = totalFees / fees.length
    return CurrencyUtils.decodeIron(average.toFixed(8))
  }

  async get(hash: string, accountId: string): Promise<Transaction> {
    const account = this.node.wallet.getAccount(accountId)
    const head = await account.getHead()
    const transaction = await account.getTransaction(Buffer.from(hash, 'hex'))

    if (transaction) {
      return await this.resolveTransactionFields(
        account,
        head.sequence,
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
    for await (const spend of transaction?.transaction?.spends) {
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
      hash: transaction.transaction.hash().toString('hex'),
      isMinersFee: transaction.transaction.isMinersFee(),
      fee: transaction.transaction.fee().toString(),
      notesCount: transaction.transaction.notes.length,
      spendsCount: transaction.transaction.spends.length,
      expiration: transaction.transaction.expiration(),
      status,
      notes: notes.map(n => ({
        value: n.note.value(),
        memo: n.note.memo(),
        sender: n.note.sender(),
      })),
      spends: spends.map(spend => ({
        commitment: spend.commitment.toString('hex'),
        nullifier: spend.nullifier.toString('hex'),
        size: spend.size,
      })),
      creator: !!creator,
      blockHash: transaction.blockHash?.toString('hex'),
      size: sizeVarBytes(transaction.transaction.serialize()),
      from: creator ? account.publicAddress : notes.at(0)?.note?.sender(),
      to: creator ? notes.map(n => n.note.sender()) : [account.publicAddress],
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
    const head = await account.getHead()
    const transactions = []
    for await (const transaction of account.getTransactions()) {
      transactions.push(
        await this.resolveTransactionFields(account, head.sequence, transaction)
      )
    }
    const search = searchTerm?.toLowerCase()

    return transactions
      .filter(
        transaction =>
          !search ||
          transaction.from.toLowerCase().includes(search) ||
          transaction.to.find(a => a.toLowerCase().includes(search)) ||
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
    const transactions: Transaction[] = []
    const accounts: Account[] = this.node.wallet.listAccounts()

    for (const account of accounts) {
      const head = await account.getHead()
      for await (const transaction of account.getTransactions()) {
        let creatorNote
        for await (const spend of transaction?.transaction?.spends) {
          const noteHash = await account.getNoteHash(spend.nullifier)

          if (noteHash) {
            const decryptedNote = await account.getDecryptedNote(noteHash)
            creatorNote = decryptedNote
            break
          }
        }
        const notes = transaction
          ? await account.getTransactionNotes(transaction.transaction)
          : []
        if (
          creatorNote?.note.sender() === address ||
          notes.find(n => n.note.sender() === address)
        ) {
          transactions.push(
            await this.resolveTransactionFields(
              account,
              head.sequence,
              transaction
            )
          )
        }
      }
    }

    return transactions
      .filter(
        transaction =>
          !searchTerm ||
          transaction.from.toLowerCase().includes(searchTerm) ||
          transaction.to.find(a => a.toLowerCase().includes(searchTerm)) ||
          transaction.notes.find(note =>
            note.memo?.toLowerCase().includes(searchTerm)
          ) ||
          transaction.amount.toString().includes(searchTerm)
      )
      .sort((t1, t2) => {
        const date1: number = (t1.created || new Date()).getTime()
        const date2: number = (t2.created || new Date()).getTime()

        return sort === SortType.ASC ? date1 - date2 : date2 - date1
      })
  }
}

export default TransactionManager
