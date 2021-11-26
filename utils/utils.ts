import { PublicKey } from '@solana/web3.js';
import { programIds } from './programIds';

export const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
export const METADATA_PREFIX = 'metadata';

export type StringPublicKey = string;

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey,
) => {
  const result = await PublicKey.findProgramAddress(seeds, programId);
  return [result[0].toBase58(), result[1]] as [string, number];
}

export async function getMetadataAddress(
  tokenMint: string,
): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();
  const metadataProgramId = PROGRAM_IDS.metadata;
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        (new PublicKey(metadataProgramId)).toBuffer(),
        (new PublicKey(tokenMint)).toBuffer(),
      ],
      new PublicKey(metadataProgramId),
    )
  )[0];
}

const PubKeysInternedMap = new Map<string, PublicKey>();

export const toPublicKey = (key: string | PublicKey) => {
  if (typeof key !== 'string') {
    return key;
  }

  let result = PubKeysInternedMap.get(key);
  if (!result) {
    result = new PublicKey(key);
    PubKeysInternedMap.set(key, result);
  }

  return result;
};