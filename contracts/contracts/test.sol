// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract test {
  string message;
  constructor() public 
  {
    message = "Hello World!";
  }
  
	struct productDetail {
	string productName;
	uint256 creationTime;
	address currentHolder;
	bool isDelivered;
	string[] pathRecord;
	}

	enum role {Manufacturer, Middleman, Consumer}
	enum DAStatus {Dispatch, Accept}
	//the first level string always be product manufacturer
	mapping(string => mapping(bytes32 => productDetail)) products;
	//the second level string is product name
	mapping(string => mapping(string => uint)) productCounts;
	mapping(string => mapping(string => bool)) productExists;

	//if return false, output will register new product, actually no need
	function NewInstance(string memory pName, string memory mName, address mAddress) public returns (bytes32)
	{
		productDetail memory pNew = productDetail(pName, block.timestamp, mAddress, false, new string[](0));
		bytes32 idNew = keccak256(abi.encodePacked(pNew.productName, pNew.creationTime, (productCounts[mName][pName] + 1)));
		products[mName][idNew] = pNew;
		productCounts[mName][pName]++;
		return idNew;
	}

	function Accept(string memory mName, bytes32 pID, string memory acceptRole, string memory location, address acceptAddress) public returns (bool)
	{
	if (isEqualString(acceptRole, "Consumer"))
	{
		products[mName][pID].currentHolder = acceptAddress;
		products[mName][pID].isDelivered = true;
		products[mName][pID].pathRecord.push(string.concat(acceptRole, location, "Accept", block.timestamp.toString()));
		return true;
	}
	else if (isEqualString(acceptRole,"Middleman"))
	{
		products[mName][pID].currentHolder = acceptAddress;
		products[mName][pID].pathRecord.push(string.concat(acceptRole, location, "Accept", block.timestamp.toString()));
		return true;
	}
	else
	{
		return false;
	}
	}

	function isEqualString(string memory a, string memory b) internal pure returns (bool) 
	{
	return keccak256(bytes(a)) == keccak256(bytes(b));
	}

	function isEqualBytes(bytes memory a, bytes memory b) internal pure returns (bool) 
	{
	return keccak256(a) == keccak256(b);
	}
}
