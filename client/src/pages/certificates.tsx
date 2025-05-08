import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertTriangle, IdCard, Search } from 'lucide-react';
import { useWeb3Store, getAllCertificates, Certificate as CertificateType } from '@/lib/web3';
import CertificateCard from '@/components/CertificateCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Certificates() {
  const { isConnected } = useWeb3Store();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Query for all certificates
  const {
    data: certificates,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['certificates'],
    queryFn: getAllCertificates,
    enabled: isConnected,
    staleTime: 60000, // 1 minute
  });
  
  // Trigger refetch when wallet connects
  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected, refetch]);
  
  // Filter certificates based on search query and date filter
  const filteredCertificates = certificates?.filter(cert => {
    // Search filter
    const searchMatch = 
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return searchMatch;
  }) || [];
  
  // Sort certificates based on date filter
  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (dateFilter === 'latest') {
      return b.date - a.date;
    } else if (dateFilter === 'oldest') {
      return a.date - b.date;
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedCertificates.length / itemsPerPage);
  const paginatedCertificates = sortedCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Create pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Maximum 5 page links
    const maxVisiblePages = 5;
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Loading skeletons
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    ));
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-10">
          <IdCard className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">All Certificates</h2>
        </div>
        
        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="max-w-3xl mx-auto mb-6">
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                Please connect your MetaMask wallet to view all certificates.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto mb-8">
          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="certificateSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Certificates
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="certificateSearch"
                    type="text"
                    className="pl-10"
                    placeholder="Search by name or course"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-40">
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="dateFilter">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : isError ? (
            <div className="col-span-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load certificates.'}
                </AlertDescription>
              </Alert>
            </div>
          ) : paginatedCertificates.length > 0 ? (
            paginatedCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <IdCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Certificates Found</h3>
              <p className="text-gray-500">
                {!isConnected ? 'Connect your wallet to view certificates.' : 
                  searchQuery ? 'Try a different search term.' : 'No certificates have been issued yet.'}
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
