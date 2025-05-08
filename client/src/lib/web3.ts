import { ethers } from 'ethers';
import { create } from 'zustand';
import CertificateRegistryABI from '../contracts/CertificateRegistry.json';

// Replace with the deployed contract address for Mumbai Testnet
const CERTIFICATE_REGISTRY_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: string | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWeb3Store = create<Web3State>((set) => ({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  contract: null,
  isConnected: false,
  isConnecting: false,
  
  connect: async () => {
    if (!window.ethereum) {
      alert('MetaMask not installed! Please install MetaMask first.');
      return;
    }
    
    try {
      set({ isConnecting: true });
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const { chainId } = await provider.getNetwork();
      
      // Check if connected to Polygon Mumbai
      if (chainId.toString() !== '80001') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // Mumbai testnet
          });
        } catch (error: any) {
          // If the chain is not added, we add it
          if (error.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
                },
              ],
            });
          } else {
            throw error;
          }
        }
      }
      
      // Create contract instance
      const contract = new ethers.Contract(
        CERTIFICATE_REGISTRY_ADDRESS,
        CertificateRegistryABI.abi,
        signer
      );
      
      set({
        provider,
        signer,
        account,
        chainId: chainId.toString(),
        contract,
        isConnected: true,
        isConnecting: false,
      });
      
      // Setup event listeners for account and chain changes
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      set({ isConnecting: false });
    }
  },
  
  disconnect: () => {
    set({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      contract: null,
      isConnected: false,
    });
  },
}));

// Types for certificate data
export interface Certificate {
  id: number;
  studentName: string;
  courseName: string;
  ipfsHash: string;
  date: number;
}

// Function to add a certificate
export async function addCertificate(
  studentName: string,
  courseName: string,
  ipfsHash: string,
  date: number
): Promise<string> {
  const { contract } = useWeb3Store.getState();
  
  if (!contract) {
    throw new Error('Contract not initialized. Please connect your wallet.');
  }
  
  try {
    const tx = await contract.addCertificate(studentName, courseName, ipfsHash, date);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
}

// Function to get a certificate by index
export async function getCertificate(index: number): Promise<Certificate> {
  const { contract } = useWeb3Store.getState();
  
  if (!contract) {
    throw new Error('Contract not initialized. Please connect your wallet.');
  }
  
  try {
    const result = await contract.getCertificate(index);
    return {
      id: index,
      studentName: result[0],
      courseName: result[1],
      ipfsHash: result[2],
      date: Number(result[3])
    };
  } catch (error) {
    console.error('Error getting certificate:', error);
    throw error;
  }
}

// Function to get a certificate by IPFS hash
export async function getCertificateByHash(ipfsHash: string): Promise<Certificate | null> {
  const { contract } = useWeb3Store.getState();
  
  if (!contract) {
    throw new Error('Contract not initialized. Please connect your wallet.');
  }
  
  try {
    const totalCertificates = await getTotalCertificates();
    
    for (let i = 0; i < totalCertificates; i++) {
      const cert = await getCertificate(i);
      if (cert.ipfsHash === ipfsHash) {
        return cert;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting certificate by hash:', error);
    throw error;
  }
}

// Function to get total certificates
export async function getTotalCertificates(): Promise<number> {
  const { contract } = useWeb3Store.getState();
  
  if (!contract) {
    throw new Error('Contract not initialized. Please connect your wallet.');
  }
  
  try {
    const result = await contract.getTotalCertificates();
    return Number(result);
  } catch (error) {
    console.error('Error getting total certificates:', error);
    throw error;
  }
}

// Function to get all certificates
export async function getAllCertificates(): Promise<Certificate[]> {
  const { contract } = useWeb3Store.getState();
  
  if (!contract) {
    throw new Error('Contract not initialized. Please connect your wallet.');
  }
  
  try {
    const totalCertificates = await getTotalCertificates();
    const certificates: Certificate[] = [];
    
    for (let i = 0; i < totalCertificates; i++) {
      const cert = await getCertificate(i);
      certificates.push(cert);
    }
    
    return certificates;
  } catch (error) {
    console.error('Error getting all certificates:', error);
    throw error;
  }
}
