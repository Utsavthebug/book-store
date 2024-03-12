import * as express from 'express'
import { OrderController } from '../controllers/order.controller'
import { ErrorWrapper } from '../hoc/ErrorWrapper'
import { authentication } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/',authentication,ErrorWrapper(OrderController.createOrder))
router.patch('/:orderId',ErrorWrapper(OrderController.updateOrder))
router.get('/me',authentication,ErrorWrapper(OrderController.getmyOrders))


export {router as OrderRouter}