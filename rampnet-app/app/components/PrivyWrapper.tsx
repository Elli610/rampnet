'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'

interface PrivyWrapperProps {
  children: React.ReactNode
  loadingComponent?: React.ReactNode
}

export default function PrivyWrapper({ 
  children, 
  loadingComponent 
}: PrivyWrapperProps) {
  const { ready, authenticated, user } = usePrivy()
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  // Debug logs and timeout
  useEffect(() => {
    console.log('PrivyWrapper - App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID)
    console.log('PrivyWrapper - Privy state:', { ready, authenticated, user })
    
    // Add debug timeout
    const timeout = setTimeout(() => {
      if (!ready) {
        setDebugInfo('Privy taking longer than expected. Check your App ID or try refreshing.')
        console.error('Privy initialization timeout - App ID might be invalid')
      }
    }, 10000) // 10 seconds
    
    return () => clearTimeout(timeout)
  }, [ready, authenticated, user])

  // Ensure component is mounted before showing content
  useEffect(() => {
    setMounted(true)
    console.log('PrivyWrapper - Component mounted')
  }, [])

  // Show loading state if not mounted or Privy not ready
  if (!mounted || !ready) {
    return (
      loadingComponent || (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">Initializing RampNet...</p>
            <p className="text-xs text-gray-400 mb-1">
              Mounted: {mounted ? 'Yes' : 'No'} | Ready: {ready ? 'Yes' : 'No'}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              App ID: {process.env.NEXT_PUBLIC_PRIVY_APP_ID ? 'Set' : 'Missing'}
            </p>
            {debugInfo && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-xs text-yellow-800">
                {debugInfo}
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-xs text-primary-600 hover:text-primary-700 underline"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    )
  }

  console.log('PrivyWrapper - Rendering children')
  return <>{children}</>
}