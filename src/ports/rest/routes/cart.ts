import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { CartController } from '../../../controllers/cartController'; // Adjust the path as needed

const router = express.Router();
const cartController = new CartController();

router.post('/cart-add',
    body("user_id").isInt().withMessage("User ID must be an integer"),
    body("inventory_id").isMongoId().withMessage("Inventory ID must be a valid ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    (req: Request, res: Response, next: NextFunction) => cartController.addToCart(req, res, next)
  );
  
  router.get("/cart/:user_id", (req, res, next) => cartController.getCart(req, res, next));
  
  router.put("/cart/update/:id", 
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    (req: Request, res: Response, next: NextFunction) => cartController.updateCart(req, res, next)
  );
  
router.delete("/cart/remove/:id", (req: Request, res: Response, next: NextFunction) => cartController.removeFromCart(req, res, next));
  
export = router;
