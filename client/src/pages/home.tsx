import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CheckCircle, Database, Upload, Search } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/StepCard';

export default function Home() {
  return (
    <>
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient">
              Secure Certificate Verification with Blockchain
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Issue, store, and verify educational certificates using blockchain technology for tamper-proof credential management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/upload">
                  <Upload className="h-5 w-5" /> Upload Certificate
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/verify">
                  <Search className="h-5 w-5" /> Verify Certificate
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <FeatureCard
              icon={Shield}
              title="Immutable Records"
              description="Store certificates on blockchain with tamper-proof security and permanent accessibility."
              iconClass="feature-icon-primary"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Instant Verification"
              description="Verify certificates in seconds with a simple search using the certificate ID or IPFS hash."
              iconClass="feature-icon-secondary"
            />
            <FeatureCard
              icon={Database}
              title="Decentralized Storage"
              description="Store certificate PDFs on IPFS for distributed, permanent, and decentralized access."
              iconClass="feature-icon-accent"
            />
          </div>

          {/* How It Works Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <StepCard
                number={1}
                title="Upload Certificate"
                description="Upload certificate details and PDF document to be stored on the blockchain and IPFS."
                className="step-1"
              />
              
              <div className="hidden md:block text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div className="block md:hidden text-gray-300 my-2">
                <ArrowRight className="h-6 w-6 transform rotate-90" />
              </div>
              
              <StepCard
                number={2}
                title="Blockchain Storage"
                description="Certificate metadata is stored on Polygon blockchain while the PDF is stored on IPFS."
                className="step-2"
              />
              
              <div className="hidden md:block text-gray-300">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div className="block md:hidden text-gray-300 my-2">
                <ArrowRight className="h-6 w-6 transform rotate-90" />
              </div>
              
              <StepCard
                number={3}
                title="Verify Anytime"
                description="Search for certificates using the certificate ID or IPFS hash to instantly verify authenticity."
                className="step-3"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
