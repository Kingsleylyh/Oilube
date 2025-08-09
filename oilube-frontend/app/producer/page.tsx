"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState } from "react";
import { isAddress, BrowserProvider, Contract } from "ethers";

const CONTRACT_ADDRESS = "0x72fCC9dc33F9e9ca5a6CeEc3692929dF656b8F25";

const CONTRACT_ABI = [
  "function NewInstance(address mAddress, string pName) public returns (bytes32)",
  "function CheckID() public view returns (bytes32)",
];

export default function ProducerPage() {
  const [mAddress, setMAddress] = useState("");
  const [pName, setPName] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null); // NEW: state for tx hash
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateProduct() {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }
    if (!isAddress(mAddress)) {
      setError("Invalid manufacturer address.");
      return;
    }
    if (!pName.trim()) {
      setError("Product name cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setProductId(null);
    setTxHash(null);  // reset txHash on new call

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.NewInstance(mAddress, pName);
      setTxHash(tx.hash);  // SET tx hash here

      const receipt = await tx.wait();

      const id = await contract.CheckID();
      setProductId(id);
    } catch (err: any) {
      setError(err.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Oil Product</h1>

      <label className="block mb-2">
        Manufacturer Address:
        <input
          type="text"
          value={mAddress}
          onChange={(e) => setMAddress(e.target.value)}
          placeholder="0x..."
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block mb-4">
        Product Name:
        <input
          type="text"
          value={pName}
          onChange={(e) => setPName(e.target.value)}
          placeholder="Enter product name"
          className="w-full border p-2 rounded"
        />
      </label>

      <button
        onClick={handleCreateProduct}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {txHash && (
        <p className="mt-4 break-all">
          Transaction hash: <code>{txHash}</code>
        </p>
      )}

      {productId && (
        <p className="mt-4 break-all">
         
        </p>
      )}
    </main>
  );
}
