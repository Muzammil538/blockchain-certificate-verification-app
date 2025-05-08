import { Link } from 'react-router'

export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Blockchain Certificate Verification
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Securely issue and verify certificates on the blockchain. Tamper-proof and transparent.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/upload"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
        >
          Issue Certificate
        </Link>
        <Link
          to="/verify"
          className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition"
        >
          Verify Certificate
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-3xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Upload Certificate</h3>
            <p className="text-gray-600">
              Institutions can upload certificate details to the blockchain.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-3xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Get Unique ID</h3>
            <p className="text-gray-600">
              Each certificate gets a unique blockchain ID for verification.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-3xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Verify Anytime</h3>
            <p className="text-gray-600">
              Anyone can verify the authenticity of certificates using the ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}