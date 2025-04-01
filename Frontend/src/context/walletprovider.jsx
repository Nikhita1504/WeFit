import React, { useState } from "react";
import walletcontext from "./walletcontext";

const Walletprovider = ({ children }) => {
  const [account, Setaccount] = useState("Connect Wallet");

  return (
    <walletcontext.Provider value={{ account, Setaccount }}>
      {children}
    </walletcontext.Provider>
  );
};

export default Walletprovider;
