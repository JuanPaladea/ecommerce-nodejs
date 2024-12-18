import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ARG' }
});

const paymentsModel = mongoose.model('payments', paymentSchema);

export default paymentsModel;
