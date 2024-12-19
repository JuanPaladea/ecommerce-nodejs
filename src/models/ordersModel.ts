import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, 
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }, 
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'payments' },
  shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'shippings' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0)
  return this.save();
};

orderSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0)
  next();
});

const ordersModel = mongoose.model("orders", orderSchema);

export default ordersModel;
