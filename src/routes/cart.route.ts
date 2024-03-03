import * as express from 'express';
import { authentication } from '../middleware/auth.middleware';
import { CartController } from '../controllers/cart.controller';
import { ErrorWrapper } from '../hoc/ErrorWrapper';

const router = express.Router()

router.post('/',authentication,ErrorWrapper(CartController.createCart))
router.get('/',authentication,ErrorWrapper(CartController.getCartItems))


export {router as CartRouter}