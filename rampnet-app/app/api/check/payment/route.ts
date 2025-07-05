// app/api/check/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Simulate a database of pending payments
const pendingPayments = new Map<string, {
  memo: string
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: number
  confirmedAt?: number
}>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memo } = body

    console.log('Checking payment for memo:', memo)

    if (!memo) {
      return NextResponse.json(
        { success: false, error: 'Memo is required' },
        { status: 400 }
      )
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if payment already exists in our "database"
    let payment = pendingPayments.get(memo)

    if (!payment) {
      // Create a new pending payment
      payment = {
        memo,
        status: 'pending',
        createdAt: Date.now()
      }
      pendingPayments.set(memo, payment)
      
      console.log('Created new pending payment:', payment)
      
      return NextResponse.json({
        success: true,
        status: 'pending',
        message: 'Payment not found yet, checking...'
      })
    }

    // Simulate payment confirmation after 30 seconds
    const timeElapsed = Date.now() - payment.createdAt
    const shouldConfirm = timeElapsed > 30000 // 30 seconds

    if (shouldConfirm && payment.status === 'pending') {
      payment.status = 'confirmed'
      payment.confirmedAt = Date.now()
      pendingPayments.set(memo, payment)
      
      console.log('Payment confirmed:', payment)
      
      return NextResponse.json({
        success: true,
        status: 'confirmed',
        message: 'Payment confirmed successfully!',
        confirmedAt: payment.confirmedAt
      })
    }

    // Simulate failure after 2 minutes (optional)
    if (timeElapsed > 120000) { // 2 minutes
      payment.status = 'failed'
      pendingPayments.set(memo, payment)
      
      console.log('Payment failed:', payment)
      
      return NextResponse.json({
        success: true,
        status: 'failed',
        message: 'Payment verification failed'
      })
    }

    // Return current status
    console.log('Payment still pending:', payment)
    
    return NextResponse.json({
      success: true,
      status: payment.status,
      message: `Payment is ${payment.status}`,
      timeElapsed: Math.round(timeElapsed / 1000) // in seconds
    })

  } catch (error) {
    console.error('Payment check error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Failed to check payment status'
      },
      { status: 500 }
    )
  }
}

