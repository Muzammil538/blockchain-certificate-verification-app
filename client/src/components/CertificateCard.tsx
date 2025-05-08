import { Link } from 'wouter';
import { Certificate } from '@/lib/web3';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import { getIPFSUrl } from '@/lib/ipfs';

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const { id, studentName, courseName, ipfsHash, date } = certificate;
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Generate IPFS URL for the certificate PDF
  const pdfUrl = getIPFSUrl(ipfsHash);

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ID: {id}
          </span>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-500">Student Name</div>
          <div className="font-medium">{studentName}</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-500">Issue Date</div>
          <div className="font-medium">{formatDate(date)}</div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/verify?id=${id}`} className="inline-flex items-center text-sm font-medium text-primary hover:text-blue-700">
            <Search className="mr-1 h-4 w-4" /> Verify
          </Link>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FileText className="mr-1 h-4 w-4" /> View PDF
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
