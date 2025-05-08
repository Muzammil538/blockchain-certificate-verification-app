
import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { abi } from '../contracts' // Import your contract ABI here

export default function Upload() {
  const [formData, setFormData] = useState({
    recipientName: '',
    courseName: '',
    issueDate: '',
    certificateHash: ''
  })
  
  const { writeContract, isPending, isSuccess, error } = useWriteContract()
  const { isConnected } = useAccount()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected) return alert('Please connect your wallet')
    
    writeContract({
      address: '0xYourContractAddress',
      abi,
      functionName: 'issueCertificate',
      args: [
        formData.recipientName,
        formData.courseName,
        formData.issueDate,
        formData.certificateHash
      ],
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Issue Certificate</h1>

      <form onSubmit={ handleSubmit } className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="recipientName">
            Recipient Name
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={ formData.recipientName }
            onChange={ handleChange }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="courseName">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={ formData.courseName }
            onChange={ handleChange }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="issueDate">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={ formData.issueDate }
            onChange={ handleChange }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="certificateHash">
            Certificate File Hash
          </label>
          <input
            type="text"
            id="certificateHash"
            name="certificateHash"
            value={ formData.certificateHash }
            onChange={ handleChange }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="SHA-256 hash of the certificate file"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isPending ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {isPending ? 'Processing...' : 'Issue Certificate'}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          Certificate issued successfully!
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          Error: {error.shortMessage || error.message}
        </div>
      )}
    </div>
  )
}