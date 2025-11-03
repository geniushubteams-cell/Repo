'use client';

import { useEffect } from 'react';

// Custom hook to initialize security script on any page
export default function useSecurity() {
  useEffect(() => {
    // Execute security script immediately with high priority
    const executeSecurityScript = async () => {
      try {
        // Import and run security script with immediate execution
        const securityModule = await import('./script.js');
        // Security script runs automatically on import
        if (securityModule.default && typeof securityModule.default === 'function') {
          securityModule.default();
        }
      } catch (error) {
        console.error('Security script failed to load:', error);
      }
    };
    
    // Execute immediately without delay
    executeSecurityScript();
  }, []); // Empty dependency array ensures it runs only once on mount
}
