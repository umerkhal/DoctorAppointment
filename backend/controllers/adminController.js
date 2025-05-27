import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctorModels.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModels.js";

//api for admin doctors
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, 
      speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file
 
    //chicking for all data to add doctor
    if (!name || !email || !password || !imageFile || !speciality || !degree || !experience || !about || !fees || !address) {
      
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    //validating email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    //validating password
    if (password.length < 8) {
      return res.status(400).json({ message: "Please enter a strong password" });
      
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //uploading image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    //adding doctor to database
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      date:Date.now(),
    }
    const newDoctor = await doctorModel.create(doctorData);
    await newDoctor.save();
    res.status(201).json({ success:true,message: "Doctor added successfully" });


  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Doctor not added in admin controller"});
    
  }
}
//api for admin doctors

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      //generate token
      const token = jwt.sign(email+password, process.env.JWT_SECRET);
      res.json({success:true, message:"Admin login successfully", token});

    } else {
      res.json({success:false, message:"Admin not login"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Admin Not login in Admin Controller" });
    
  }
}

//api for all admin doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({success:true, message:"All doctors", doctors});
    
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message});
    
  }
}
//api to all appointments list
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({success:true, message:"All appointments", appointments});
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
}
//api for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log("Appointment ID", appointmentId);

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    let slots_booked = doctorData.slots_booked || {};
    console.log("Slots booked before cancellation:", slots_booked);

    // Ensure the date exists and is an array
    if (Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);

      // Optional: Clean up empty array if all slots are removed
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate];
      }
    } else {
      console.warn(`No booked slots found for date ${slotDate}`);
    }

    // Update doctor record
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment cancelled successfully' });

  } catch (error) {
    console.log("Error in cancellation:", error);
    res.status(500).json({ success: false, message: 'Error in cancelling appointment' });
  }
};

//api to get deshboard data for admin pannel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true, message:"Admin dashboard", dashData});
    
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message});
    
  }
  
}

export { addDoctor, loginAdmin , allDoctors , appointmentAdmin , appointmentCancel ,adminDashboard };