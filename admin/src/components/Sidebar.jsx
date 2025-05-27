import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {
        aToken && <ul className='text-[#515151] mt-5'>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/admin-dshboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/all-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointment</p>
          </NavLink>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/add-doctors'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctors</p>
          </NavLink>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/doctors-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
        </ul>
      }
            {
        dToken && <ul className='text-[#515151] mt-5'>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/doctors-dshboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/doctors-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointment</p>
          </NavLink>
      
          <NavLink className={({ isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 curser-pointer ${isActive ? 'bg-[#966969] text-[#f7f3f3] border-r-4 border-[#3a42d0] ' : ''}`} to={'/doctors-profile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar
