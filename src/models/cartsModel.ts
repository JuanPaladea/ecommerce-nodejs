import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: [ cartItemSchema ],
  totalAmount: { type: Number },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  }, 
  {
    timestamps: true
  }
);

cartSchema.methods.calculateTotalAmount = function() {
  this.totalAmount = this.items.reduce((total: number, item: any) => total + item.price, 0);
  this.updatedAt = Date.now();
  return this.save();
}

cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  next();
});

const cartModels = mongoose.model("carts", cartSchema);

export default cartModels;