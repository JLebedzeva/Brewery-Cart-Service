import { Request, Response, NextFunction } from 'express';
import { Cart } from '../infrastructure/mongodb/models/cart';
import { validationResult } from 'express-validator';

export class CartController {
    
    public async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const { user_id, inventory_id, quantity } = req.body;
            const cartItem = new Cart({ user_id, inventory_id, quantity });
            await cartItem.save();
            res.status(201).json({ message: "Item added to cart", cartId: cartItem._id });
          } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Error adding to cart' });
          }
        }
      
        async getCart(req: Request, res: Response, next: NextFunction) {
          try {
            const { user_id } = req.params;
            const cartItems = await Cart.find({ user_id }).populate("inventory_id");
            res.status(200).json(cartItems);
          } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ message: 'Error getting cart' });
          }
        }
      
        async updateCart(req: Request, res: Response, next: NextFunction) {
          try {
            const { id } = req.params;
            const { quantity } = req.body;
      
            const cartItem = await Cart.findByIdAndUpdate(id, { quantity }, { new: true });
      
            res.status(200).json({ message: "Cart updated", cartItem });
          } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).json({ message: 'Error updating cart' });
          }
    }

    public async removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            await Cart.findByIdAndDelete(id);
            res.status(200).json({message : "Item removed from cart"});
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ message: 'Error removing from cart' });
        }
    }
}