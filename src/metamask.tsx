import { ethers } from "ethers";
import "./App.css";
import { useState, useEffect } from "react";

function MetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connect = async () => {
    setErrorMessage(null); 
    try {
      if (window.ethereum == null) {
        setErrorMessage("MetaMask 没有安装.");
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const addr = accounts[0];
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        setAccount(addr);
        console.log("addr:", addr);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        setErrorMessage("please try again.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      } else {
        setErrorMessage("Error: " + error.message);
      }
      console.error("Error:", error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setErrorMessage(null);
    console.log('Disconnected');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          console.log("请连接MetaMask.");
          setAccount(null);
        } else {
          setAccount(accounts[0]);
          console.log( accounts[0]);
        }
      });
      return () => {
        window.ethereum.removeListener("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            console.log("请连接MetaMask.");
            setAccount(null);
          } else {
            setAccount(accounts[0]);
            console.log( accounts[0]);
          }
        });
      };
    }
  }, []);

  return (
    <div className="App">
      <p>
        {account ? (
          <>
            <span>Connected Account: {account}</span>
            <button onClick={disconnect}>Disconnect Wallet</button>
          </>
        ) : (
          <button onClick={connect}>Connect MetaMask Wallet</button>
        )}
      </p>
      {errorMessage && (
        <p style={{ color: 'red' }}>
          {errorMessage} <button onClick={connect} disabled={errorMessage.includes("rejected")}>Retry</button>
        </p>
      )}
    </div>
  );
}

export default MetaMask;
