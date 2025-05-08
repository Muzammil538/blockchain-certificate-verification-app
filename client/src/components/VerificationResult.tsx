import { Certificate } from '@/lib/web3';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Copy, Eye, FileText, Shield } from 'lucide-react';
import { getIPFSUrl } from '@/lib/ipfs';
import { useToast } from '@/hooks/use-toast';

interface VerificationResultProps {
  certificate: Certificate | null;
  isVerified: boolean;
  error?: string;
}

export default function VerificationResult({ certificate, isVerified, error }: VerificationResultProps) {
  const { toast } = useToast();
  
  if (error) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!certificate || !isVerified) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Certificate verification failed. The certificate could not be found or is invalid.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Generate IPFS URL for the certificate PDF
  const pdfUrl = getIPFSUrl(certificate.ipfsHash);
  
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description,
    });
  };

  return (
    <div className="mt-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Certificate verified successfully!
            </p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Certificate Details</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Student Name</h4>
                <p className="mt-1 text-base font-medium text-gray-900">{certificate.studentName}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Course Name</h4>
                <p className="mt-1 text-base font-medium text-gray-900">{certificate.courseName}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Issue Date</h4>
                <p className="mt-1 text-base font-medium text-gray-900">{formatDate(certificate.date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">IPFS Hash</h4>
                <div className="mt-1 flex items-center">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded overflow-x-auto max-w-[80%]">
                    {certificate.ipfsHash}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(certificate.ipfsHash, "IPFS hash copied to clipboard")}
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-primary hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center w-full">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">Certificate PDF</p>
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  <Eye className="mr-1 h-3 w-3" /> View Certificate
                </a>
              </div>
              <div>
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Shield className="mr-1 h-3 w-3 text-green-500" /> Blockchain Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
