import * as express from 'express'
import { dashboardController } from '../controllers/dashboard.controller'
import { ErrorWrapper } from '../hoc/ErrorWrapper'

const router = express.Router()

router.get('/order-statistics',ErrorWrapper(dashboardController.OrderStatistics))

export {router as dashboardRouter}