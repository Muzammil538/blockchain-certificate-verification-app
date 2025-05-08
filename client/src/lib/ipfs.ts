import { Web3Storage } from 'web3.storage';

const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN || '';

// Create a Web3Storage client
function getClient() {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error('Web3Storage token not found. Please set VITE_WEB3_STORAGE_TOKEN in .env file.');
  }
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
}

// Upload file to IPFS
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const client = getClient();
    
    // Add timestamp to filename to ensure uniqueness
    const timestamp = Date.now();
    const newFileName = `${timestamp}-${file.name}`;
    const fileWithTimestamp = new File([file], newFileName, { type: file.type });
    
    // Upload the file to Web3.Storage
    const rootCid = await client.put([fileWithTimestamp], {
      name: newFileName,
      onRootCidReady: (cid) => {
        console.log('Root CID:', cid);
      },
      onStoredChunk: (bytes) => {
        console.log(`Stored ${bytes.toLocaleString()} bytes`);
      },
    });
    
    return rootCid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

// Get IPFS URL from CID
export function getIPFSUrl(cid: string, fileName?: string): string {
  if (fileName) {
    return `https://${cid}.ipfs.dweb.link/${fileName}`;
  }
  return `https://${cid}.ipfs.dweb.link`;
}

// Retrieve a file from IPFS
export async function retrieveFromIPFS(cid: string): Promise<any> {
  try {
    const client = getClient();
    const res = await client.get(cid);
    
    if (!res?.ok) {
      throw new Error(`Failed to get ${cid}`);
    }
    
    const files = await res.files();
    return files[0];
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
}
