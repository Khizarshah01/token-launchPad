import './App.css'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import TokenCreation from './pages/TokenCreation';
import { BrowserRouter, Routes, Route } from "react-router";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Account from './components/Account';
function App() {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/create-token' element={<TokenCreation />} />
              <Route path='/account' element={<Account/>}/>
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App