// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract test {
  string message;
  constructor() public 
  {
    message = "Hello World!";
  }
  
  struct productDetail {
  string productName;
  string creationDateTime;
  address currentHolder;
  bool isDelivered;
  string[] pathRecord;
  }
  
  enum role {Manufacturer, Middleman, Consumer}
  enum DAStatus {Dispatch, Accept}
//the first level string always be product manufacturer
  mapping(string => mapping(uint => productDetail)) products;
//the second level string is product name
  mapping(string => mapping(string => uint)) productCounts;
  mapping(string => mapping(string => bool)) productExists;

//if return false, output will register new product, actually no need
  function NewInstance(string memory pName, string memory mName, address mAddress) public returns(string)
  {

		pNew = productDetail(pName, block.timestamp, mAddress, false);
		idNew = keccak256(abi.encodePacked(pNew.productName, pNew.creationDateTime, (productCounts[mName][pName] + 1)));
		products[mName][idNew] = pNew;
		productCounts[mName][pName]++;
		return idNew;
  }

  function Accept(string memory mName, string memory pID, string memory acceptRole, string memory location, address memory acceptAddress) public returns(bool)
  {
	try
	{
		if (acceptRole == "Consumer")
		{
			products[mName][pID].currentHolder = acceptAddress;
			products[mName][pID].isDelivered = true;
			products[mName][pID].pathRecord.push(string.concat(acceptRole, location, "Accept", block.timestamp));
			return true;
		}
		else if (acceptRole == "Middleman")
		{
			products[mName][pID].currentHolder = acceptAddress;
			products[mName][pID].pathRecord.push(string.concat(acceptRole, location, "Accept", block.timestamp));
			return true;
		}
	}
	catch
	{
		return false;
	}
	finally
	{
		return false;
	}
  }
}
