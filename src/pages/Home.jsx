import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getSolBalance } from '../utils/token';

// Pre-calculated particle data to avoid Math.random() during render
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + (i % 6), // More deterministic than Math.random()
  top: (i * 5) % 100,
  left: (i * 7) % 100,
  animationDuration: 10 + (i % 15),
  animationDelay: i % 5
}));

function Home() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { connection } = useConnection();
  const wallet = useWallet();

  // Airdrop state
  const [airdropAddress, setAirdropAddress] = useState('');
  const [airdropAmount, setAirdropAmount] = useState(1);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);
  const [airdropError, setAirdropError] = useState('');
  const [lamport, setLamport] = useState('');

  useEffect(() => {
    if (isInView) {
      controls.start("visible");

      const fetchBalance = async () => {
        const balance = await getSolBalance(connection, wallet);
        setLamport(balance);
      };

      fetchBalance();
    }
  }, [isInView, controls, wallet.connected, wallet.publicKey]);


  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleAirdrop = async () => {
    if (!airdropAddress) {
      setAirdropError('Please enter a valid Solana address');
      return;
    }

    try {
      setIsAirdropping(true);
      setAirdropError('');
      setAirdropSuccess(false);

      const publicKey = new PublicKey(airdropAddress);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const signature = await connection.requestAirdrop(
        publicKey,
        airdropAmount * LAMPORTS_PER_SOL
      );

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');
      setAirdropSuccess(true);
    } catch (error) {
      console.error('Airdrop failed:', error);
      setAirdropError(error.message);
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#0a0a2a] to-[#1a0635]">
      {/* Optimized Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animation: `float ${particle.animationDuration}s linear infinite`,
              animationDelay: `${particle.animationDelay}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center"
      >
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white bg-clip-text bg-gradient-to-r from-white to-blue-200 leading-tight"
        >
          Genesis<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Token</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl"
        >
          The most intuitive platform to create, launch and manage your crypto tokens.
          Powered by Solana for blazing fast transactions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Link to="/create-token">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              Launch Token Now
            </motion.button>
          </Link>

    <Link to="/account">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 text-lg font-medium text-white bg-transparent border-2 border-white/20 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
            Manage Tokens
          </motion.button>
            </Link>
        </motion.div>


        {/* Airdrop Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 w-full max-w-6xl p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Devnet Airdrop
            </h3>
            {wallet.publicKey && (
              <div className="mt-2 md:mt-0 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-600">
                <span className="text-sm text-gray-300">Balance: </span>
                <span className="font-mono text-green-400">
                  {lamport ? `${lamport} SOL` : 'Loading...'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Solana Address
              </label>
              <input
                type="text"
                value={airdropAddress}
                onChange={(e) => setAirdropAddress(e.target.value)}
                placeholder="Enter Solana address"
                className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Amount (SOL)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <button
              onClick={handleAirdrop}
              disabled={isAirdropping}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${isAirdropping
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                }`}
            >
              {isAirdropping ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Airdropping...
                </span>
              ) : (
                'Request Airdrop'
              )}
            </button>

            {airdropError && (
              <div className="text-red-400 text-sm mt-2">{airdropError}</div>
            )}

            {airdropSuccess && (
              <div className="text-green-400 text-sm mt-2">
                Success! {airdropAmount} SOL airdropped to your address.
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4">
              Note: This airdrop only works on Solana Devnet. You can switch networks in your wallet.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Static gradient orb (no animation) */}
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-[100px] -z-10" />
    </div>
  );
}

export default Home;