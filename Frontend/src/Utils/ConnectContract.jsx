import { ethers } from "ethers";
import StakeFitABI from "./StakeFitABI.json"

const CONTRACT_ADDRESS = "0x3ede6BAAF2724Cdffd6C1A5312f5a153c64D2C41";

export const getEthereumObject = () => {
  if (window.ethereum) {
    return window.ethereum;
  } else {
    alert("Please install MetaMask to continue!");
    return null;
  }
};

export const connectContract = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) return null;

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, StakeFitABI, signer);

    console.log("Connected to contract:", contract);
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return null;
  }
};
