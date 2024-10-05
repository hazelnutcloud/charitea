import {
  FundCreated as FundCreatedEvent,
  FundDonated as FundDonatedEvent,
  FundWithdrawn as FundWithdrawnEvent
} from "../generated/Charitea/Charitea"
import { FundCreated, FundDonated, FundWithdrawn } from "../generated/schema"

export function handleFundCreated(event: FundCreatedEvent): void {
  let entity = new FundCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fundIndex = event.params.fundIndex
  entity.owner = event.params.owner
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundDonated(event: FundDonatedEvent): void {
  let entity = new FundDonated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fundIndex = event.params.fundIndex
  entity.donator = event.params.donator
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundWithdrawn(event: FundWithdrawnEvent): void {
  let entity = new FundWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fundIndex = event.params.fundIndex
  entity.withdrawer = event.params.withdrawer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
