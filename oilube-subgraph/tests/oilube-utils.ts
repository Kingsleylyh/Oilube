import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { displayProductDetail } from "../generated/Oilube/Oilube"

export function createdisplayProductDetailEvent(
  mName: string,
  pName: string,
  creationTime: BigInt,
  curHolder: Address,
  isDelivered: boolean,
  path: Array<string>
): displayProductDetail {
  let displayProductDetailEvent =
    changetype<displayProductDetail>(newMockEvent())

  displayProductDetailEvent.parameters = new Array()

  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam("mName", ethereum.Value.fromString(mName))
  )
  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam("pName", ethereum.Value.fromString(pName))
  )
  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam(
      "creationTime",
      ethereum.Value.fromUnsignedBigInt(creationTime)
    )
  )
  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam("curHolder", ethereum.Value.fromAddress(curHolder))
  )
  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam(
      "isDelivered",
      ethereum.Value.fromBoolean(isDelivered)
    )
  )
  displayProductDetailEvent.parameters.push(
    new ethereum.EventParam("path", ethereum.Value.fromStringArray(path))
  )

  return displayProductDetailEvent
}
