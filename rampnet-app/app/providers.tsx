'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  console.log('Providers - Initializing with App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID)
  
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Ultra minimal config
        appearance: {
          theme: 'light',
          accentColor: '#7c3aed',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}