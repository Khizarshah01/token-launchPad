import { Link, useLocation } from 'react-router-dom';
import { IconButton, Tooltip, Separator, Flex } from '@radix-ui/themes';
import React from 'react';
import { CiHome, CiCoinInsert, CiImageOn, CiUser } from 'react-icons/ci';


const navBackground = {
  backgroundColor: 'hsla(0, 0%, 100%, 0.12)',
  backdropFilter: 'blur(12px)',
  border: '1px solid hsla(0, 0%, 100%, 0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
};

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: '/', icon: <CiHome className="w-6 h-6" />, tooltip: 'Home' },
    { to: '/token', icon: <CiCoinInsert className="w-6 h-6" />, tooltip: 'Token' },
    { to: '/nft', icon: <CiImageOn className="w-6 h-6" />, tooltip: 'NFT' },
    { to: '/account', icon: <CiUser className="w-6 h-6" />, tooltip: 'Account' },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        style={navBackground}
        className="rounded-full w-[90vw] max-w-[400px] px-4 py-2 flex items-center justify-between shadow-md border dark:border-white/20"
      >
        <Flex align="center" justify="between" gap="2" className="w-full">
          {navItems.map(({ to, icon, tooltip }) => (
            <Tooltip key={to} content={tooltip}>
              <Link to={to}>
                <IconButton variant="ghost" className="hover:bg-gray-200/30 dark:hover:bg-gray-800/50">
                  {React.cloneElement(icon, {
                    className: `w-6 h-6 ${currentPath === to ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'}`
                  })}
                </IconButton>
              </Link>
            </Tooltip>
          ))}
        </Flex>
      </div>
    </nav>
  );
};

export default Navbar;
