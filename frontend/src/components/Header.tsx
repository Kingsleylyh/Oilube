import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <span className="ml-3 text-2xl font-bold text-green-800">OILUBE</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by barcode or product..."
              className="w-full py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={handleConnect}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            isConnected 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isConnected ? (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;