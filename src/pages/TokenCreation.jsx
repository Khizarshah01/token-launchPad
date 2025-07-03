import React, { useState } from 'react';
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { createFungibleToken } from "../utils/token";

function TokenCreation() {
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        supply: '',
        decimals: '',
        uri: ''
    });
    
        const [loding, setLoading] = useState(false);
        const { connection } = useConnection();
        const walletAdapter = useWallet();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const submitData = async () => {
        const { name, symbol, supply, decimals, uri } = formData;
        if (!name || !symbol || !supply || !decimals || !uri) {
            alert("Please fill out all fields before submitting");
            return;
        }
        else {
            try {
            setLoading(true);
                const res = await createFungibleToken(formData, connection, walletAdapter);
                alert("Token created");
            } catch (error) {
                console.log(error);
            alert(error);
            } finally {
                setLoading(false);
            }
            // toast logi please fill full info before click
        }
    }

    return (
        <div>
            <h1>Create Your Own Token</h1>
         
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
                            <WalletMultiButton />
                            <WalletDisconnectButton />
                        </div>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: 'auto' }}>
                            <input name="name" type="text" placeholder="Token Name" onChange={handleChange} />
                            <input name="symbol" type="text" placeholder="Symbol (e.g. KHZR)" onChange={handleChange} />
                            <input name="supply" type="number" placeholder="Supply (e.g. 1000000)" onChange={handleChange} />
                            <input name="decimals" type="number" placeholder="Decimals (e.g. 9)" onChange={handleChange} />
                            <input name="uri" type="text" placeholder="Metadata URI" onChange={handleChange} />
                            <button onClick={submitData} type='button'>
                            {loding? "Createing....":"Create TOken"}
                            </button>
                        </form>
        </div>
    );
}

export default TokenCreation;
