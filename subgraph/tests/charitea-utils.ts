import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FundCreated,
  FundDonated,
  FundWithdrawn
} from "../generated/Charitea/Charitea"

export function createFundCreatedEvent(
  fundIndex: BigInt,
  owner: Address,
  data: string
): FundCreated {
  let fundCreatedEvent = changetype<FundCreated>(newMockEvent())

  fundCreatedEvent.parameters = new Array()

  fundCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fundIndex",
      ethereum.Value.fromUnsignedBigInt(fundIndex)
    )
  )
  fundCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  fundCreatedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromString(data))
  )

  return fundCreatedEvent
}

export function createFundDonatedEvent(
  fundIndex: BigInt,
  donator: Address,
  amount: BigInt
): FundDonated {
  let fundDonatedEvent = changetype<FundDonated>(newMockEvent())

  fundDonatedEvent.parameters = new Array()

  fundDonatedEvent.parameters.push(
    new ethereum.EventParam(
      "fundIndex",
      ethereum.Value.fromUnsignedBigInt(fundIndex)
    )
  )
  fundDonatedEvent.parameters.push(
    new ethereum.EventParam("donator", ethereum.Value.fromAddress(donator))
  )
  fundDonatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundDonatedEvent
}

export function createFundWithdrawnEvent(
  fundIndex: BigInt,
  withdrawer: Address,
  amount: BigInt
): FundWithdrawn {
  let fundWithdrawnEvent = changetype<FundWithdrawn>(newMockEvent())

  fundWithdrawnEvent.parameters = new Array()

  fundWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "fundIndex",
      ethereum.Value.fromUnsignedBigInt(fundIndex)
    )
  )
  fundWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawer",
      ethereum.Value.fromAddress(withdrawer)
    )
  )
  fundWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundWithdrawnEvent
}
