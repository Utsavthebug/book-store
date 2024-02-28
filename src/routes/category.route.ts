import * as express from 'express'
import { CategoryController } from '../controllers/category.controller'
import { ErrorWrapper } from '../hoc/ErrorWrapper'
import { categoriesCreateSchema } from '../schemas/categories.schema'
import { validateData } from '../middleware/validation.middleware'

const router = express.Router()

router.route('/').post(validateData(categoriesCreateSchema),ErrorWrapper(CategoryController.create)).get(CategoryController.getAll)
router.route('/:categoryId').patch(CategoryController.update).delete(CategoryController.deleteCategory)

export {router as categoryRouter}