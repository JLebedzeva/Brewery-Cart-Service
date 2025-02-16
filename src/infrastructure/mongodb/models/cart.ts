import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    inventory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true, 
      },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    addedAt: { type: Date, default: Date.now }
    });
export const Cart = mongoose.model('Cart', CartSchema);