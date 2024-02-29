import * as express from 'express';
import { BookController } from '../controllers/book.controller';
import { validateData } from '../middleware/validation.middleware';
import { bookUpdateSchema, bookcreateSchema } from '../schemas/book.schema';
import { ErrorWrapper } from '../hoc/ErrorWrapper';

const router = express.Router()

router.route('/')
.post(validateData(bookcreateSchema),ErrorWrapper(BookController.createBook))
.get(ErrorWrapper(BookController.getBooks))

router.route("/:bookId")
.patch(validateData(bookUpdateSchema),ErrorWrapper(BookController.updateBook))
.get(ErrorWrapper(BookController.getBook))
.delete(ErrorWrapper(BookController.deleteBook))

export {router as bookRouter}