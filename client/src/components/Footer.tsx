import { Link } from 'wouter';
import { IdCard, Github, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <IdCard className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">CertChain</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors duration-200">
              Upload
            </Link>
            <Link href="/verify" className="text-gray-300 hover:text-white transition-colors duration-200">
              Verify
            </Link>
            <Link href="/certificates" className="text-gray-300 hover:text-white transition-colors duration-200">
              Certificates
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CertChain. All rights reserved.
          </p>
          <div className="flex mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white mr-4">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white mr-4">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
