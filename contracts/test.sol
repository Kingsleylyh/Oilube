// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract test {
  string message;
  constructor() public 
  {
	owner = msg.sender;
    message = "Hello World!";
  }
  
	address public owner;

	uint256 public constant fee = 0.01 ether;

	using Strings for string;
	using Strings for uint256;

	struct productDetail {
	string manufacturerName;
	string productName;
	uint256 creationTime;
	address currentHolder;
	bool isDelivered;
	string[] pathRecord;
	}

	struct accountDetail {
		string role;
		string name;
		string location;
	}

	mapping(address => accountDetail) accounts;

	mapping(bytes32 => productDetail) products;

	mapping(string => mapping(string => uint)) productCounts;

	modifier onlyOwner() 
	{
	require(msg.sender == owner, "Only owner can call this function");
	_;
    }

	receive() external payable {}

	function Register(address rAdd, string memory role, string memory name, string memory location) public returns (bool) 
	{
		accountDetail memory aNew = accountDetail(role, name, location);
		accounts[rAdd] = aNew;
		return true;
	}

	function NewInstance(address mAddress, string memory pName) public returns (bytes32)
	{
		if (!accounts[mAddress].role.equal("Manufacturer"))
		{
			return bytes32(0);
		}
		else
		{
			string[] memory initPath = new string[](0);
			initPath[0] = string.concat(accounts[mAddress].name, ",", accounts[mAddress].location, ",", block.timestamp.toString());
			productDetail memory pNew = productDetail(accounts[mAddress].name, 
			pName, 
			block.timestamp, 
			mAddress, 
			false, 
			initPath
			);
			bytes32 idNew = keccak256(abi.encodePacked(pNew.productName, pNew.creationTime, (productCounts[accounts[mAddress].name][pName] + 1)));
			products[idNew] = pNew;
			productCounts[accounts[mAddress].name][pName]++;
			return idNew;
		}
	}

	function Transfer(address acceptAddress, bytes32 pID) public returns (bool)
	{
		if (products[pID].isDelivered || !accounts[acceptAddress].role.equal("Middleman"))
		{
			return false;
		}
		else
		{
			products[pID].currentHolder = acceptAddress;
			products[pID].pathRecord.push(string.concat(accounts[acceptAddress].role, ",", accounts[acceptAddress].location,",", block.timestamp.toString()));
			return true;
		}
	}

	function Purchase(address acceptAddress, bytes32 pID) public payable returns (bool) 
	{
		if (products[pID].isDelivered)
		{
			return false;
		}
		else
		{
			products[pID].currentHolder = acceptAddress;
			products[pID].isDelivered = true;
			products[pID].pathRecord.push(string.concat("Consumer,", accounts[acceptAddress].location,",", block.timestamp.toString()));
			return true;
		}
	}

	function Payment() public payable
	{
		require(msg.value == fee, "Incorrect fee amount");
		// put display here?
	} 

	function Withdraw() public onlyOwner 
	{
        uint256 balance = address(this).balance;

        require(balance > 0, "Empty balance");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
