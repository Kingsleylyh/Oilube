"use client";

import { useState } from "react";
import { isAddress, BrowserProvider, Contract } from "ethers";

const CONTRACT_ADDRESS = "0x72fCC9dc33F9e9ca5a6CeEc3692929dF656b8F25";

const CONTRACT_ABI = [
  "function Register(address rAdd, string role, string name, string location) public returns (bool)",
];

export default function RegisterPage() {
  const [rAddress, setRAddress] = useState("");
  const [role, setRole] = useState("Manufacturer");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);
    setSuccessMessage(null);

    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    if (!isAddress(rAddress)) {
      setError("Invalid Ethereum address.");
      return;
    }
    if (!role.trim() || !name.trim() || !location.trim()) {
      setError("Role, Name, and Location cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.Register(rAddress, role, name, location);
      await tx.wait();

      setSuccessMessage("Manufacturer registered successfully!");
      // Optionally clear inputs
      setRAddress("");
      setName("");
      setLocation("");
    } catch (err: any) {
      setError(err?.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Register as Manufacturer</h1>

      <label className="block mb-4">
        Ethereum Address:
        <input
          type="text"
          value={rAddress}
          onChange={(e) => setRAddress(e.target.value)}
          placeholder="0x..."
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-4">
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Manufacturer"
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-4">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-6">
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </main>
  );
}
