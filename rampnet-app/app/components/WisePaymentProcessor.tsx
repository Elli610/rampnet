'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  QrCode,
  Clock,
  AlertCircle,
  Copy,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import { Chain, Token } from '../../config/chains';

export interface TransferData {
  amount: number;
  usdAmount: number;
  recipientAddress: string;
  selectedChain: Chain;
  selectedToken: Token;
  exchangeRate: number;
  fees: {
    wiseFee: number;
    networkFee: number;
    protocolFee: number;
  };
}

interface WisePaymentProcessorProps {
  transferData: TransferData;
  onBack: () => void;
  onComplete: (result: unknown) => void;
}

type PaymentStep =
  | 'qr_display'
  | 'payment_pending'
  | 'processing'
  | 'completed'
  | 'failed';

export default function WisePaymentProcessor({
  transferData,
  onBack,
}: WisePaymentProcessorProps) {
  console.log('WisePaymentProcessor mounted with data:', transferData);

  const [currentStep, setCurrentStep] = useState<PaymentStep>('qr_display');
  const [paymentReference, setPaymentReference] = useState('');
  const [isLoadingReference, setIsLoadingReference] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Générer la référence de paiement via l'API
  useEffect(() => {
    const getMemoFromAPI = async () => {
      try {
        setIsLoadingReference(true);
        setHasApiError(false);

        const apiPayload = {
          usdAmount: transferData.usdAmount,
          address: transferData.recipientAddress,
          currency: transferData.selectedToken.symbol,
          network: transferData.selectedChain.chainId,
        };
        console.log('Transfer data:', transferData);
        console.log('Calling /api/memo with:', apiPayload);

        const response = await fetch('/api/memo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data.success && data.memo) {
          setPaymentReference(data.memo);
          setHasApiError(false);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Failed to get memo from API:', error);
        setHasApiError(true);
        setPaymentReference('');
      } finally {
        setIsLoadingReference(false);
      }
    };

    getMemoFromAPI();
  }, [transferData]);

  const retryGetMemo = async () => {
    setIsLoadingReference(true);
    setHasApiError(false);

    try {
      const apiPayload = {
        usdAmount: transferData.usdAmount,
        address: transferData.recipientAddress,
        currency: transferData.selectedToken.symbol,
        network: transferData.selectedChain.chainId,
      };

      console.log('Retrying /api/memo with:', apiPayload);

      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Retry API response:', data);

      if (data.success && data.memo) {
        setPaymentReference(data.memo);
        setHasApiError(false);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Retry failed to get memo from API:', error);
      setHasApiError(true);
      setPaymentReference('');
    } finally {
      setIsLoadingReference(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const checkPaymentStatus = async () => {
    try {
      console.log('Checking payment status for memo:', paymentReference);

      const response = await fetch('/api/check/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memo: paymentReference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment check failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment check response:', data);

      if (data.success && data.status === 'confirmed') {
        setIsCheckingPayment(false);
        setCurrentStep('completed');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Payment check error:', error);
      return false;
    }
  };

  const startPaymentPolling = () => {
    let attempts = 0;
    const maxAttempts = 6; // 6 attempts * 10 seconds = 1 minute

    const interval = setInterval(async () => {
      attempts++;
      setCheckAttempts(attempts);

      console.log(`Payment check attempt ${attempts}/${maxAttempts}`);
      const paymentConfirmed = await checkPaymentStatus();

      if (paymentConfirmed) {
        clearInterval(interval);
        setPollInterval(null);
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPollInterval(null);
        setIsCheckingPayment(false);
        setPaymentTimeout(true);
      }
    }, 10000); // Check every 10 seconds

    setPollInterval(interval);
  };

  const handlePaymentConfirmation = () => {
    setCurrentStep('payment_pending');
    setIsCheckingPayment(true);
    setPaymentTimeout(false);
    setCheckAttempts(0);
    startPaymentPolling();
  };

  const retryPaymentCheck = () => {
    // Clean up existing interval if any
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }

    setPaymentTimeout(false);
    setIsCheckingPayment(true);
    setCheckAttempts(0);
    startPaymentPolling();
  };

  const renderQRStep = () => {
    return (
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
            <QrCode className='w-8 h-8 text-blue-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Scan to Pay with Wise
          </h2>
          <p className='text-gray-600'>
            Use the Wise app to scan this QR code and complete your payment
          </p>
        </div>

        {/* QR Code */}
        <div className='flex justify-center'>
          <div className='bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg'>
            <Image
              src='/qr_wise_payment.png'
              alt='Wise Payment QR Code'
              width={192}
              height={192}
              className='w-48 h-48 rounded-lg'
            />
          </div>
        </div>

        {/* Transfer Summary */}
        <div className='bg-blue-50 rounded-xl p-6 space-y-4'>
          <h3 className='font-semibold text-blue-900 mb-4'>Transfer Summary</h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-blue-700'>Amount to send:</span>
              <span className='font-semibold'>
                ${transferData.usdAmount.toFixed(2)} USD
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-blue-700'>You will receive:</span>
              <span className='font-semibold'>
                {transferData.amount.toFixed(6)}{' '}
                {transferData.selectedToken.symbol}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-blue-700'>Network:</span>
              <span className='font-semibold'>
                {transferData.selectedChain.name}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-blue-700'>Recipient:</span>
              <span className='font-mono text-xs'>
                {transferData.recipientAddress.slice(0, 8)}...
                {transferData.recipientAddress.slice(-6)}
              </span>
            </div>
            <div className='flex justify-between border-t border-blue-200 pt-2'>
              <span className='text-blue-700'>Reference:</span>
              <div className='flex items-center gap-2 min-w-0 flex-1 ml-2'>
                {isLoadingReference ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                    <span className='text-sm text-blue-600'>Generating...</span>
                  </div>
                ) : hasApiError ? (
                  <button
                    onClick={retryGetMemo}
                    className='text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors'
                  >
                    Retry
                  </button>
                ) : (
                  <div className='flex items-center gap-2 min-w-0 flex-1'>
                    <span className='font-mono font-semibold text-red-600 text-xs break-all flex-1'>
                      {paymentReference}
                    </span>
                    <button
                      onClick={() => copyToClipboard(paymentReference)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all duration-200 ${
                        copySuccess
                          ? 'bg-green-100 text-green-700'
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <svg
                            className='w-3 h-3'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className='w-3 h-3' />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4'>
          <div className='flex gap-3'>
            <AlertCircle className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
            <div className='text-sm text-amber-800'>
              <p className='font-medium mb-1'>Important:</p>
              {isLoadingReference ? (
                <p>Please wait while we generate your payment reference...</p>
              ) : hasApiError ? (
                <p>
                  Failed to generate payment reference. Please click Retry to
                  try again.
                </p>
              ) : (
                <p>
                  <b>
                    Make sure to include the reference in your Wise transfer.
                    This ensures your payment is processed correctly and tokens
                    are sent to the right address.
                  </b>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onBack}
            className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </button>
          <button
            onClick={handlePaymentConfirmation}
            disabled={hasApiError || isLoadingReference}
            className='flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
          >
            I&apos;ve sent the payment
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentPendingStep = () => (
    <div className='space-y-6 text-center'>
      <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto'>
        {isCheckingPayment ? (
          <div className='w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin'></div>
        ) : (
          <Clock className='w-8 h-8 text-yellow-600' />
        )}
      </div>

      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          {paymentTimeout
            ? 'Payment Taking Longer Than Expected'
            : 'Payment Confirmation Pending'}
        </h2>
        <p className='text-gray-600'>
          {paymentTimeout
            ? 'Your payment is taking longer than usual to process. Please wait or try checking again.'
            : "We're waiting for your Wise payment to be confirmed. This usually takes 1-3 minutes."}
        </p>
      </div>

      <div className='bg-blue-50 rounded-xl p-6'>
        <div className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-blue-700'>Payment Reference:</span>
            <span className='font-mono font-semibold text-xs break-all flex-1 ml-2 text-right'>
              {paymentReference}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-blue-700'>Expected Amount:</span>
            <span className='font-semibold'>
              ${transferData.usdAmount.toFixed(2)} USD
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-blue-700'>Status:</span>
            {isCheckingPayment ? (
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin'></div>
                <span className='text-yellow-600 font-medium'>
                  Checking payment... (Attempt {checkAttempts}/6)
                </span>
              </div>
            ) : paymentTimeout ? (
              <span className='text-orange-600 font-medium'>
                Timeout - Payment not found
              </span>
            ) : (
              <span className='text-gray-600 font-medium'>
                Waiting for confirmation
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='bg-gray-50 rounded-xl p-4'>
        <p className='text-sm text-gray-600'>
          Your tokens will be automatically sent to{' '}
          <span className='font-mono font-medium'>
            {transferData.recipientAddress.slice(0, 8)}...
            {transferData.recipientAddress.slice(-6)}
          </span>{' '}
          on {transferData.selectedChain.name} once the payment is confirmed.
        </p>
      </div>

      <div className='flex gap-3 justify-center'>
        {paymentTimeout && (
          <button onClick={retryPaymentCheck} className='btn-primary px-6 py-2'>
            Check Again
          </button>
        )}
      </div>
    </div>
  );

  const renderCompletedStep = () => (
    <div className='space-y-6 text-center'>
      <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
        <CheckCircle className='w-8 h-8 text-green-600' />
      </div>

      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Payment Confirmed!
        </h2>
        <p className='text-gray-600'>
          Your Wise payment has been confirmed and your tokens are being
          processed.
        </p>
      </div>

      <div className='bg-green-50 rounded-xl p-6'>
        <div className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-green-700'>Payment Reference:</span>
            <span className='font-mono font-semibold text-xs break-all flex-1 ml-2 text-right'>
              {paymentReference}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-green-700'>Amount Received:</span>
            <span className='font-semibold'>
              ${transferData.usdAmount.toFixed(2)} USD
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-green-700'>Status:</span>
            <span className='text-green-600 font-medium'>✓ Confirmed</span>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 rounded-xl p-4'>
        <p className='text-sm text-gray-600'>
          Your {transferData.amount.toFixed(6)}{' '}
          {transferData.selectedToken.symbol} tokens will be sent to{' '}
          <span className='font-mono font-medium'>
            {transferData.recipientAddress.slice(0, 8)}...
            {transferData.recipientAddress.slice(-6)}
          </span>{' '}
          on {transferData.selectedChain.name} within the next few minutes.
        </p>
      </div>

      <button onClick={onBack} className='btn-primary px-6 py-2'>
        Start New Transfer
      </button>
    </div>
  );

  return (
    <div className='bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8'>
      {(() => {
        if (currentStep === 'qr_display') return renderQRStep();
        if (currentStep === 'payment_pending')
          return renderPaymentPendingStep();
        if (currentStep === 'completed') return renderCompletedStep();
        return <div>Unknown step: {currentStep}</div>;
      })()}
    </div>
  );
}
