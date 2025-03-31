import { useState } from "react";
import { connectMetaMask } from "../Utils/ConnectWallet";

const ConnectWallet = () => {
  const[account , Setaccount] = useState("Connect Wallet")
  const handleconnect = async () =>{
    Setaccount( await connectMetaMask());
   }
  return <button onClick={handleconnect} className="connect-wallet">{account}</button>;
};

export default ConnectWallet;
