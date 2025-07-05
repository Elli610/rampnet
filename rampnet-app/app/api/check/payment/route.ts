// app/api/check/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import Payment from '../../../../_models/Payment'

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

    // Connect to database
    await connectDB()

    // Find payment by memo
    const payment = await Payment.findOne({ memo })

    if (!payment) {
      // Payment not found in database
      console.log('Payment not found in database for memo:', memo)
      
      return NextResponse.json({
        success: true,
        status: 'not_found',
        message: 'Payment not found in our records'
      })
    }

    console.log('Payment found:', {
      memo: payment.memo,
      status: payment.paymentStatus,
      txHash: payment.txHash,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    })

    // Return payment status
    return NextResponse.json({
      success: true,
      status: payment.paymentStatus,
      txHash: payment.txHash,
      message: `Payment is ${payment.paymentStatus}`,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
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

// Optional: GET route to list all payments (for admin/debug)
export async function GET() {
  try {
    await connectDB()
    
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select('memo paymentStatus txHash createdAt updatedAt')

    return NextResponse.json({
      success: true,
      payments,
      count: payments.length
    })

  } catch (error) {
    console.error('Error fetching payments:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}