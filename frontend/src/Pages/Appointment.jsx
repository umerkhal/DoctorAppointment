import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../Components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbols ,backendUrl ,token, getAllDoctorsDat } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    if (doctors.length > 0) {
      const docInfo = doctors.find((doc) => doc._id === docId);
      setDocInfo(docInfo || null);
    }
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        let slotDate = `${day}-${month}-${year}`;
        const slotTime = formattedTime

     //   const isSlotAvailable = docInfo.slats_booked[slotDate] && docInfo.slats_booked[slotDate].includes(slotTime)? false : true;
       const isSlotAvailable = !docInfo.slats_booked?.[slotDate]?.includes(slotTime);
        if(isSlotAvailable){
           timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        }
       

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const booAppointment = async () => {
    if(!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0]?.datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}-${month}-${year}`;

      const { data } = await axios.post(backendUrl + "/api/user/book-appointment", {docId, 
        slotDate, slotTime}, {headers: {token}});
      if (data.success) {
        toast.success(data.message);
        getAllDoctorsDat();
        navigate("/my-appointment");
        
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    // console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/* -----------------------Doctor Details----------------------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-[#5f6FFF] w-full sm:max-w72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* ----------------Doctor Info ----------------*/}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>
            {/* ----------------Doctor About ----------------*/}
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              <p>About</p>
              <img src={assets.info_icon} alt="Info" />
            </div>
            <p className="text-sm text-gray-500 mt-1 max-w-[700px]">{docInfo.about}</p>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee: <span className="text-gray-600">{currencySymbols} {docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* -----------------------Booking Slots----------------------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p className="text-2xl">Booking Slots</p>
          <div className="flex item-center w-full overflow-x-scroll gap-3 mt-4">
            {
              docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-[#5f6FFF] text-white" : 'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
              }
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {
              docSlots.length  && docSlots[slotIndex].map((item, index) =>(
                <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-4 py-3 rounded-full cursor-pointer ${item.time === slotTime ? "bg-[#5f6FFF] text-white" : 'text-gray-400 border border-gray-200'}`} key={index}>
                {item.time.toLowerCase()} 
                </p>
              ))
            }
          </div>
          <button onClick={booAppointment} className="bg-[#5f6FFF] text-white text-ml py-4 px-14 rounded-full my-6 cursor-pointer ">Book an appointment</button>
        </div>
        {/* -----------------------Listing Related Doctors----------------------- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
      </div>
    )
  );
};

export default Appointment;