"use client";

import { useState } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";

// Replace these with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x72fCC9dc33F9e9ca5a6CeEc3692929dF656b8F25";
const CONTRACT_ABI = [
  "function PayToView(bytes32 pID) public payable returns (tuple(string manufacturerName, string productName, uint256 creationTime, address currentHolder, bool isDelivered, string[] pathRecord))"
];

// Your subgraph URL
const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/118186/oilubee/version/latest";
const feeEth = "0.0000025"; // OP Sepolia fee

export default function CheckProductPage() {
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);

  async function handleCheckProduct() {
    setError(null);
    setProduct(null);

    if (!txHash.trim()) {
      setError("Please enter a transaction hash");
      return;
    }

    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch product by transaction hash from subgraph
      const productFromSubgraph = await fetchProductByTxHash(txHash.trim());

      // 2. Connect to contract and pay to view
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // The product ID to pass in PayToView is productFromSubgraph.id WITHOUT the suffix
      // productFromSubgraph.id has suffix like "0xabc...-6", contract expects pure bytes32
      const cleanProductId = productFromSubgraph.id.split("-")[0];

      const fee = ethers.parseEther(feeEth);
      const tx = await contract.PayToView(cleanProductId, { value: fee });
      await tx.wait();

      // 3. Show product details from subgraph (already fetched)
      setProduct({
        ...productFromSubgraph,
        creationTime: new Date(Number(productFromSubgraph.creationTime) * 1000).toLocaleString(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to check product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Check Product Authenticity by Transaction Hash</h1>

      <label className="block mb-4">
        Transaction Hash:
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter transaction hash"
          className="w-full border p-2 rounded"
        />
      </label>

      <button
        onClick={handleCheckProduct}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ${feeEth} ETH and Check`}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {product && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Product Details</h2>
          <p><strong>Manufacturer:</strong> {product.mName}</p>
          <p><strong>Product Name:</strong> {product.pName}</p>
          <p><strong>Creation Time:</strong> {product.creationTime}</p>
          <p><strong>Current Holder:</strong> {product.curHolder}</p>
          <p><strong>Delivered:</strong> {product.isDelivered ? "Yes" : "No"}</p>
          <p><strong>Path Record:</strong></p>
          <ul className="list-disc ml-6">
            {product.path.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

async function fetchProductByTxHash(txHash: string) {
  const query = `
    query {
      products(where: { transactionHash: "${txHash.toLowerCase()}" }) {
        id
        mName
        pName
        creationTime
        curHolder
        isDelivered
        path
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!data.data.products || data.data.products.length === 0) {
    throw new Error("No product found with this transaction hash");
  }

  return data.data.products[0];
}
