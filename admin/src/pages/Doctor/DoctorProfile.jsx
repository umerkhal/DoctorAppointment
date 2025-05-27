import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContaxt';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken ,getProfileData ,profileData ,setProfileData ,backendUrl } = useContext(DoctorContext);
  const {currency} = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fee: profileData.fee,
        available: profileData.available,
      }
      const { data } = await axios.post(backendUrl + "/api/doctor/update-profile", { updateData }, { headers: { dToken } });
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false)
        getProfileData()
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      
    }
  }


useEffect(() => {
  if (dToken) {
    getProfileData()
  }

}, [dToken])


  return profileData &&(
    <div>
    <div className='flex flex-col gap-5 m-5'>
      <div>
        <img className='bg-blue-500 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
      </div>
      <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
        <p className='flex items-center gap-2 text-2xl font-medium text-gray-700'>{profileData.name}</p>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <p>{profileData.degree} - {profileData.speciality}</p>
          <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
        </div>
      
          <div>
            <p className='flex items-center gap-2 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-500 mt-1'>
              {profileData.about}
            </p>
          </div>
          <p className='text-gray-500 font-medium mt-3'>
            Appointmenr Fee : <span className='text-gray-700'>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData({...prev,fee:e.target.value})} value={profileData.fee}/> :  profileData.fee}</span>
          </p>
          <div className='flex gep-2 py-2'>
            <p>Address</p>
            <p className='text-sm'>
              {isEdit ? <input type='text' onChange={(e) => setProfileData =>({...prev,address:{...prev.address,line1:e.target.value}})} value={profileData.address.line1}/> : profileData.address.line1}
              <br />
            {isEdit ? <input type='text' onChange={(e) => setProfileData =>({...prev,address:{...prev.address,line2:e.target.value}})} value={profileData.address.line1}/> : profileData.address.line2}

            </p>
          </div>
          <div className='flex items-center gap-2 pt-2'>
            <input onChange={() => isEdit && setProfileData(prev =>({...prev,available:!prev.available}))} chicked={profileData.available} type="chickbox" name="" id="" />
            <label htmlFor="">Available</label>
          </div>
          {
          isEdit 
          ? <button onClick={updateProfile} className='px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 text-blue-500 hover:bg-blue-500 hover:text-white transition-all'>Save</button>
          : <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 text-blue-500 hover:bg-blue-500 hover:text-white transition-all'>Edit Profile</button>
          }
      </div>
    </div>
      
    </div>
  )
}

export default DoctorProfile
