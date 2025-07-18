import { useContext } from "react";
import { SolanaChainContext } from "../context/SolanaChainContext"; // Make sure path is correct

export const useSolanaChain = () => {
    const context = useContext(SolanaChainContext);
    if (!context) {
        throw new Error("useSolanaChain must be used within a SolanaChainProvider");
    }
    return context;
};