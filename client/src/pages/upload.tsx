import { useState } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Store, addCertificate } from '@/lib/web3';
import { uploadToIPFS } from '@/lib/ipfs';
import { Upload as UploadIcon, AlertTriangle, CheckCircle, Copy, FileText, Search } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  studentName: z.string().min(2, { message: 'Student name must be at least 2 characters' }),
  courseName: z.string().min(2, { message: 'Course name must be at least 2 characters' }),
  certificateDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date',
  }),
  certificatePDF: z.instanceof(FileList).refine(files => files.length === 1, {
    message: 'Please select a PDF file',
  }).transform(files => files[0] as File).refine(
    (file) => file.type === 'application/pdf',
    {
      message: 'Only PDF files are allowed',
    }
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    {
      message: 'File size should be less than 10MB',
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function Upload() {
  const { toast } = useToast();
  const { isConnected } = useWeb3Store();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [certificateId, setCertificateId] = useState<number | null>(null);
  const [ipfsCid, setIpfsCid] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      courseName: '',
      certificateDate: new Date().toISOString().split('T')[0],
      certificatePDF: undefined,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet to upload certificates.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('Preparing your certificate for upload...');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Upload PDF to IPFS
      setUploadStatus('Uploading file to IPFS...');
      const file = data.certificatePDF;
      const cid = await uploadToIPFS(file);
      setIpfsCid(cid);
      
      setUploadStatus('Storing metadata on blockchain...');
      
      // Convert date to Unix timestamp
      const dateTimestamp = Math.floor(new Date(data.certificateDate).getTime() / 1000);
      
      // Add certificate to blockchain
      const txHash = await addCertificate(
        data.studentName,
        data.courseName,
        cid,
        dateTimestamp
      );
      
      setUploadStatus('Finalizing transaction...');
      
      // Get the certificate ID (latest index)
      // In a real implementation, we would get this from the transaction event
      // For now, we'll just use a mock ID
      const mockId = Math.floor(Math.random() * 1000);
      setCertificateId(mockId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Show success message
      setTimeout(() => {
        setUploadSuccess(true);
        setIsUploading(false);
        form.reset();
      }, 500);
      
      toast({
        title: "Upload Successful",
        description: "Your certificate has been successfully stored on the blockchain.",
      });
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description,
    });
  };

  // Show selected filename
  const [selectedFileName, setSelectedFileName] = useState('');
  form.watch((data) => {
    const files = data.certificatePDF as unknown as FileList;
    if (files && files.length > 0) {
      setSelectedFileName(files[0].name);
    }
  });
  
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <UploadIcon className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Upload Certificate</h2>
            </div>
            
            {/* Wallet Connection Status */}
            {!isConnected && (
              <Alert className="mb-6 bg-amber-100 border-amber-500">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  Please connect your MetaMask wallet to upload certificates.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Upload Form */}
            {!uploadSuccess && !isUploading && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certificateDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certificatePDF"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Certificate PDF</FormLabel>
                        <FormControl>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <FileText className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700 focus-within:outline-none">
                                  <span>Upload a file</span>
                                  <Input
                                    id="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...field}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF up to 10MB</p>
                              {selectedFileName && (
                                <p className="text-sm text-gray-800 font-medium mt-2">
                                  {selectedFileName}
                                </p>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={!isConnected}>
                    <UploadIcon className="mr-2 h-4 w-4" /> Upload Certificate to Blockchain
                  </Button>
                </form>
              </Form>
            )}
            
            {/* Upload Status/Progress */}
            {isUploading && (
              <div className="mt-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-blue-200">
                        Uploading to IPFS
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">{uploadStatus}</p>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {uploadSuccess && (
              <div className="mt-6">
                <Alert className="mb-4 bg-green-100 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Certificate uploaded successfully!
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 mr-2">IPFS CID:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ipfsCid}</code>
                    <Button
                      onClick={() => copyToClipboard(ipfsCid, "IPFS CID copied to clipboard")}
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-primary hover:text-blue-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 mr-2">Certificate ID:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{certificateId}</code>
                    <Button
                      onClick={() => copyToClipboard(certificateId?.toString() || "", "Certificate ID copied to clipboard")}
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-primary hover:text-blue-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/verify?id=${certificateId}`}>
                      <Search className="mr-2 h-4 w-4" /> Verify This Certificate
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
