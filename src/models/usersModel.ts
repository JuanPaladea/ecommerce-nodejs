import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  orders: [ { type: mongoose.Schema.Types.ObjectId, ref: 'orders' } ],
  cart: [ { type: mongoose.Schema.Types.ObjectId, ref: 'carts' } ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'wishlists' }],
  },
  {
    timestamps: true
  }
);

const usersModel = mongoose.model("users", userSchema);

export default usersModel;