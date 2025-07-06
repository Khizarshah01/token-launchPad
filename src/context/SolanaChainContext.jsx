import { createContext, useState, useContext } from "react";

export const SolanaChainContext = createContext();

export const SolanaChainProvider = ({ children }) => {
  const [isDevnet, setIsDevnet] = useState(true);
  
  const toggleChain = () => {
    setIsDevnet(prev => !prev);
  };

  return (
    <SolanaChainContext.Provider value={{ isDevnet, toggleChain }}>
      {children}
    </SolanaChainContext.Provider>
  );
};

