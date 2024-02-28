import * as express from 'express';
import { userLoginSchema, userRegistrationSchema } from '../schemas/user.schema';
import { AuthController } from '../controllers/auth.controller';
import { authentication } from '../middleware/auth.middleware';
import { validateData } from '../middleware/validation.middleware';
import { ErrorWrapper } from '../hoc/ErrorWrapper';

const router = express.Router()


router.post('/login',validateData(userLoginSchema), ErrorWrapper(AuthController.login))
router.post('/register',validateData(userRegistrationSchema),ErrorWrapper(AuthController.register))
router.post('/changepassword',authentication,ErrorWrapper(AuthController.changePassword))
router.post('/forgetpassword',AuthController.forgetPassword)
router.post('/resetpassword',AuthController.resetPassword)

export {router as authRouter}