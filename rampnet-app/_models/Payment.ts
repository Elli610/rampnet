// models/Payment.ts
import mongoose from 'mongoose';

export interface IPayment {
  memo: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
  usdAmount: number;
  chainId: number;
  address: string;
  currencyTicker: string;
}

const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    memo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'], // Fixed: removed 'processing' to match interface
      default: 'pending',
      required: true,
    },
    txHash: {
      type: String,
      default: null,
    },
    usdAmount: {
      type: Number,
      required: true,
    },
    chainId: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    currencyTicker: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better performance
PaymentSchema.index({ memo: 1 });
PaymentSchema.index({ paymentStatus: 1 });
PaymentSchema.index({ createdAt: 1 });
PaymentSchema.index({ network: 1 });
PaymentSchema.index({ address: 1 });

// Prevent recompilation during development
const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
