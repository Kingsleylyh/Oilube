import React, { useState, useEffect } from 'react';
import { isAddress, BrowserProvider, Contract } from 'ethers';

interface ProducerCreateProps {
  defaultManufacturerAddress?: string | null;
  onClose?: () => void;
}

const CONTRACT_ADDRESS = '0x72fCC9dc33F9e9ca5a6CeEc3692929dF656b8F25';

const CONTRACT_ABI = [
  'function NewInstance(address mAddress, string pName) public returns (bytes32)',
  'function CheckID() public view returns (bytes32)'
];

export default function ProducerCreate({ defaultManufacturerAddress, onClose }: ProducerCreateProps) {
  const [mAddress, setMAddress] = useState<string>('');
  const [pName, setPName] = useState<string>('');
  const [productId, setProductId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultManufacturerAddress && isAddress(defaultManufacturerAddress)) {
      setMAddress(defaultManufacturerAddress);
    }
  }, [defaultManufacturerAddress]);

  const handleCreateProduct = async () => {
    if (!(window as any).ethereum) {
      setError('Please install MetaMask!');
      return;
    }
    if (!isAddress(mAddress)) {
      setError('Invalid manufacturer address.');
      return;
    }
    if (!pName.trim()) {
      setError('Product name cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);
    setProductId(null);
    setTxHash(null);

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.NewInstance(mAddress, pName);
      setTxHash(tx.hash);

      await tx.wait();
      const id: string = await contract.CheckID();
      setProductId(id);
    } catch (err: any) {
      setError(err?.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="product-form">
        <div className="form-group">
          <label>Manufacturer Address:</label>
          <input
            type="text"
            value={mAddress}
            onChange={(e) => setMAddress(e.target.value)}
            placeholder="0x..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={pName}
            onChange={(e) => setPName(e.target.value)}
            placeholder="Enter product name"
            className="form-input"
          />
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
        {txHash && (
          <div style={{ marginBottom: 8, wordBreak: 'break-all' }}>
            Transaction hash: <code>{txHash}</code>
          </div>
        )}
        {productId && (
          <div style={{ marginBottom: 8, wordBreak: 'break-all' }}>
            Product ID: <code>{productId}</code>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleCreateProduct} disabled={loading} className="submit-button">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          {onClose && (
            <button onClick={onClose} className="secondary-btn">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}


