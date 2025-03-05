import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import axios from 'axios';
import { config } from '../config/config';


export class CartController {
    private readonly breweryApiUrl = config.breweryApiUrl;

    // Add Item to Cart via API
    public async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const response = await axios.post(`${this.breweryApiUrl}/cart/add`, req.body);
            res.status(201).json(response.data);
        } catch (error: any) {
            console.error('Error adding to cart:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                message: "Error adding to cart",
                error: error.response?.data || error.message
            });
        }
    }

    // Get Cart Items
    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await axios.get(`${this.breweryApiUrl}/cart/${req.params.user_id}`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error getting cart:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                message: "Error getting cart",
                error: error.response?.data || error.message
            });
        }
    }

    // Update Cart Item Quantity
    public async updateCart(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await axios.put(`${this.breweryApiUrl}/cart/update/${req.params.id}`, req.body);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error updating cart:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                message: "Error updating cart",
                error: error.response?.data || error.message
            });
        }
    }

    // Remove Item from Cart
    public async removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await axios.delete(`${this.breweryApiUrl}/cart/remove/${req.params.id}`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error removing from cart:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                message: "Error removing from cart",
                error: error.response?.data || error.message
            });
        }
    }
}