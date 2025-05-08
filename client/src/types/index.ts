// Add TypeScript declarations for the window object
declare global {
  interface Window {
    ethereum: any;
  }
}

// Export empty object to make this a module
export {};
