import { useState } from "react";
import { connectMetaMask } from "../Utils/ConnectWallet";

const ConnectWallet = () => {
  const [account, setAccount] = useState("Connect Wallet");
  
  const truncateAddress = (address) => {
    if (!address || address === "Connect Wallet") return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleconnect = async () => {
    const walletAddress = await connectMetaMask();
    setAccount(walletAddress);
  };

  return (
    <button 
      onClick={handleconnect} 
      className="connect-wallet px-4 py-2 bg-[#512E8B] text-white rounded-full hover:bg-[#3a1d66] transition-colors max-w-[180px] truncate font-mono"
    >
      {truncateAddress(account)}
    </button>
  );
};

export default ConnectWallet;