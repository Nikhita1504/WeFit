import { useContext, useEffect, useState } from "react";
import { connectMetaMask } from "../Utils/ConnectWallet";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import walletcontext from "../context/walletcontext";
import { connectContract } from "../Utils/ConnectContract";
import Contractcontext from "../context/contractcontext";

const ConnectWallet = () => {
  const { account, Setaccount, balance, Setbalance } = useContext(walletcontext);
  const { JwtToken } = useAuth();
  const { Setcontract } = useContext(Contractcontext);

  const truncateAddress = (address) => {
    if (!address || address === "Connect Wallet") return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleconnect = async () => {
    const { account, Balance } = await connectMetaMask();
    Setaccount(account);
    Setbalance(Balance);
    const contract = await connectContract();
    Setcontract(contract);
    console.log(contract);
  };

  const updateWalletAddress = async () => {
    if (!JwtToken || account === "Connect Wallet") return;

    try {
      const payload = jwtDecode(JwtToken);
      console.log("Decoded JWT:", payload);

      await axios.put(
        `http://localhost:3000/api/users/updateWallet/${payload.email}`,
        {
          walletAddress: account,
        }
      );

      console.log("Wallet address updated");
    } catch (error) {
      console.error("Error updating wallet address:", error);
    }
  };

  useEffect(() => {
    updateWalletAddress();
  }, [account]);

  return (
    <div className="flex items-center justify-end gap-3 ml-auto"> {/* Added ml-auto and justify-end */}
      {/* Wallet Address Button */}
      <button
        onClick={handleconnect}
        className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center bg-amber-300
          ${account === "Connect Wallet" 
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
            : "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"}
        `}
      >
        {account === "Connect Wallet" ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {truncateAddress(account)}
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            {truncateAddress(account)}
          </>
        )}
      </button>

      {/* Balance Indicator */}
      {account !== "Connect Wallet" && (
        <div className="px-3 py-2 bg-gray-800 rounded-full text-sm font-medium text-white flex items-center">
          <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          ₹{Math.floor(balance * 156697).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;