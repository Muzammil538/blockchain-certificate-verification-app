import { useEffect } from 'react';
import { useWeb3Store } from '@/lib/web3';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectWalletProps {
  isMobile?: boolean;
}

export default function ConnectWallet({ isMobile = false }: ConnectWalletProps) {
  const { toast } = useToast();
  const { isConnected, isConnecting, account, connect, disconnect } = useWeb3Store();

  useEffect(() => {
    // Check if previously connected
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress && !isConnected && !isConnecting) {
        try {
          await connect();
        } catch (error) {
          console.error('Auto-connect error:', error);
        }
      }
    };
    
    checkConnection();
  }, [isConnected, isConnecting, connect]);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your MetaMask wallet has been connected successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const displayAddress = account 
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : 'Connect Wallet';

  if (isConnected) {
    return (
      <Button
        onClick={handleDisconnect}
        size={isMobile ? "default" : "sm"}
        className={`${isMobile ? "w-full" : ""} bg-green-600 hover:bg-green-700`}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {displayAddress}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      size={isMobile ? "default" : "sm"}
      className={isMobile ? "w-full" : ""}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
