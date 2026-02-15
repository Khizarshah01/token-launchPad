import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSolBalance, getOwnedTokens } from '../utils/token';

function Account() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (!wallet.publicKey) return;
      setLoading(true);

      try {
        const lamport = await getSolBalance(connection, wallet);
        setSolBalance(lamport);
        const tokens = await getOwnedTokens(connection, wallet);
        setAssets(tokens);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [wallet, connection]);

  // Format SOL balance with proper thousands separator
  const formatBalance = (balance) => {
    return balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto mt-20">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Account Overview
            </h1>
            {wallet.publicKey && (
              <div className="px-3 py-1 bg-secondary rounded-full text-xs md:text-sm border border-secondary/50">
                <span className="text-muted-foreground">Connected: </span>
                <span className="font-mono text-primary font-bold">
                  {`${wallet.publicKey.toString().slice(0, 4)}...${wallet.publicKey.toString().slice(-4)}`}
                </span>
              </div>
            )}
          </div>

          {/* Wallet not connected state */}
          {!wallet.publicKey && (
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
              <p className="text-xl text-muted-foreground">Wallet not connected</p>
              <p className="text-muted-foreground/80 mt-2">Connect your wallet to view your assets</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading your assets...</p>
              </div>
            </div>
          )}

          {/* Connected and loaded state */}
          {wallet.publicKey && !loading && (
            <>
              {/* SOL Balance Card */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-muted-foreground">SOL Balance</h2>
                    <p className="text-3xl md:text-4xl font-bold mt-1 text-foreground">
                      {formatBalance(solBalance)} <span className="text-primary">SOL</span>
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center p-2">
                    <img src="/solana.png" alt="Solana" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Tokens Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                  <span className="text-primary">
                    Your Tokens
                  </span>
                  <span className="ml-2 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold">
                    {assets.length} {assets.length === 1 ? 'token' : 'tokens'}
                  </span>
                </h2>

                {assets.length === 0 ? (
                  <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
                    <p className="text-muted-foreground">No tokens found in your wallet</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assets.map((asset) => {
                      const { metadata, publicKey: mint, token, mint: mintInfo } = asset;
                      const amount = Number(token.amount) / 10 ** mintInfo.decimals;
                      const name = metadata.name;
                      const symbol = metadata.symbol;

                      return (
                        <div
                          key={mint.toString()}
                          className="bg-card hover:bg-card/80 transition-all duration-200 p-4 rounded-xl border border-border shadow-sm hover:shadow-md group"
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={asset.imageUrl || '/placeholder-token.png'}
                              alt={name}
                              className="h-12 w-12 rounded-lg object-cover bg-muted border border-border"
                              onError={(e) => {
                                e.target.src = '/placeholder-token.png';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold truncate text-foreground group-hover:text-primary transition-colors">{name}</h3>
                              <p className="text-sm text-muted-foreground">{symbol}</p>
                              <div className="mt-2 flex justify-between items-end">
                                <p className="text-sm font-mono text-muted-foreground/70 truncate max-w-[120px]">
                                  {`${mint.toString().slice(0, 4)}...${mint.toString().slice(-4)}`}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  {amount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;