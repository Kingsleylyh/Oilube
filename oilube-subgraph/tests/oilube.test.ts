import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { displayProductDetail } from "../generated/schema"
import { displayProductDetail as displayProductDetailEvent } from "../generated/Oilube/Oilube"
import { handledisplayProductDetail } from "../src/oilube"
import { createdisplayProductDetailEvent } from "./oilube-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let mName = "Example string value"
    let pName = "Example string value"
    let creationTime = BigInt.fromI32(234)
    let curHolder = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let isDelivered = "boolean Not implemented"
    let path = ["Example string value"]
    let newdisplayProductDetailEvent = createdisplayProductDetailEvent(
      mName,
      pName,
      creationTime,
      curHolder,
      isDelivered,
      path
    )
    handledisplayProductDetail(newdisplayProductDetailEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("displayProductDetail created and stored", () => {
    assert.entityCount("displayProductDetail", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "mName",
      "Example string value"
    )
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pName",
      "Example string value"
    )
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creationTime",
      "234"
    )
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "curHolder",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isDelivered",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "displayProductDetail",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "path",
      "[Example string value]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
