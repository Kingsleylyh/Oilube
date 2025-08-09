import { displayProductDetail as displayProductDetailEvent } from "../generated/Oilube/Oilube"
import { displayProductDetail } from "../generated/schema"

export function handledisplayProductDetail(
  event: displayProductDetailEvent
): void {
  let entity = new displayProductDetail(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.mName = event.params.mName
  entity.pName = event.params.pName
  entity.creationTime = event.params.creationTime
  entity.curHolder = event.params.curHolder
  entity.isDelivered = event.params.isDelivered
  entity.path = event.params.path

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
