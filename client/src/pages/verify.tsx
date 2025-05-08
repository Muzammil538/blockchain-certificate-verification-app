import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3Store, Certificate, getCertificate, getCertificateByHash } from '@/lib/web3';
import VerificationResult from '@/components/VerificationResult';
import { Hash, Search, StarHalf } from 'lucide-react';

export default function Verify() {
  const { toast } = useToast();
  const { isConnected } = useWeb3Store();
  const [location] = useLocation();
  
  const [certificateId, setCertificateId] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('id');
  const [searchedId, setSearchedId] = useState<number | null>(null);
  const [searchedHash, setSearchedHash] = useState<string | null>(null);
  
  // Get ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const id = params.get('id');
    if (id && !isNaN(Number(id))) {
      setCertificateId(id);
      setSelectedTab('id');
      // Auto-verify if ID is present in URL
      handleVerifyById();
    }
  }, [location]);
  
  // Query for certificate by ID
  const {
    data: certificateById,
    isLoading: isLoadingById,
    isError: isErrorById,
    error: errorById,
    refetch: refetchById
  } = useQuery({
    queryKey: ['certificate', searchedId],
    queryFn: () => {
      if (searchedId === null) return null;
      return getCertificate(searchedId);
    },
    enabled: searchedId !== null,
    retry: 1
  });
  
  // Query for certificate by Hash
  const {
    data: certificateByHash,
    isLoading: isLoadingByHash,
    isError: isErrorByHash,
    error: errorByHash,
    refetch: refetchByHash
  } = useQuery({
    queryKey: ['certificateHash', searchedHash],
    queryFn: () => {
      if (!searchedHash) return null;
      return getCertificateByHash(searchedHash);
    },
    enabled: searchedHash !== null,
    retry: 1
  });
  
  const handleVerifyById = () => {
    if (!certificateId) {
      toast({
        title: "Validation Error",
        description: "Please enter a certificate ID.",
        variant: "destructive",
      });
      return;
    }
    
    const id = parseInt(certificateId);
    if (isNaN(id)) {
      toast({
        title: "Validation Error",
        description: "Certificate ID must be a number.",
        variant: "destructive",
      });
      return;
    }
    
    setSearchedId(id);
    refetchById();
  };
  
  const handleVerifyByHash = () => {
    if (!ipfsHash) {
      toast({
        title: "Validation Error",
        description: "Please enter an IPFS hash.",
        variant: "destructive",
      });
      return;
    }
    
    setSearchedHash(ipfsHash);
    refetchByHash();
  };
  
  const renderVerificationResults = () => {
    if (selectedTab === 'id') {
      if (isLoadingById) {
        return <div className="py-4 text-center">Verifying certificate...</div>;
      }
      
      if (isErrorById) {
        const errorMessage = errorById instanceof Error ? errorById.message : 'An unknown error occurred';
        return <VerificationResult certificate={null} isVerified={false} error={errorMessage} />;
      }
      
      return <VerificationResult certificate={certificateById} isVerified={!!certificateById} />;
    } else {
      if (isLoadingByHash) {
        return <div className="py-4 text-center">Verifying certificate...</div>;
      }
      
      if (isErrorByHash) {
        const errorMessage = errorByHash instanceof Error ? errorByHash.message : 'An unknown error occurred';
        return <VerificationResult certificate={null} isVerified={false} error={errorMessage} />;
      }
      
      return <VerificationResult certificate={certificateByHash} isVerified={!!certificateByHash} />;
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Verify Certificate</h2>
            </div>
            
            <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="id">By Certificate ID</TabsTrigger>
                <TabsTrigger value="hash">By IPFS Hash</TabsTrigger>
              </TabsList>
              
              <TabsContent value="id" className="mt-0">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <StarHalf className="text-primary mr-2 h-5 w-5" />
                    <span>Certificate ID Verification</span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Enter the numeric certificate ID to verify authenticity.</p>
                  <div className="flex">
                    <Input
                      type="number"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="Certificate ID (e.g., 42)"
                      className="flex-grow rounded-r-none"
                    />
                    <Button 
                      onClick={handleVerifyById}
                      className="rounded-l-none"
                      disabled={isLoadingById}
                    >
                      {isLoadingById ? "Verifying..." : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="hash" className="mt-0">
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Hash className="text-accent mr-2 h-5 w-5" />
                    <span>IPFS Hash Verification</span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Enter the IPFS CID hash to verify certificate authenticity.</p>
                  <div className="flex">
                    <Input
                      type="text"
                      value={ipfsHash}
                      onChange={(e) => setIpfsHash(e.target.value)}
                      placeholder="IPFS CID Hash"
                      className="flex-grow rounded-r-none"
                    />
                    <Button 
                      onClick={handleVerifyByHash}
                      className="rounded-l-none bg-accent hover:bg-purple-700"
                      disabled={isLoadingByHash}
                    >
                      {isLoadingByHash ? "Verifying..." : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Verification Results */}
            {(searchedId !== null || searchedHash !== null) && renderVerificationResults()}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
