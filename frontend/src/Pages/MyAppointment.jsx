import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js';

const MyAppointment = () => {
  const { backendUrl ,token ,getAllDoctorsDat } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  

  const slotDateFormat = (slatData) => {
    const dateArray = slatData.split("_");
    return dateArray[0] + " " + months[parseInt(dateArray[1])] + " " + dateArray[2];
    
  }

  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {headers: { token }});
      console.log(data);
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } 
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/cancelAppointment",{appointmentId} ,{header: { token }});

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getAllDoctorsDat();

        
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY_ID); 
const stripePromise = loadStripe('pk_test_51QqtdFEjqUw2R648qDtz9ewdDIMK8HhvKyUepJjbHn1KgAYru8Zobv0lHRR7ZCxIgnj3Y59sacNr3W9ttureZkIM002u3eNbkN'); 

const appointmentStripe = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/user/stripe-payment",
      { appointmentId },
      { headers: { token } }
    );

    if (data.success && data.clientSecret) {
      await initPay(data.clientSecret);
    } else {
      toast.error(data.message || "Failed to initialize payment");
    }

  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
const initPay = async (sessionId) => {
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
};



useEffect(() => {
  if (token) {
    getUserAppointments();
  }
}, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b '>My Appointments</p>
      <div className='border-b text-zinc-200'>
      {
        appointments.slice(0,3).map((item, index) => (
          <div className='flex grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
          <div>
            <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
          </div>
          <div className='flex-1 text-sm text-zinc-600'>
            <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
            <p>{item.docData.speciality}</p>
            <p className='text-neutral-700 font-medium mt-1'>Address</p>
            <p className='text-xs'>{item.docData.address.line1}</p>
            <p className='text-xs'>{item.docData.address.line2}</p>
            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slatTime}</p>
          </div>
          <div></div>
          <div className='flex flex-col gap-2 justify-end'>

            {!item.cancelled && item.payment &&  <button className='sm:min-w-48 py-3 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
            {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentStripe(item._id)} className='text-sm text-stone-500 text-center sm-min-w-48 py-3 px-6 border rounded hover:text-white transition-all hover:bg-blue-500 duration-300 cursor-pointer'>Pay Online</button>}
            {!item.payment && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm-min-w-48 py-3 px-6 border rounded hover:text-white transition-all hover:bg-red-600 duration-300 cursor-pointer'>Cancel Appointment</button>}
            { !item.payment && !item.completed && <button className='sm:min-w-48 py-3 border border-red-500 text-red-500'>Appointment cancelled</button>}
            {item.payment && <button className='sm:min-w-48 py-3 border border-green-500 text-green-500'>Completed</button>}

          </div>
          </div>
        ))}
      
      </div>
    </div>
  )
}

export default MyAppointment
