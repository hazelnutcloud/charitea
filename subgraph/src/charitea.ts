import { BigInt, Bytes, ipfs, json } from "@graphprotocol/graph-ts";
import {
  FundCreated as FundCreatedEvent,
  FundDonated as FundDonatedEvent,
  FundWithdrawn as FundWithdrawnEvent,
} from "../generated/Charitea/Charitea";
import { Donation, Fund, Wallet, Withdrawal } from "../generated/schema";

export function handleFundCreated(event: FundCreatedEvent): void {
  createWalletIfNotExistent(event.params.owner);

  const fund = new Fund(
    Bytes.fromByteArray(Bytes.fromBigInt(event.params.fundIndex))
  );

  fund.amount = BigInt.fromI32(0);
  fund.creationBlock = event.block.number;
  fund.creationTimestamp = event.block.timestamp;
  fund.creationTxHash = event.transaction.hash;
  fund.fundIndex = event.params.fundIndex;
  fund.owner = event.transaction.from;
  fund.worldIdProof = event.params.worldIdProof;

  let data = ipfs.cat(event.params.data);

  if (!data) {
    fund.save();
    return;
  }

  const jsonValue = json.fromBytes(data);
  const obj = jsonValue.toObject();
  const title = obj.get("title");
  const description = obj.get("description");
  const imageURI = obj.get("imageURI");
  const merkleRoot = obj.get("merkleRoot");
  const nullifierHash = obj.get("nullifierHash");
  const verificationLevel = obj.get("verificationLevel");
  if (title != null) {
    fund.title = title.toString();
  }
  if (description != null) {
    fund.description = description.toString();
  }
  if (imageURI != null) {
    fund.imageURI = imageURI.toString();
  }
  if (merkleRoot != null) {
    fund.merkleRoot = merkleRoot.toString();
  }
  if (nullifierHash != null) {
    fund.nullifierHash = nullifierHash.toString();
  }
  if (verificationLevel != null) {
    fund.verificationLevel = verificationLevel.toString();
  }

  fund.save();
}

export function handleFundDonated(event: FundDonatedEvent): void {
  const fund = Fund.load(
    Bytes.fromByteArray(Bytes.fromBigInt(event.params.fundIndex))
  );
  if (fund == null) return;
  createWalletIfNotExistent(event.params.donator);

  fund.amount = fund.amount.plus(event.params.amount);
  fund.save();

  const donation = new Donation(
    Bytes.fromByteArray(
      Bytes.fromBigInt(event.params.fundIndex)
        .concat(event.params.donator)
        .concat(event.transaction.hash)
        .concatI32(event.logIndex.toI32())
    )
  );
  donation.block = event.block.number;
  donation.donator = event.params.donator;
  donation.fund = fund.id;
  donation.timestamp = event.block.timestamp;
  donation.txHash = event.transaction.hash;
  donation.save();
}

export function handleFundWithdrawn(event: FundWithdrawnEvent): void {
  const fund = Fund.load(
    Bytes.fromByteArray(Bytes.fromBigInt(event.params.fundIndex))
  );
  if (fund == null) return;
  createWalletIfNotExistent(event.params.withdrawer);

  fund.amount = fund.amount.minus(event.params.amount);
  fund.save();

  const withdrawal = new Withdrawal(
    Bytes.fromByteArray(
      Bytes.fromBigInt(event.params.fundIndex)
        .concat(event.transaction.hash)
        .concatI32(event.logIndex.toI32())
    )
  );
  withdrawal.amount = event.params.amount;
  withdrawal.block = event.block.number;
  withdrawal.fund = fund.id;
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.txHash = event.transaction.hash;
  withdrawal.withdrawer = event.params.withdrawer;
  withdrawal.save();
}

function createWalletIfNotExistent(address: Bytes): void {
  let wallet = Wallet.load(address);
  if (wallet != null) return;

  wallet = new Wallet(address);
  wallet.address = address;
  wallet.save();
}
