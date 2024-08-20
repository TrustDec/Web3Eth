import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const Phantom: React.FC = () => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const connect = async () => {
    try {
      if (window.solana?.isPhantom) {
        const response = await window.solana.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
      } else {
        alert('没有安装Phantom');
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    console.log('Disconnected');
  };

  useEffect(() => {
    if (window.solana?.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true })
        .then(response => {
          setPublicKey(new PublicKey(response.publicKey.toString()));
        })
        .catch(error => {
          console.log("Error:", error);
        });
      window.solana.on('disconnect', () => {
        console.log('Wallet disconnected');
        disconnect();
      });
      return () => {
        window.solana?.removeAllListeners('disconnect');
      };
    }
  }, []);

  return (
    <div className="App">
      {publicKey ? (
        <>
          <p>Connected account: {publicKey.toString()}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Phantom Wallet</button>
      )}
    </div>
  );
};

export default Phantom;
