import React from 'react';
import Aurora from '../components/Aura/Aurora';
import { TokenIcon } from '@web3icons/react';
import { TokenPEPE } from '@web3icons/react'
import { WalletPhantom, WalletBackpack } from '@web3icons/react';

function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden dark:bg-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#9945FF", "#14F195", "#9935FF"]}
          blend={0.3}
          amplitude={0.5}
          speed={0.5}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-8xl font-bold text-white">GenesisToken</h1>
        <p className="mt-4 text-xl text-gray-400">
          The premier platform for minting and managing your custom crypto tokens with unparalleled simplicity.
        </p>

        <button className="
          mt-10 
          dark:bg-white dark:text-black 
          bg-black text-white
          rounded-2xl 
          px-6 py-3
          h-12
          font-medium
          transition-all 
          duration-300
          transform
          hover:scale-105
          hover:shadow-lg
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white
          shadow-md
          hover:bg-opacity-90
        ">
          Get Started
        </button>

        {/* Scattered Icons Section */}
       <div className="relative w-full h-64 mt-20">
        <div className="absolute left-[10%] top-[10%] hover:animate-shake transition-all">
          <TokenIcon symbol="sol" variant="branded" size={62} />
        </div>
        <div className="absolute left-[25%] top-[30%] hover:animate-shake transition-all">
          <WalletPhantom variant="branded" size={62} />
        </div>
        <div className="absolute left-[15%] top-[65%] hover:animate-shake transition-all">
          <WalletBackpack variant="branded" size={62} />
        </div>
        <div className="absolute left-[35%] top-[15%] hover:animate-shake transition-all">
          <TokenIcon symbol="usdc" variant="branded" size={62} />
        </div>
        <div className="absolute left-[43%] top-[35%] hover:animate-shake transition-all">
          <TokenIcon symbol="bcat" variant="branded" size={62} />
        </div>
        <div className="absolute left-[60%] top-[20%] hover:animate-shake transition-all">
          <TokenIcon symbol="pepe" variant="branded" size={62} />
        </div>
        <div className="absolute left-[70%] top-[60%] hover:animate-shake transition-all">
          <TokenIcon symbol="jup" variant="branded" size={62} />
        </div>
        <div className="absolute left-[80%] top-[35%] hover:animate-shake transition-all">
          <TokenIcon symbol="rndr" variant="branded" size={62} />
        </div>
        <div className="absolute left-[85%] top-[70%] hover:animate-shake transition-all">
          <TokenIcon symbol="popcat" variant="branded" size={62} />
        </div>
        <div className="absolute left-[50%] top-[70%] hover:animate-shake transition-all">
          <TokenIcon symbol="link" variant="branded" size={62} />
        </div>
      </div >
      </div>
    </div >
  );
}

export default Home;
