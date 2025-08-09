export const CONTRACT_ADDRESS = "0x72fCC9dc33F9e9ca5a6CeEc3692929dF656b8F25";

export const CONTRACT_ABI = [
  // your ABI here, e.g.
  "function PayToView(bytes32 pID) public payable returns (tuple(string manufacturerName, string productName, uint256 creationTime, address currentHolder, bool isDelivered, string[] pathRecord))",
  "event displayProductDetail(string mName, string pName, uint256 creationTime, address curHolder, bool isDelivered, string[] path)",
  // ...other functions/events
];
