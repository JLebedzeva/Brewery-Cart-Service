import { Request, Response, NextFunction } from 'express';
import { Cart } from '../infrastructure/mongodb/models/cart';
import { validationResult } from 'express-validator';
import axios from 'axios';

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
      
        // async getCart(req: Request, res: Response, next: NextFunction) {
        //   try {
        //     const { user_id } = req.params;
        //     const cartItems = await Cart.find({ user_id }).populate("inventory_id");
        //     res.status(200).json(cartItems);
        //   } catch (error) {
        //     console.error('Error getting cart:', error);
        //     res.status(500).json({ message: 'Error getting cart' });
        //   }
        // }
      

        public async getCart(req: Request, res: Response, next: NextFunction) {
            try {
                const { user_id } = req.params;
                
                // Get cart items from Cart Database
                const cartItems = await Cart.find({ user_id });
    
                // Fetch inventory details for each cart item
                const inventoryServiceUrl = "http://localhost:3001/inventory/inventory"; 
                const populatedCart = await Promise.all(cartItems.map(async (cartItem) => {
                    try {
                        const response = await axios.get(`${inventoryServiceUrl}/${cartItem.inventory_id}`);
                        return {
                            ...cartItem.toObject(),
                            inventory: response.data 
                        };
                    } catch (error) {
                        console.error("Failed to fetch inventory details");
                        return { ...cartItem.toObject(), inventory: null }; 
                    }
                }));
    
                res.status(200).json(populatedCart);
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