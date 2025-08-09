
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

	Register: (address: string, role: string, name: string, location: string) => Promise<boolean>;
	NewInstance: (address: string, pName: string) => Promise<string>;
	Transfer: (address: string, pID: string) => Promise<boolean>;
	Purchase: (address: string, pID: string, location: string) => Promise<boolean>
}

type OilubeInterface = ethers.Contract & OilubeCustomMethods;

type UserRole = 'manufacturer' | 'middleman' | 'consumer' | 'none';

interface UserProfile {
  role: UserRole;
  name: string;
  location: string;
  address: string;
}

interface DemoWallet {
  address: string;
  name: string;
  role: UserRole;
  privateKey?: string;
}

interface OilProduct {
  id: string;
  name: string;
  description: string;
  location: string;
  manufacturer: string;
  price: string;
  status: 'manufactured' | 'transferred' | 'purchased';
  createdAt: string;
  blockchainId?: string; // Store the blockchain product ID
  pathRecord?: string[]; // Store the blockchain path record
}

function App() {
  const [contract, setContract] = useState<OilubeInterface | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('none');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    role: 'manufacturer' as UserRole,
    name: '',
    location: ''
  });
  const [itemValue, setItemValue] = useState<string | null>(null);
  const [itemDetails, setItemDetails] = useState<{ path: string, description: string, price: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Demo wallets configuration
  const demoWallets: DemoWallet[] = [
    {
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      name: "Oil Factory Ltd",
      role: "manufacturer"
    },
    {
      address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", 
      name: "Global Trading Co",
      role: "middleman"
    },
    {
      address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
      name: "Retail Store Chain",
      role: "consumer"
    }
  ];

  // State for demo wallet functionality
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedDemoWallet, setSelectedDemoWallet] = useState<DemoWallet | null>(null);
  const [oilProducts, setOilProducts] = useState<OilProduct[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    location: '',
    price: ''
  });



  // State for receive product functionality (middleman)
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    productId: ''
  });

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

  // Add inside your App() before return

// Function to check the item code
const checkItemCode = async () => {
  if (!searchTerm.trim()) {
    alert("Please enter an Item Code.");
    return;
  }

  setIsChecking(true);
  try {
    // Simulating item details (replace with actual contract call when connected to blockchain)
    const simulatedValue = {
      path: "Path to manufacturer -> Middleman -> Consumer",
      description: "This is a description of the oil product.",
      price: "$20.00"
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setItemDetails(simulatedValue); // Show the details in the modal
  } catch (error) {
    console.error("Error checking item code:", error);
    alert("Failed to check item code.");
  } finally {
    setIsChecking(false);
  }
};

  // Function to check user role
  const checkUserRole = async (address: string) => {
    setIsLoadingRole(true);
    try {
      // First, try to get role from blockchain if contract is available
      if (contract) {
        try {
          const role = await contract.CheckRole(address);
          console.log("User role from contract:", role);
          
          // Convert contract role to our UserRole type
          let userRoleType: UserRole = 'none';
          if (role && role.toLowerCase().includes('manufacturer')) {
            userRoleType = 'manufacturer';
          } else if (role && role.toLowerCase().includes('middleman')) {
            userRoleType = 'middleman';
          } else if (role && role.toLowerCase().includes('consumer')) {
            userRoleType = 'consumer';
          }
          
          if (userRoleType !== 'none') {
            setUserRole(userRoleType);
            return userRoleType;
          }
        } catch (error) {
          console.error("Error checking user role from blockchain:", error);
        }
      }
      
      // If no role found on blockchain, check localStorage
      const storedProfile = localStorage.getItem(`userProfile_${address}`);
      if (storedProfile) {
        try {
          const profile: UserProfile = JSON.parse(storedProfile);
          console.log("User role from localStorage:", profile.role);
          setUserProfile(profile);
          setUserRole(profile.role);
          return profile.role;
        } catch (error) {
          console.error("Error parsing stored user profile:", error);
        }
      }
      
      // No role found anywhere
      setUserRole('none');
      return 'none';
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole('none');
      return 'none';
    } finally {
      setIsLoadingRole(false);
    }
  };

  // Function to register user
  const registerUser = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!registrationForm.name.trim() || !registrationForm.location.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      console.log("Registering user with details:", {
        address: walletAddress,
        role: registrationForm.role,
        name: registrationForm.name,
        location: registrationForm.location
      });

      // Check if user already has a role assigned
      const currentRole = await checkUserRole(walletAddress);
      
      if (currentRole !== 'none' && contract) {
        // User already has a role, try to register on blockchain
        if (!contract) {
          alert("Contract not available. Registration will be stored locally only.");
        } else {
          try {
            const success = await contract.Register(
              walletAddress,
              registrationForm.role,
              registrationForm.name,
              registrationForm.location
            );

            if (!success) {
              alert("Blockchain registration failed. Registration will be stored locally only.");
            }
          } catch (error) {
            console.error("Error registering on blockchain:", error);
            alert("Blockchain registration failed. Registration will be stored locally only.");
          }
        }
      }

      // Store registration data locally regardless of blockchain status
      const newProfile: UserProfile = {
        role: registrationForm.role,
        name: registrationForm.name,
        location: registrationForm.location,
        address: walletAddress
      };
      
      // Save to localStorage
      localStorage.setItem(`userProfile_${walletAddress}`, JSON.stringify(newProfile));
      
      // Update state
      setUserProfile(newProfile);
      setUserRole(registrationForm.role);
      
      // Enable demo mode to show role-specific dashboard
      setIsDemoMode(true);
      
      // Create a demo wallet equivalent for the registered user
      const registeredWallet = {
        address: walletAddress,
        name: registrationForm.name,
        role: registrationForm.role,
        privateKey: undefined
      };
      setSelectedDemoWallet(registeredWallet);
      
      // Load demo data for the registered role
      loadDemoData(registrationForm.role);
      
      // Load products from localStorage if any exist
      if (walletAddress) {
        const storedProducts = localStorage.getItem(`oilProducts_${walletAddress}`);
        if (storedProducts) {
          const products = JSON.parse(storedProducts);
          setOilProducts(products);
        }
      }
      
      // Close modal and reset form
      setIsRegistrationModalOpen(false);
      setRegistrationForm({
        role: 'manufacturer',
        name: '',
        location: ''
      });
      
      alert(`✅ Registration successful!\n\nYou are now logged in as: ${registrationForm.name}\nRole: ${registrationForm.role}\n\nYou will now see your role-specific dashboard with available functions.`);
      
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user. Please try again.");
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            setSigner(signer);
            setWalletAddress(walletAddress);
            setIsConnected(true);

            const contract = new ethers.Contract(
              contractAddress,
              Oilube.abi,
              signer
            );

            const contractInstance = contract as OilubeInterface;
            setContract(contractInstance);
            
            // Check user role (this will also check localStorage)
            const detectedRole = await checkUserRole(walletAddress);
            
            // If user has a role, load their products and show dashboard
            if (detectedRole !== 'none') {
              const storedProducts = localStorage.getItem(`oilProducts_${walletAddress}`);
              if (storedProducts) {
                const products = JSON.parse(storedProducts);
                setOilProducts(products);
              } else {
                // Load demo data for their role if no products exist
                loadDemoData(detectedRole);
              }
            }
          }
        } catch (error) {
          console.error("Account access failed:", error);
        }
      } else {
        console.error("MetaMask not detected!");
      }
    };

    connectWallet();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setSigner(null);
        setWalletAddress(null);
        setIsConnected(false);
        setContract(null);
        setUserRole('none');
        setUserProfile(null);
      } else {
        // User switched accounts
        connectWallet();
      }
    };

    // Listen for chain changes
    const handleChainChanged = () => {
      // Reload the page when the chain changes
      window.location.reload();
    };

    // Add event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWithMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log("Attempting to connect to MetaMask...");
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Accounts received:", accounts);
        
        if (accounts.length > 0) {
          console.log("Creating provider...");
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          console.log("Getting signer...");
          const signer = await provider.getSigner();
          
          console.log("Getting wallet address...");
          const walletAddress = await signer.getAddress();
          console.log("Wallet address:", walletAddress);

          // Check network
          const network = await provider.getNetwork();
          console.log("Connected to network:", network);
          
          setSigner(signer);
          setWalletAddress(walletAddress);
          setIsConnected(true);

          console.log("Creating contract instance...");
          // Validate contract address
          if (!ethers.isAddress(contractAddress)) {
            throw new Error("Invalid contract address");
          }
          
          const contract = new ethers.Contract(
            contractAddress,
            Oilube.abi,
            signer
          );

          const contractInstance = contract as OilubeInterface;
          setContract(contractInstance);
          console.log("Contract instance created successfully");
          
          // Check user role after connecting
          const userRoleResult = await checkUserRole(walletAddress);
          console.log("User role:", userRoleResult);
          
          // If user has a role, load their products
          if (userRoleResult !== 'none') {
            const storedProducts = localStorage.getItem(`oilProducts_${walletAddress}`);
            if (storedProducts) {
              const products = JSON.parse(storedProducts);
              setOilProducts(products);
            } else {
              // Load demo data for their role if no products exist
              loadDemoData(userRoleResult);
            }
          }
          
          // Close modal
          setIsWalletModalOpen(false);
          
          // Show success message
          alert(`Successfully connected with MetaMask!\nAddress: ${walletAddress}\nRole: ${userRoleResult === 'none' ? 'Not registered' : userRoleResult}`);
        } else {
          throw new Error("No accounts found");
        }
        
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes("User rejected") || error.message.includes("user rejected")) {
            alert("Connection was rejected. Please try again and approve the connection in MetaMask.");
          } else if (error.message.includes("No accounts found")) {
            alert("No accounts found. Please make sure you have accounts in MetaMask.");
          } else if (error.message.includes("MetaMask is not installed")) {
            alert("MetaMask is not installed! Please install it to use this feature.");
          } else {
            alert(`Failed to connect to MetaMask: ${error.message}`);
          }
        } else {
          alert("Failed to connect to MetaMask. Please try again.");
        }
      }
    } else {
      alert("MetaMask is not installed! Please install it to use this feature.");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setSigner(null);
    setContract(null);
    setUserRole('none');
    setUserProfile(null);
    setIsDemoMode(false);
    setSelectedDemoWallet(null);
    setOilProducts([]);
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

  // Role-specific action handlers
  const handleManufacturerAction = () => {
    handleCreateProduct();
  };



  const handleConsumerAction = () => {
    if (!contract || !walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    alert("Consumer action: Purchase product. This feature will be implemented soon!");
  };

  // Demo wallet functions
  const connectDemoWallet = async (demoWallet: DemoWallet) => {
    try {
      setIsDemoMode(true);
      setSelectedDemoWallet(demoWallet);
      setWalletAddress(demoWallet.address);
      setUserRole(demoWallet.role);
      setIsConnected(true);
      
      // Set user profile based on demo wallet
      const profile: UserProfile = {
        role: demoWallet.role,
        name: demoWallet.name,
        location: demoWallet.role === 'manufacturer' ? 'Texas, USA' : 
                  demoWallet.role === 'middleman' ? 'Singapore' : 'New York, USA',
        address: demoWallet.address
      };
      
      setUserProfile(profile);
      setIsWalletModalOpen(false);
      
      // Load demo data based on role
      loadDemoData(demoWallet.role);
      
      // Load products from blockchain if contract is available
      if (contract) {
        await loadProductsFromBlockchain();
      }
      
      alert(`Connected to demo wallet: ${demoWallet.name}\nRole: ${demoWallet.role}`);
      
    } catch (error) {
      console.error("Error connecting demo wallet:", error);
      alert("Failed to connect demo wallet.");
    }
  };

  const loadDemoData = (role: UserRole) => {
    const demoProducts: OilProduct[] = [
      {
        id: "OIL001",
        name: "Premium Olive Oil",
        description: "Extra virgin olive oil from Mediterranean region",
        location: "Italy",
        manufacturer: "Oil Factory Ltd",
        price: "$25.00",
        status: "manufactured",
        createdAt: "2024-01-15",
        blockchainId: "0x1234567890123456789012345678901234567890123456789012345678901234"
      },
      {
        id: "OIL002", 
        name: "Coconut Oil",
        description: "Pure coconut oil from Philippines",
        location: "Philippines",
        manufacturer: "Oil Factory Ltd",
        price: "$18.00",
        status: "transferred",
        createdAt: "2024-01-10",
        blockchainId: "0x2345678901234567890123456789012345678901234567890123456789012345"
      },
      {
        id: "OIL003",
        name: "Sunflower Oil",
        description: "Natural sunflower oil from Ukraine",
        location: "Ukraine", 
        manufacturer: "Oil Factory Ltd",
        price: "$12.00",
        status: "purchased",
        createdAt: "2024-01-05",
        blockchainId: "0x3456789012345678901234567890123456789012345678901234567890123456"
      }
    ];

    setOilProducts(demoProducts.filter(product => {
      if (role === 'manufacturer') return product.manufacturer === "Oil Factory Ltd";
      if (role === 'middleman') return true; // Show all products for middlemen to transfer
      if (role === 'consumer') return product.status === 'purchased';
      return false;
    }));
  };

  // Function to parse product data from blockchain
  const parseProductDataFromBlockchain = (productNameFromBlockchain: string): Partial<OilProduct> | null => {
    try {
      // Split the product name by | to extract the stored data
      const parts = productNameFromBlockchain.split('|');
      
      if (parts.length >= 6) {
        return {
          name: parts[0],
          description: parts[1],
          location: parts[2],
          price: parts[3],
          manufacturer: parts[4],
          createdAt: new Date(parts[5]).toISOString().split('T')[0]
        };
      }
      
      // If the format is not as expected, return the original name
      return {
        name: productNameFromBlockchain,
        description: "No description available",
        location: "Unknown",
        price: "Unknown",
        manufacturer: "Unknown",
        createdAt: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error("Error parsing product data from blockchain:", error);
      return null;
    }
  };

  // Function to load products from blockchain
  const loadProductsFromBlockchain = async () => {
    if (!contract || !walletAddress) {
      console.log("Contract or wallet not available for loading products");
      return;
    }

    try {
      console.log("Loading products from blockchain...");
      
      // For now, we'll use localStorage to persist products between sessions
      // In a real implementation, you would query the blockchain for all products
      const storedProducts = localStorage.getItem(`oilProducts_${walletAddress}`);
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        setOilProducts(products);
        console.log("Loaded products from localStorage:", products);
      } else {
        console.log("No stored products found");
      }
      
    } catch (error) {
      console.error("Error loading products from blockchain:", error);
    }
  };

  // Function to check product path from blockchain
  const checkProductPath = async (blockchainId: string) => {
    if (!contract) {
      console.log("Contract not available");
      return null;
    }

    try {
      console.log("Checking product path for ID:", blockchainId);
      const pathRecord = await contract.CheckPath(blockchainId);
      console.log("Product path from blockchain:", pathRecord);
      return pathRecord;
    } catch (error) {
      console.error("Error checking product path:", error);
      return null;
    }
  };

  // Function to view product details and blockchain path
  const viewProductDetails = async (product: OilProduct) => {
    if (!product) {
      alert("Product not found.");
      return;
    }

    let pathRecord: string[] = [];
    
    // Try to get path record from blockchain if blockchainId exists
    if (product.blockchainId && contract) {
      try {
        const pathResult = await checkProductPath(product.blockchainId);
        pathRecord = pathResult || [];
      } catch (error) {
        console.error("Error fetching path record:", error);
        pathRecord = [];
      }
    }

    const productDetails = `
📦 Product Details
==================
Name: ${product.name}
Description: ${product.description}
Location: ${product.location}
Manufacturer: ${product.manufacturer}
Price: ${product.price}
Status: ${product.status}
Created: ${product.createdAt}

🔗 Supply Chain Path:
${pathRecord && pathRecord.length > 0 ? pathRecord.join(' -> ') : 'No path recorded yet'}

${product.blockchainId ? `Blockchain ID: ${product.blockchainId}` : 'Not yet stored on blockchain'}
    `;
    
    alert(productDetails);
  };

  const handleCreateProduct = () => {
    console.log("handleCreateProduct called");
    const currentRole = selectedDemoWallet?.role || userRole;
    console.log("Current role:", currentRole);
    
    if (currentRole !== 'manufacturer') {
      alert("This action is only available for manufacturer accounts.");
      return;
    }
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    
    console.log("Opening product modal...");
    setIsProductModalOpen(true);
    alert("Product creation modal should now be open!"); // Debug alert
  };



  const handleReceiveProduct = () => {
    const currentRole = selectedDemoWallet?.role || userRole;
    if (currentRole !== 'middleman') {
      alert("This action is only available for middleman accounts.");
      return;
    }
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsReceiveModalOpen(true);
  };

  const handleSubmitReceive = async () => {
    if (!receiveForm.productId.trim()) {
      alert("Please enter a product ID.");
      return;
    }

    try {
      // Get current wallet address and user details
      const currentWalletAddress = walletAddress || selectedDemoWallet?.address;
      const currentUserProfile = userProfile || {
        role: selectedDemoWallet?.role || 'middleman',
        name: selectedDemoWallet?.name || 'Unknown Middleman',
        location: 'Unknown Location',
        address: currentWalletAddress || ''
      };

      // Store the product reception data
      const receptionData = {
        productId: receiveForm.productId,
        receivedBy: {
          walletAddress: currentWalletAddress,
          name: currentUserProfile.name,
          role: currentUserProfile.role,
          location: currentUserProfile.location
        },
        receivedAt: new Date().toISOString(),
        status: 'received_by_middleman'
      };

      // Save to localStorage for persistence
      const receptionKey = `product_reception_${receiveForm.productId}`;
      localStorage.setItem(receptionKey, JSON.stringify(receptionData));

      // Also save to a general list of received products for this wallet
      const walletReceptionsKey = `wallet_receptions_${currentWalletAddress}`;
      const existingReceptions = JSON.parse(localStorage.getItem(walletReceptionsKey) || '[]');
      existingReceptions.push(receptionData);
      localStorage.setItem(walletReceptionsKey, JSON.stringify(existingReceptions));

      // Try to update blockchain if contract is available and product exists
      if (contract && receiveForm.productId) {
        try {
          console.log("Attempting to receive product on blockchain...");
          const success = await contract.Transfer(currentWalletAddress || '', receiveForm.productId);
          
          if (!success) {
            console.warn("Blockchain transfer failed, but local storage updated");
          } else {
            console.log("Product successfully received on blockchain");
          }
        } catch (error) {
          console.error("Error updating blockchain:", error);
          // Continue with local storage even if blockchain fails
        }
      }

      // Reset form and close modal
      setReceiveForm({ productId: '' });
      setIsReceiveModalOpen(false);

      alert(`✅ Product received successfully!\n\n📦 Product ID: ${receiveForm.productId}\n👤 Received by: ${currentUserProfile.name}\n📍 Wallet Address: ${currentWalletAddress}\n🏢 Role: ${currentUserProfile.role}\n📍 Location: ${currentUserProfile.location}\n\n💾 All data has been stored locally and includes your complete user details.`);

    } catch (error) {
      console.error("Error receiving product:", error);
      alert("Failed to receive product. Please try again.");
    }
  };



  const handlePurchaseProduct = () => {
    const currentRole = selectedDemoWallet?.role || userRole;
    if (currentRole !== 'consumer') {
      alert("This action is only available for consumer accounts.");
      return;
    }
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    alert("Purchase product functionality will be implemented soon!");
  };

  const handleSubmitProduct = async () => {
    alert("Create Product button clicked!"); // Debug alert
    console.log("handleSubmitProduct called");
    console.log("Product form data:", productForm);
    
    if (!productForm.name.trim() || !productForm.description.trim() || 
        !productForm.location.trim() || !productForm.price.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Form validation passed");
    console.log("Contract available:", !!contract);
    console.log("Wallet address:", walletAddress);

    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    // For non-blockchain testing, we can create products locally
    if (!contract) {
      console.log("No contract available, creating product locally only");
      
      try {
        // Create local product object without blockchain integration
        const newProduct: OilProduct = {
          id: `OIL${String(oilProducts.length + 1).padStart(3, '0')}`,
          name: productForm.name,
          description: productForm.description,
          location: productForm.location,
          manufacturer: selectedDemoWallet?.name || userProfile?.name || "Unknown Manufacturer",
          price: productForm.price,
          status: "manufactured",
          createdAt: new Date().toISOString().split('T')[0],
          blockchainId: undefined, // No blockchain ID for local-only products
          pathRecord: []
        };

        console.log("Creating local product:", newProduct);

        setOilProducts(prev => [...prev, newProduct]);
        setProductForm({ name: '', description: '', location: '', price: '' });
        setIsProductModalOpen(false);
        
        // Save to localStorage for persistence
        if (walletAddress) {
          const updatedProducts = [...oilProducts, newProduct];
          localStorage.setItem(`oilProducts_${walletAddress}`, JSON.stringify(updatedProducts));
        }
        
        alert(`✅ Product Created Successfully (Local Only)!\n\n📋 Product Details:\n- Name: ${productForm.name}\n- Description: ${productForm.description}\n- Location: ${productForm.location}\n- Price: ${productForm.price}\n- Manufacturer: ${newProduct.manufacturer}\n\n⚠️ Note: Product created locally. Blockchain connection not available.`);
        
        return;
      } catch (error) {
        console.error("Error creating local product:", error);
        alert("Failed to create product locally. Please try again.");
        return;
      }
    }

    try {
      console.log("Creating product on blockchain...");
      console.log("Contract methods available:", Object.getOwnPropertyNames(contract));
      
      // Create a comprehensive product data string that includes all information
      // This will be stored in the blockchain as the product name
      const productData = {
        name: productForm.name,
        description: productForm.description,
        location: productForm.location,
        price: productForm.price,
        manufacturer: selectedDemoWallet?.name || userProfile?.name || "Unknown Manufacturer",
        timestamp: new Date().toISOString()
      };
      
      // Create a structured product name that includes all the data
      const productNameForBlockchain = `${productForm.name}|${productForm.description}|${productForm.location}|${productForm.price}|${productData.manufacturer}|${productData.timestamp}`;
      
      console.log("Product data to be stored:", productData);
      console.log("Structured product name for blockchain:", productNameForBlockchain);
      console.log("Attempting to call NewInstance with:", walletAddress, productNameForBlockchain);
      
      // Create product on blockchain using NewInstance with structured data
      const productId = await contract.NewInstance(walletAddress, productNameForBlockchain);
      console.log("Raw product ID returned from blockchain:", productId);
      
      console.log("Product created on blockchain with ID:", productId);
      
      // Create local product object with blockchain integration
      const newProduct: OilProduct = {
        id: `OIL${String(oilProducts.length + 1).padStart(3, '0')}`,
        name: productForm.name,
        description: productForm.description,
        location: productForm.location,
        manufacturer: selectedDemoWallet?.name || userProfile?.name || "Unknown Manufacturer",
        price: productForm.price,
        status: "manufactured",
        createdAt: new Date().toISOString().split('T')[0],
        blockchainId: productId,
        pathRecord: [] // Will be populated when needed
      };

      setOilProducts(prev => [...prev, newProduct]);
      setProductForm({ name: '', description: '', location: '', price: '' });
      setIsProductModalOpen(false);
      
      // Save to localStorage for persistence
      if (walletAddress) {
        const updatedProducts = [...oilProducts, newProduct];
        localStorage.setItem(`oilProducts_${walletAddress}`, JSON.stringify(updatedProducts));
      }
      
      alert(`✅ Product Created Successfully!\n\n📋 Product Details:\n- Name: ${productForm.name}\n- Description: ${productForm.description}\n- Location: ${productForm.location}\n- Price: ${productForm.price}\n\n🔗 Blockchain Information:\n- Product ID: ${productId}\n- Manufacturer: ${selectedDemoWallet?.name || userProfile?.name || "Unknown Manufacturer"}\n\n💾 All data has been automatically stored on the blockchain!`);
      
    } catch (error) {
      console.error("Error creating product on blockchain:", error);
      
      // Check if it's a role error
      if (error instanceof Error && error.message.includes("Manufacturer")) {
        alert("❌ Error: Only manufacturers can create products. Please ensure you are using a manufacturer wallet connection.");
      } else {
        alert("❌ Failed to create product on blockchain. Please try again.\n\nError details: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    }
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
            <button onClick={checkItemCode} className="check-button" disabled={isChecking}>
              {isChecking ? 'Checking...' : 'Check Product'}
            </button>
          </div>
          {itemDetails && (
            <div className="modal-overlay" onClick={() => setItemDetails(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setItemDetails(null)} className="close-btn">&times;</button>
                <h2>Product Details</h2>
                <div className="product-details">
                  <p><strong>Path:</strong> {itemDetails.path}</p>
                  <p><strong>Description:</strong> {itemDetails.description}</p>
                  <p><strong>Price:</strong> {itemDetails.price}</p>
                </div>
              </div>
            </div>
          )}
          <div className="header-actions">
            <button className="history-btn" onClick={() => setIsHistoryModalOpen(true)}>
              <span>📋</span>
              <span>History</span>
            </button>
            
            {/* Role-based actions */}
            {isConnected && (
              <>
                {userRole === 'none' ? (
                  <button 
                    className="register-btn" 
                    onClick={() => setIsRegistrationModalOpen(true)}
                  >
                    <span>📝</span>
                    <span>Register Role</span>
                  </button>
                ) : (
                  <>
                    <div className="role-display" data-role={userRole}>
                      <span className="role-badge">{userRole}</span>
                      <span className="user-name">{userProfile?.name || walletAddress?.substring(0, 8)}</span>
                    </div>
                    
                    {/* Role-specific actions */}
                    {userRole === 'manufacturer' && (
                      <button className="action-btn manufacturer-btn" onClick={handleManufacturerAction}>
                        <span>🏭</span>
                        <span>Create Product</span>
                      </button>
                    )}
                    
                    {userRole === 'middleman' && (
                      <button className="action-btn middleman-btn" onClick={handleReceiveProduct}>
                        <span>📥</span>
                        <span>Receive Product</span>
                      </button>
                    )}
                    
                    {userRole === 'consumer' && (
                      <button className="action-btn consumer-btn" onClick={handleConsumerAction}>
                        <span>🛒</span>
                        <span>Purchase Product</span>
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            
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

      {/* Role-Specific Dashboard */}
      {isConnected && ((isDemoMode && selectedDemoWallet) || (!isDemoMode && userRole !== 'none')) && (
        <section className="role-dashboard">
          <div className="container">
            <div className="dashboard-header">
              <h2>Welcome, {selectedDemoWallet?.name || userProfile?.name || 'User'}</h2>
              <div className="dashboard-subtitle">
                <span className="role-badge dashboard-role-badge">{selectedDemoWallet?.role || userRole}</span>
                <span className="dashboard-address">{selectedDemoWallet?.address || walletAddress}</span>
              </div>
            </div>

            {/* Manufacturer Dashboard */}
            {(selectedDemoWallet?.role === 'manufacturer' || userRole === 'manufacturer') && (
              <div className="manufacturer-dashboard">
                <div className="dashboard-actions">
                  <button className="action-btn manufacturer-btn" onClick={handleCreateProduct}>
                    <span>🏭</span>
                    <span>Create New Oil Product</span>
                  </button>
                </div>
                
                <div className="products-section">
                  <h3>My Products</h3>
                  <div className="products-grid">
                    {oilProducts.map((product) => (
                      <div key={product.id} className="product-card" onClick={() => viewProductDetails(product)}>
                        <div className="product-header">
                          <h4>{product.name}</h4>
                          <span className="product-status manufactured">{product.status}</span>
                        </div>
                        <p className="product-description">{product.description}</p>
                        <div className="product-details">
                          <span><strong>Location:</strong> {product.location}</span>
                          <span><strong>Price:</strong> {product.price}</span>
                          <span><strong>Created:</strong> {product.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Middleman Dashboard */}
            {(selectedDemoWallet?.role === 'middleman' || userRole === 'middleman') && (
              <div className="middleman-dashboard">
                <div className="dashboard-actions">
                  <button className="action-btn middleman-btn" onClick={handleReceiveProduct}>
                    <span>📥</span>
                    <span>Receive Product</span>
                  </button>
                </div>
                
                <div className="products-section">
                  <h3>Products I Can Receive</h3>
                  <div className="products-grid">
                    {oilProducts.filter(p => p.status === 'manufactured').map((product) => (
                      <div key={product.id} className="product-card" onClick={() => viewProductDetails(product)}>
                        <div className="product-header">
                          <h4>{product.name}</h4>
                          <span className="product-status manufactured">{product.status}</span>
                        </div>
                        <p className="product-description">{product.description}</p>
                        <div className="product-details">
                          <span><strong>From:</strong> {product.manufacturer}</span>
                          <span><strong>Location:</strong> {product.location}</span>
                          <span><strong>Price:</strong> {product.price}</span>
                          <span><strong>Product ID:</strong> {product.id}</span>
                        </div>
                      </div>
                    ))}
                    {oilProducts.filter(p => p.status === 'manufactured').length === 0 && (
                      <div className="no-products" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b'}}>
                        No manufactured products available to receive. Use the "Receive Product" button above to receive a product by entering its ID.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Consumer Dashboard */}
            {(selectedDemoWallet?.role === 'consumer' || userRole === 'consumer') && (
              <div className="consumer-dashboard">
                <div className="dashboard-actions">
                  <button className="action-btn consumer-btn" onClick={handlePurchaseProduct}>
                    <span>🛒</span>
                    <span>Purchase Product</span>
                  </button>
                </div>
                
                <div className="products-section">
                  <h3>Available Products</h3>
                  <div className="products-grid">
                    {oilProducts.map((product) => (
                      <div key={product.id} className="product-card" onClick={() => viewProductDetails(product)}>
                        <div className="product-header">
                          <h4>{product.name}</h4>
                          <span className="product-status purchased">{product.status}</span>
                        </div>
                        <p className="product-description">{product.description}</p>
                        <div className="product-details">
                          <span><strong>Manufacturer:</strong> {product.manufacturer}</span>
                          <span><strong>Origin:</strong> {product.location}</span>
                          <span><strong>Price:</strong> {product.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Registration Modal */}
      <div className={`registration-modal ${isRegistrationModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Register Role</h2>
            <button className="close-btn" onClick={() => setIsRegistrationModalOpen(false)}>&times;</button>
          </div>
          <div className="registration-form">
            <div className="form-group">
              <label>Select Role:</label>
              <select 
                value={registrationForm.role} 
                onChange={(e) => setRegistrationForm({ ...registrationForm, role: e.target.value as UserRole })}
                className="role-select"
              >
                <option value="manufacturer">Manufacturer</option>
                <option value="middleman">Middleman</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={registrationForm.name}
                onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Your Location:</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={registrationForm.location}
                onChange={(e) => setRegistrationForm({ ...registrationForm, location: e.target.value })}
                className="form-input"
              />
            </div>
            <button onClick={registerUser} className="register-button">
              Register Role
            </button>
          </div>
        </div>
      </div>
      
      {/* Wallet Connection Modal */}
      <div className={`wallet-modal ${isWalletModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Connect Wallet</h2>
            <button className="close-btn" onClick={() => setIsWalletModalOpen(false)}>&times;</button>
          </div>
          
          {/* Demo Wallets Section */}
          <div className="demo-wallets-section">
            <h3>Demo Wallets (For Testing)</h3>
            <div className="demo-wallets-grid">
              {demoWallets.map((wallet) => (
                <div 
                  key={wallet.address} 
                  className="demo-wallet-card"
                  onClick={() => connectDemoWallet(wallet)}
                >
                  <div className="demo-wallet-icon">
                    {wallet.role === 'manufacturer' ? '🏭' : 
                     wallet.role === 'middleman' ? '🔄' : '🛒'}
                  </div>
                  <div className="demo-wallet-info">
                    <h4>{wallet.name}</h4>
                    <p className="demo-wallet-role">{wallet.role}</p>
                    <p className="demo-wallet-address">{wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 6)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="wallet-divider">
            <span>OR</span>
          </div>
          
          <div className="wallet-options">
            <div className="wallet-option" onClick={connectWithMetaMask}>
              <div className="wallet-icon-lg">🦊</div>
              <div className="wallet-info">
                <h3>MetaMask</h3>
                <p>Connect to your MetaMask Wallet</p>
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

      {/* Product Creation Modal */}
      <div className={`product-modal ${isProductModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create New Oil Product</h2>
            <button className="close-btn" onClick={() => setIsProductModalOpen(false)}>&times;</button>
          </div>
          <div className="product-form">
            <div className="form-group">
              <label>Product Name:</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                placeholder="Enter product description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="form-input"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Location/Origin:</label>
              <input
                type="text"
                placeholder="Enter location or origin"
                value={productForm.location}
                onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="text"
                placeholder="Enter price (e.g., $25.00)"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="form-input"
              />
            </div>
            <button onClick={handleSubmitProduct} className="submit-button">
              Create Product
            </button>
          </div>
        </div>
      </div>



      {/* Receive Product Modal */}
      <div className={`receive-modal ${isReceiveModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Receive Product</h2>
            <button className="close-btn" onClick={() => setIsReceiveModalOpen(false)}>&times;</button>
          </div>
          <div className="receive-form">
            <div className="form-group">
              <label>Product ID:</label>
              <input
                type="text"
                placeholder="Enter product ID (e.g., OIL001) or blockchain ID"
                value={receiveForm.productId}
                onChange={(e) => setReceiveForm({ ...receiveForm, productId: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="user-info-display">
              <h4>Your Details (will be stored with the product):</h4>
              <p><strong>Name:</strong> {userProfile?.name || selectedDemoWallet?.name || 'Unknown'}</p>
              <p><strong>Wallet Address:</strong> {walletAddress || selectedDemoWallet?.address || 'Not connected'}</p>
              <p><strong>Role:</strong> {userProfile?.role || selectedDemoWallet?.role || 'middleman'}</p>
              <p><strong>Location:</strong> {userProfile?.location || 'Unknown Location'}</p>
            </div>
            <button onClick={handleSubmitReceive} className="submit-button">
              Receive Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  
}

export default App;