import * as express from 'express';
import { userRouter } from "./user.route";
import { authRouter } from './auth.route';
import { categoryRouter } from './category.route';
import { CartRouter } from './cart.route';
import { bookRouter } from './book.route';

const router = express.Router()

router.use('/user',userRouter)
router.use('/auth',authRouter)
router.use('/category',categoryRouter)
router.use('/book',bookRouter)
router.use('/cart',CartRouter)

export {router as rootRouter}

