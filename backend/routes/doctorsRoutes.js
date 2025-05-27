import express from 'express';
import { doctorList ,loginDoctor ,appointmentsDoctor,appoinmentCompleted , appoinmentCancel ,doctorDashboard ,updateDoctorProfile,doctorProfile} from '../controllers/doctorsControllers.js';
import authDoctor from '../middlewares/authDoctor.js';


const doctorRouter = express.Router();


doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.put('/complete-appointments',authDoctor,appoinmentCompleted);
doctorRouter.get('/cancel-appointments',authDoctor,appoinmentCancel);
doctorRouter.get('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);


export default doctorRouter;