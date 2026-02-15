import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { createFungibleToken } from "../utils/token";

function TokenCreation() {
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        supply: '',
        decimals: '9',
        uri: null
    });

    const [loading, setLoading] = useState(false);
    const { connection } = useConnection();
    const wallet = useWallet();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitData = async (e) => {
        e.preventDefault();
        const { name, symbol, supply, decimals, uri } = formData;
        if (!name || !symbol || !supply || !decimals) {
            alert("Please fill out all fields");
            return;
        }
        const finalUri = uri || "https://cdn.100xdevs.com/metadata.json";

        try {
            setLoading(true);
            const res = await createFungibleToken(
                { ...formData, uri: finalUri },
                connection,
                wallet
            );
            alert(`Token created: ${res}`);
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-card rounded-xl p-8 border border-border shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-primary">
                        Create Token
                    </h2>
                    <p className="text-muted-foreground mt-2 text-center">
                        Deploy your own SPL token on the Solana blockchain
                    </p>
                </div>

                <form onSubmit={submitData} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Token Name</label>
                            <div className="relative">
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. My Awesome Token"
                                    className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Symbol</label>
                            <div className="relative">
                                <input
                                    name="symbol"
                                    type="text"
                                    value={formData.symbol}
                                    onChange={handleChange}
                                    placeholder="e.g. MAT"
                                    className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase placeholder:text-muted-foreground/50"
                                    required
                                    maxLength="6"
                                    style={{ textTransform: 'uppercase' }}
                                />
                                <span className="absolute right-3 top-3.5 text-xs text-muted-foreground">{6 - formData.symbol.length} left</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Total Supply</label>
                            <div className="relative">
                                <input
                                    name="supply"
                                    type="number"
                                    value={formData.supply}
                                    onChange={handleChange}
                                    placeholder="e.g. 1000000000"
                                    className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">Decimals</label>
                            <div className="relative">
                                <select
                                    name="decimals"
                                    value={formData.decimals}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="6">6 (Default for most tokens)</option>
                                    <option value="9">9 (Like SOL)</option>
                                    <option value="0">0 (NFT-like)</option>
                                    <option value="2">2 (Stablecoin-like)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Metadata URI (Optional)</label>
                        <div className="relative">
                            <input
                                name="uri"
                                type="text"
                                value={formData.uri || ''}
                                placeholder="https://yourdomain.com/metadata.json"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Leave blank to use default metadata or provide a URL to your JSON file
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !wallet.publicKey}
                            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${loading || !wallet.publicKey
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {!wallet.publicKey ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Connect Wallet First</span>
                                </>
                            ) : loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating Token...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                    </svg>
                                    <span>Create Token</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TokenCreation;