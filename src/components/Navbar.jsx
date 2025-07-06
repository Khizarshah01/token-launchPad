import { Link, useLocation } from 'react-router-dom';
import { Home, Coins, Image, User } from 'lucide-react';
import { BiCoinStack } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaChain } from "../hooks/useSolanaChain";
import { useDarkMode } from "../hooks/useDarkMode";

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/create-token', label: 'Tokens', icon: Coins },
  { to: '/account', label: 'Account', icon: User },
];

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isDevnet, toggleChain } = useSolanaChain();
  const { isDarkMode } = useDarkMode();

  return (
    <motion.header
      className="absolute top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-white/30 dark:bg-black/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/token.png" className='h-8 w-8' alt="image" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">GenisisToken</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  currentPath === to
                    ? 'text-black dark:text-white'
                    : 'text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Devnet Button */}
          <button
            onClick={toggleChain}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md text-gray-600 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isDevnet ? 'bg-green-400' : 'bg-red-400'
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isDevnet ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </span>
            Devnet
          </button>

          {/* Wallet Connect */}
          <WalletMultiButton
            style={{
              backgroundColor: 'transparent',
              color: isDarkMode ? '#ffffff' : '#000000',
              padding: '2px 16px',
              borderColor: '#d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          />
        </div>
      </div>

      {/* Mobile Navigation (optional) */}
      <div className="md:hidden px-4 py-2 border-t dark:border-gray-700 bg-white dark:bg-black">
        <div className="flex justify-between">
          {navItems.map(({ to, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300">
              <Icon className={`w-5 h-5 mb-1 ${currentPath === to ? 'text-black dark:text-white' : ''}`} />
              {to.slice(1).charAt(0).toUpperCase() + to.slice(2)}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
