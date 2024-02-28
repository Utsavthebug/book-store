import * as express from 'express'
import { UserController } from '../controllers/user.controller'
import { authentication } from '../middleware/auth.middleware'
import { ErrorWrapper } from '../hoc/ErrorWrapper'

const router = express.Router()

router.get('/all',authentication,ErrorWrapper(UserController.getAllUsers));
router.route('/:userId').patch(authentication,ErrorWrapper(UserController.updateUser)).
get(authentication,ErrorWrapper(UserController.getUser))
.delete(authentication,ErrorWrapper(UserController.deleteUser));



export {router as userRouter}