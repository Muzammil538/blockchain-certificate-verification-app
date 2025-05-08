// Public IPFS gateway options (all free to use)
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
];

// Get current gateway or use default
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || IPFS_GATEWAYS[0];

// Upload file to IPFS using a direct API approach (browser-compatible)
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Check if Pinata credentials are available
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY || '';
    const pinataApiSecret = import.meta.env.VITE_PINATA_API_SECRET || '';
    
    // Try uploading with Pinata first if credentials exist
    if (pinataApiKey && pinataApiSecret) {
      try {
        return await uploadToPinata(file, pinataApiKey, pinataApiSecret);
      } catch (err) {
        console.warn('Pinata upload failed, trying fallback', err);
      }
    }
    
    // Fallback to free methods if Pinata is not configured or fails
    return await uploadToIPFSViaFetch(file);
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS. Please check your internet connection or try again later.');
  }
}

// Upload to Pinata using direct API calls (browser-compatible)
async function uploadToPinata(file: File, apiKey: string, apiSecret: string): Promise<string> {
  // Create form data for Pinata
  const formData = new FormData();
  
  // Add timestamp to filename to ensure uniqueness
  const timestamp = Date.now();
  const newFileName = `${timestamp}-${file.name}`;
  
  // Add the file to form data
  formData.append('file', file, newFileName);
  
  // Add metadata
  const metadata = JSON.stringify({
    name: newFileName,
  });
  formData.append('pinataMetadata', metadata);
  
  // Make request to Pinata API
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': apiKey,
      'pinata_secret_api_key': apiSecret,
    },
    body: formData,
  });
  
  // Check if request was successful
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata Error (${response.status}): ${errorText}`);
  }
  
  // Parse the response
  const data = await response.json();
  return data.IpfsHash;
}

// Fallback upload method using free public IPFS API
async function uploadToIPFSViaFetch(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Try using nft.storage's free API (no authentication required)
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload to NFT.Storage failed');
    }
    
    const data = await response.json();
    return data.value.cid;
  } catch (error) {
    console.error('Error with fallback IPFS upload:', error);
    throw new Error('Failed to upload to IPFS. Please check your internet connection or try again later.');
  }
}

// Get IPFS URL from CID
export function getIPFSUrl(cid: string, fileName?: string): string {
  if (fileName) {
    return `${IPFS_GATEWAY}${cid}/${encodeURIComponent(fileName)}`;
  }
  return `${IPFS_GATEWAY}${cid}`;
}

// Retrieve a file from IPFS
export async function retrieveFromIPFS(cid: string): Promise<any> {
  try {
    // Try fetching from multiple gateways in case one fails
    for (const gateway of IPFS_GATEWAYS) {
      try {
        const url = `${gateway}${cid}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const blob = await response.blob();
          return new File([blob], `file-${cid}`, { type: blob.type });
        }
      } catch (e) {
        console.warn(`Failed to fetch from gateway ${gateway}`, e);
        // Continue to next gateway
      }
    }
    
    throw new Error(`Failed to retrieve ${cid} from any IPFS gateway`);
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
}
