import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment , Stripepayment ,verifyStripePayment} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from './../middlewares/multer.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser, getProfile);
userRouter.post('/updateProfile',upload.single('image'),authUser ,updateProfile);
userRouter.post('/book-appointment',authUser, bookAppointment );
userRouter.get('/appointments',authUser, listAppointment);
userRouter.get('/cancel-appointment',authUser, cancelAppointment);
userRouter.post('/stripe-payment',authUser, Stripepayment );
userRouter.post('/verify-stripe-payment',authUser, verifyStripePayment );



export default userRouter;