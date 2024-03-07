import * as express from 'express'
import { OrderController } from '../controllers/order.controller'
import { ErrorWrapper } from '../hoc/ErrorWrapper'
import { authentication } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/',authentication,ErrorWrapper(OrderController.createOrder))
router.patch('/:orderId',ErrorWrapper(OrderController.updateOrder))

export {router as OrderRouter}