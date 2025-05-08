import { useParams } from 'react-router'
import { useReadContract } from 'wagmi'
import { abi, contractAddress } from '../contracts' // You'll need your contract ABI here

export default function Display() {
  const { id } = useParams()
  
  // Mock contract read - replace with your actual contract details
  const { 
    data, 
    isError, 
    isLoading, 
    error 
  } = useReadContract({
    address: '0xYourContractAddress',
    abi,
    functionName: 'getCertificate',
    args: [id],
  })


  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Certificate Details</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {isLoading ? (
          <p className="text-center py-8">Loading certificate data...</p>
        ) : isError || !data ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg mb-4">Certificate not found</p>
            <p className="text-gray-600">
              The certificate ID "{id}" does not exist or the contract could not be queried.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 font-medium">This certificate is valid and verified on the blockchain</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Certificate Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Recipient Name</p>
                    <p className="text-lg font-medium">{data.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course Name</p>
                    <p className="text-lg font-medium">{data.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="text-lg font-medium">{new Date(data.issueDate * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Blockchain Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Certificate ID</p>
                    <p className="text-lg font-mono break-all">{id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issuer Address</p>
                    <p className="text-lg font-mono break-all">{data.issuer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Hash</p>
                    <p className="text-lg font-mono break-all">{data.certificateHash}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Verification Note</h3>
              <p className="text-gray-600">
                This certificate has been permanently recorded on the Ethereum blockchain. 
                The information displayed here is immutable and can be trusted as authentic.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}