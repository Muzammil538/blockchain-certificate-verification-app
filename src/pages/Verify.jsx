import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function Verify() {
  const [certificateId, setCertificateId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (certificateId.trim()) {
      navigate(`/display/${certificateId}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Verify Certificate</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="certificateId">
              Certificate ID
            </label>
            <input
              type="text"
              id="certificateId"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter the certificate ID or transaction hash"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary-dark font-medium"
          >
            Verify Certificate
          </button>
        </form>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to verify</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Enter the certificate ID or transaction hash in the field above</li>
            <li>Click "Verify Certificate"</li>
            <li>View the certificate details and verification status</li>
          </ol>
        </div>
      </div>
    </div>
  )
}