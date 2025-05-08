import { Link } from 'react-router'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          CertVerify
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-primary">
            Home
          </Link>
          <Link to="/upload" className="text-gray-600 hover:text-primary">
            Upload
          </Link>
          <Link to="/verify" className="text-gray-600 hover:text-primary">
            Verify
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}