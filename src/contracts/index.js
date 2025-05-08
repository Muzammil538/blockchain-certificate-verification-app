// src/contracts/index.js
export const abi = [
  {
    "inputs": [
      {"internalType": "string", "name": "recipientName", "type": "string"},
      {"internalType": "string", "name": "courseName", "type": "string"},
      {"internalType": "string", "name": "issueDate", "type": "string"},
      {"internalType": "string", "name": "certificateHash", "type": "string"}
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "getCertificate",
    "outputs": [
      {"internalType": "string", "name": "recipientName", "type": "string"},
      {"internalType": "string", "name": "courseName", "type": "string"},
      {"internalType": "string", "name": "issueDate", "type": "string"},
      {"internalType": "string", "name": "certificateHash", "type": "string"},
      {"internalType": "address", "name": "issuer", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const contractAddress = '0x123...' // your deployed contract address