import * as express from 'express';
import { BookController } from '../controllers/book.controller';
import { validateData } from '../middleware/validation.middleware';
import { bookcreateSchema } from '../schemas/book.schema';
import { ErrorWrapper } from '../hoc/ErrorWrapper';

const router = express.Router()

router.post('/',validateData(bookcreateSchema),ErrorWrapper(BookController.createBook))
router.get('/',ErrorWrapper(BookController.getBooks))

export {router as bookRouter}