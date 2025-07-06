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
        if (!uri) {
            setFormData(prev => ({
                ...prev,
                uri: "https://raw.githubusercontent.com/Khizarshah01/token-launchPad/refs/heads/main/testing.md"
            }));
        }
        try {
            setLoading(true);
            const res = await createFungibleToken(formData, connection, wallet);
            alert(`Token created: ${res}`);
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-3xl bg-[#1f1f2b] border border-gray-800 rounded-xl p-10 shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-[#14f195]">Create Your Solana Token</h2>

                <form onSubmit={submitData} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Token Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. My Token"
                            className="w-full px-4 py-3 bg-[#2b2b3c] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#14f195] focus:border-[#14f195] outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Symbol</label>
                        <input
                            name="symbol"
                            type="text"
                            value={formData.symbol}
                            onChange={handleChange}
                            placeholder="e.g. MTK"
                            className="w-full px-4 py-3 bg-[#2b2b3c] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#14f195] focus:border-[#14f195] outline-none"
                            required
                            maxLength="6"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Total Supply</label>
                            <input
                                name="supply"
                                type="number"
                                value={formData.supply}
                                onChange={handleChange}
                                placeholder="e.g. 1000000"
                                className="w-full px-4 py-3 bg-[#2b2b3c] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#14f195] focus:border-[#14f195] outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Decimals</label>
                            <input
                                name="decimals"
                                type="number"
                                value={formData.decimals}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#2b2b3c] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#14f195] focus:border-[#14f195] outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Token Image</label>
                        <input
                            name="uri"
                            type="text"
                            value={formData.uri}
                            placeholder="Optional: Link to metadata.json"
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#2b2b3c] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-[#14f195] focus:border-[#14f195] outline-none"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${loading
                            ? 'bg-[#14f195]/50 cursor-not-allowed'
                            : 'bg-[#14f195] text-black hover:bg-[#0de186]'
                            }`}
                    >
                        {loading ? 'Creating...' : 'Create Token'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TokenCreation;
