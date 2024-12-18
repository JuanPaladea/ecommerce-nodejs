import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Reference to Order
  shippingAddress: { type: 
    [{
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    }], required: true },
  shippingMethod: { type: String, required: true },
  shippingStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  trackingNumber: { type: String },
  shippingDate: { type: Date },
  deliveryDate: { type: Date }
});

const Shipping = mongoose.model('Shipping', shippingSchema);

export default Shipping;
