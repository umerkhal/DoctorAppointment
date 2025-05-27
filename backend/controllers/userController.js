import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from './../models/userModels.js';
import jwt from 'jsonwebtoken';
import { json } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from './../models/doctorModels.js';
import appointmentModel from '../models/appointmentModel.js';
import Stripe from 'stripe';
const stripeInstance = new Stripe(process.env.STRIPE_KEY_SECRET);



//api to register a new user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({success: false, message: 'Please fill all the fields'});
    }
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: 'Please enter a valid email'});
    }
    if (password.length < 8) {
      return res.json({success: false, message: 'Password must be at least 6 characters long'});
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user
    const newData = {
    name,
    email,
    password: hashedPassword,

    }
    //save the user to the database
    const newUser = new userModel(newData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET )
    res.json({success: true, message: 'User registered successfully', token});
    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Internal server error'});
  
  }
}

//api to login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Internal server error' });
  }
};

//api to get user data
const getProfile = async (req, res) => {
  try {
   const userId = req.user.id;
    const userData = await userModel.findById(userId).select('-password');
    res.json({success: true, userData});

  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Error in Profile'});
  }
  
}

//api to update user data
const updateProfile = async (req, res) => {
  try {
    const {name, phone, address, dob, gender } = req.body;
    const _id = req.user.id;
    const imageFile = req.file;

  
    if (!_id || !name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Please fill all the fields' });
    }

    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(_id, updateData);

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//api to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.availability) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slats_booked = docData.slots_booked || {}; // ✅ initialize if undefined

    // Check if slot already booked
    if (slats_booked[slotDate]) {
      if (slats_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slats_booked[slotDate].push(slotTime);
      }
    } else {
      slats_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slats_booked;

    const slatData = `${slotDate} ${slotTime}`; // ✅ define or remove

    const appointmentData = {
      userId,
      docId,
      slotDate,
     docData,
     userData,
      amount: docData.fees,
      slotTime,
      slatData, // ✅ only if used
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slats_booked });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in booking appointment" });
  }
};

//api to get all appointment
const listAppointment = async (req, res) => {
  try {

    const userId = req.user.id;
    const appointments = await appointmentModel.find({userId})

   res.json({success: true, appointments});

    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Error in booking appointment'});
    
  }
}

//api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const {userId, appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify if the appointment is booked by the user
    if (appointmentData.userId !== userId) {
      return res.json({success: false, message: 'You are not authorized to cancel this appointment'});
      
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled: true});

    //release the slot
    const {docId, slatDate, slatTime} = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slats_booked = doctorData.slats_booked;
    slats_booked[slatDate] = slats_booked[slatDate].filter((e) => e !== slatTime);
    await doctorModel.findByIdAndUpdate(docId, {slats_booked});
    res.json({success: true, message: 'Appointment cancelled successfully'});
    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Error in booking appointment'});
    
  }
}

//api to make payment of appointment using razorpay
const Stripepayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment not found or cancelled' });
    }

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Appointment Payment',
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        metadata: {
    appointmentId: appointmentId.toString()  // ✅ Add this line
  }
    });

    res.json({ success: true, clientSecret: session.id }); // ✅ final response

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const verifyStripePayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripeInstance.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const appointmentId = session.metadata.appointmentId;
      
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

      return res.json({ success: true, message: 'Payment verified and appointment updated' });
    } else {
      return res.json({ success: false, message: 'Payment not completed yet' });
    }

  } catch (error) {
    console.error("Error in verifyStripePayment:", error);
    return res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};



export  {registerUser , loginUser, getProfile , updateProfile ,bookAppointment , listAppointment, cancelAppointment , Stripepayment ,verifyStripePayment};