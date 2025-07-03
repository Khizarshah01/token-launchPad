import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createAndMint, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

/**
 * Creates and mints a fungible token using Metaplex.
 * @param {object} formData { name, symbol, uri, supply, decimals }
 * @param {Connection} connection
 * @param {WalletAdapter} walletAdapter
 * @returns {string} new mint public key
 */
export async function createFungibleToken(formData, connection, walletAdapter) {
  if (!walletAdapter.connected || !walletAdapter.publicKey) {
    throw new Error("Wallet not connected");
  }

  const umi = createUmi(connection.rpcEndpoint)
    .use(walletAdapterIdentity(walletAdapter))
    .use(mplTokenMetadata())
    .use(mplToolbox()); 

  const mintSigner = generateSigner(umi);
  const { name, symbol, uri, supply, decimals } = formData;

  await createAndMint(umi, {
    mint: mintSigner,
    authority: umi.identity,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: Number(decimals),
    amount: Number((supply*(10**decimals))),
    tokenOwner: umi.identity.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  return mintSigner.publicKey.toString();
}
