import { displayProductDetail as DisplayProductDetailEvent } from "../generated/Oilube/Oilube"
import { Product } from "../generated/schema"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"

export function handleDisplayProductDetail(event: DisplayProductDetailEvent): void {
  // unique ID for entity combining tx hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()

  let product = new Product(id)
  product.mName = event.params.mName
  product.pName = event.params.pName
  product.creationTime = event.params.creationTime
  product.curHolder = event.params.curHolder
  product.isDelivered = event.params.isDelivered
  product.path = event.params.path

  product.blockNumber = event.block.number
  product.blockTimestamp = event.block.timestamp
  product.transactionHash = event.transaction.hash

  product.save()
}
