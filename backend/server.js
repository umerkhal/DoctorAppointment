import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorsRoutes.js';
import userRouter from './routes/userRoute.js';




//app config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter)

//api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});