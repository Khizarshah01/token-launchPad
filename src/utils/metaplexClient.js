import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl, Connection } from '@solana/web3.js';

export const umi = createUmi(clusterApiUrl('mainnet-beta'));
