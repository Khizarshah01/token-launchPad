import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createAndMint, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import { mplTokenMetadata, fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";


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
    amount: Number((supply * (10 ** decimals))),
    tokenOwner: umi.identity.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  return mintSigner.publicKey.toString();
}



/**
 * Initializes UMI instance
 */
function getUmi(connection, walletAdapter) {
  return createUmi(connection.rpcEndpoint)
    .use(walletAdapterIdentity(walletAdapter))
    .use(mplTokenMetadata())
    .use(mplToolbox());
}

/**
 * Fetch SOL balance
 */
export async function getSolBalance(connection, walletAdapter) {
  if (!walletAdapter.connected || !walletAdapter.publicKey) {
    throw new Error("Wallet not connected");
  }

  const lamports = await connection.getBalance(walletAdapter.publicKey);
  const sol = lamports / 1e9; 
  return sol.toFixed(3);
}

/**
 * Fetch all Digital Assets owned by user
 */
export async function getOwnedTokens(connection, walletAdapter) {
  if (!walletAdapter.connected || !walletAdapter.publicKey) {
    throw new Error("Wallet not connected");
  }

  const umi = getUmi(connection, walletAdapter);
  const rawAssets = await fetchAllDigitalAssetWithTokenByOwner(umi, walletAdapter.publicKey);

  const parsedAssets = await Promise.all(
    rawAssets.map(async (asset) => {
      const metadata = asset.metadata || {};
      const uri = metadata.uri || "";

      let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg600Xa4ws6jp54kMDNGYF232lIhY51QJqEA&s";

      try {
        if (uri) {
          const resolvedUri = resolveUri(uri);
          const res = await fetch(resolvedUri);
          const json = await res.json();
          const rawImage = json.image || "";
          imageUrl = rawImage ? resolveUri(rawImage) : imageUrl;
        }
      } catch (err) {
        console.warn("Error loading image metadata for:", metadata?.name || "Unknown", err);
      }

      return {
        ...asset,
        imageUrl,
        metadata: {
          name: metadata?.name || "Unknown Token",
          symbol: metadata?.symbol || "UNK",
          uri,
        },
      };
    })
  );

  return parsedAssets;
}

function resolveUri(uri) {
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (uri.startsWith("ar://")) {
    return uri.replace("ar://", "https://arweave.net/");
  }
  return uri;
}
