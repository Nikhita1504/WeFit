
export const connectMetaMask = async () => {
  try {
    if (!window.ethereum) {
      console.error("MetaMask is not installed. Please install it to continue.");
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (accounts.length > 0) {
      console.log("Connected account:", accounts[0]);
      return accounts[0];
    } else {
      console.error("No accounts found.");
      return null;
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
};
