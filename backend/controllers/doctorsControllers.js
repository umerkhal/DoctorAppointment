
import bcrypt from 'bcrypt';
import doctorModel from '../models/doctorModels.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      availability: !docData.availability,
    });

    res.json({ success: true, message: "Doctor availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const {email, password} = req.body;
    const doctor = await doctorModel.findOne({email})

    if(!doctor){
      return res.json({success:false, message:"Doctor not found"})
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if(isMatch){
      const token = jwt.sign({doctorId:doctor._id}, process.env.JWT_SECRET);

      res.json({success:true, message:"Doctor login successfully", token})
    }else{
      res.json({success:false, message:"Invalid credentials"})
    }
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
    
  }
}
//api to get doctor appointments for doctor painel
const appointmentsDoctor = async (req, res) => {
  try {
    const {docId} = req.body;
    const appointments = await appointmentModel.find({docId})

    res.json({success:true, appointments})
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
}
//api to mark appointment as completed
const appoinmentCompleted = async (req, res) => {
  try {
    const {docId , appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true});
      return res.json({success:true, message:"Appointment marked as completed"})
      
    }else{
      return res.json({success:false, message:"Invalid credentials"})
    }
   
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
}
//api to cancel doctor appointments for doctor painel
const appoinmentCancel = async (req, res) => {
  try {
    const {docId , appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId, {canceled:true});
      return res.json({success:true, message:"Appointment marked as canceled"})
      
    }else{
      return res.json({success:false, message:"Cancellation Failed"})
    }
   
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
}
//api to get deshbord data for doctor painel
const doctorDashboard = async (req, res) => {
  try {

    const {docId} = req.body;
    const appointments = await appointmentModel.find({docId})

    let totalEarnings = 0;

    appointments.map((item)=>{
      if(item.isCompleted || item.payment ){
        totalEarnings += item.amount;

      }
    })
    let pationt = [];

    appointments.map((item)=>{
      if(!pationt.includes(item.userId)){
        pationt.push(item.userId);
      }
    })
    const dashData = {
      totalEarnings,
      appointments:appointments.length,
      pationt:pationt.length,
      latestAppointment:appointments.reverse().slice(0, 5)
    }
    res.json({success:true, dashData})

  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
}
//api to get doctor profile for doctor painel
const doctorProfile = async (req, res) => {
  try {
    const {docId} = req.body;
    const profileta = await doctorModel.findById(docId).select('-password ');
    res.json({success:true, profileta})
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
}
//api to update doctor profile for doctor painel
const updateDoctorProfile = async (req, res) => {
  try {
    const {docId ,fees, address, available} = req.body;

    await doctorModel.findByIdAndUpdate(docId, {fees, address, available});
    res.json({success:true, message:"Profile updated successfully"})
    
    
  } catch (error) {
     console.log(error);
    res.json({success:false, message:error.message})
  }

}

export { changeAvailability, doctorList ,loginDoctor
   ,appointmentsDoctor ,appoinmentCompleted , 
  appoinmentCancel ,doctorDashboard ,doctorProfile ,updateDoctorProfile
};