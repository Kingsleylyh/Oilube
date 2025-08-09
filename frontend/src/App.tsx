import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Oilube from './abi/Oilube.json';

const contractAddress = "0x35Ef82a8147F5a0F8e9c8a7A90ace3f3D9e476Da";


declare global {
  interface Window {
    ethereum?: any;
  }
}

interface OilubeCustomMethods {
	CheckID: () => Promise<string>;
	CheckRole: (address: string) => Promise<string>;
	CheckPath: (pID: string) => Promise<string[]>;

	Withdraw: () => Promise<ethers.TransactionResponse>;
	PayToView: () => Promise<ethers.TransactionResponse>;

	Register: (address: string, role: string, name: string, location: string) => Promise<boolean>;
	NewInstance: (address: string, pName: string) => Promise<string>;
	Transfer: (address: string, pID: string) => Promise<boolean>;
	Purchase: (address: string, pID: string, location: string) => Promise<boolean>
}

type OilubeInterface = ethers.Contract & OilubeCustomMethods;

function App() {
  const [contract, setContract] = useState<OilubeInterface | null>(null);

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Example history data
  const historyData = [
    {
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      label: 'Ethereum Address',
      time: '2 hours ago'
    },
    {
      address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
      label: 'Contract Address',
      time: 'Yesterday'
    },
    {
      address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      label: 'CryptoKitties Contract',
      time: '3 days ago'
    },
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      label: 'USDC Contract',
      time: '1 week ago'
    },
    {
      address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
      label: 'ENS Contract',
      time: '2 weeks ago'
    }
  ];

  // Filter history based on search term
  const filteredHistory = historyData.filter(item =>
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if wallet is already connected
  useEffect(() => {
	const connectWallet = async () => {
		if (window.ethereum)
		{
			try 
			{
				const provider = new ethers.BrowserProvider(window.ethereum);
				const accounts = await provider.send("eth_requestAccounts", []);

				if (accounts.length > 0)
				{
					const signer = await provider.getSigner();
					const walletAddress = await signer.getAddress();

					setSigner(signer);
					setWalletAddress(walletAddress);

					const contract = new ethers.Contract(
						contractAddress,
						Oilube.abi,
						signer
					);

					const contractInstance = contract as OilubeInterface;
					setContract(contractInstance);
				}
			}
			catch (error)
			{
				console.error("Account access failed!")
			}
		}
		else
		{
			console.error("Metamask not detected!");
		}
	}

	connectWallet();
  }, []);

  const connectWithMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get wallet address
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        
        // Close modal
        setIsWalletModalOpen(false);
        
        // Show success message
        alert(`Successfully connected with MetaMask!\nAddress: ${address}`);
        
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      alert("MetaMask is not installed! Please install it to use this feature.");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    alert("Wallet disconnected successfully.");
  };

  const handleWalletConnect = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
    } else {
      disconnectWallet();
    }
  };

  // Copy address to clipboard
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="container header-container">
          <div className="logo">
            <img 
              src={`${process.env.PUBLIC_URL}/oilube.jpg`} 
              alt="Oilube Logo" 
              className="logo-image" 
            />
            <div className="logo-text">Oil<span>ube</span></div>
          </div>
          
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Key in UniqueID to check"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="header-actions">
            <button className="history-btn" onClick={() => setIsHistoryModalOpen(true)}>
              <span>📋</span>
              <span>History</span>
            </button>
            <button 
              className="connect-btn" 
              onClick={handleWalletConnect}
              style={isConnected ? { backgroundColor: '#10b981' } : {}}
            >
              <span className="wallet-icon">👛</span>
              <span>
                {isConnected && walletAddress 
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                  : 'Connect Wallet'
                }
              </span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-decoration-2"></div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Explore the <span>Blockchain</span> Like Never Before</h1>
            <p>Discover, analyze, and interact with blockchain networks using our powerful explorer. Search transactions, view smart contracts, and track digital assets across multiple chains.</p>
            
            <div className="features">
              <div className="feature">
                <span>🔍</span> Real-time transaction tracking
              </div>
              <div className="feature">
                <span>📊</span> Advanced analytics
              </div>
              <div className="feature">
                <span>🔐</span> Secure wallet integration
              </div>
              <div className="feature">
                <span>🌐</span> Multi-chain support
              </div>
            </div>
            
            <div className="cta-buttons">
              <button className="primary-btn">Get Started</button>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>
          
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1620336655052-b57986f5a26a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Blockchain Visualization" 
            />
          </div>
        </div>
      </section>
      
      {/* Wallet Connection Modal */}
      <div className={`wallet-modal ${isWalletModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Connect Wallet</h2>
            <button className="close-btn" onClick={() => setIsWalletModalOpen(false)}>&times;</button>
          </div>
          
          <div className="wallet-options">
            <div className="wallet-option" onClick={connectWithMetaMask}>
              <div className="wallet-icon-lg">🦊</div>
              <div className="wallet-info">
                <h3>MetaMask</h3>
                <p>Connect to your MetaMask Wallet</p>
              </div>
            </div>
            
            <div className="wallet-option">
              <div className="wallet-icon-lg">🔷</div>
              <div className="wallet-info">
                <h3>WalletConnect</h3>
                <p>Scan with WalletConnect to connect</p>
              </div>
            </div>
            
            <div className="wallet-option">
              <div className="wallet-icon-lg">👛</div>
              <div className="wallet-info">
                <h3>Coinbase Wallet</h3>
                <p>Connect to your Coinbase Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* History Modal */}
      <div className={`history-modal ${isHistoryModalOpen ? 'active' : ''}`}>
        <div className="history-header">
          <h2>Search History</h2>
          <button className="close-btn" onClick={() => setIsHistoryModalOpen(false)}>&times;</button>
        </div>
        <div className="history-content">
          {filteredHistory.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>
              No results found.
            </div>
          ) : (
            filteredHistory.map(item => (
              <div
                className="history-item"
                key={item.address}
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => handleCopy(item.address)}
                title="Click to copy address"
              >
                <h4>
                  {item.address}
                  {copied === item.address && (
                    <span style={{
                      marginLeft: 8,
                      color: '#10b981',
                      fontSize: 14,
                      fontWeight: 500
                    }}>Copied!</span>
                  )}
                </h4>
                <p>{item.label} - {item.time}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
