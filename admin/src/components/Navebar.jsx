import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Navebar = () => {

  const {aToken ,setAToken} = useContext(AdminContext);
  const {dToken ,setDToken} = useContext(DoctorContext)

  const navigate = useNavigate();

  const logout =() =>{
    navigate('/')
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  }

  return (
    <div className='flex justify-between border-b px-4 sm:px-10 py-3 items-center bg-white shadow-md p-4'>
    <div className='flex items-center gap-2 text-xs'>
      <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
      <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
    </div>      
    <button onClick={logout} className='bg-blue-500 text-white rounded-full text-sm px-10 py-2'>LogOut</button>
    </div>
  )
}

export default Navebar
