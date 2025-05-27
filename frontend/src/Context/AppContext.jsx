import { createContext, useEffect, useState } from "react";
export const AppContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";

const AppContextProvider = (props) => {
  const currencySymbols = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") ? 
  localStorage.getItem("token") : '');
  const [userData, setUserData] = useState('');
  

  const getAllDoctorsDat = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

 const loadUserProfileData = async () => {
  try {
    const response = await axios.get(backendUrl + "/api/user/get-Profile", {
  headers: { token }
}
);
    const data = response.data;
    if (data.success) {
      setUserData(data.userData);

    } else {
      toast.error(data.message);
    }
    
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    
  }
 }

  const value = {
    doctors,
    currencySymbols,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getAllDoctorsDat,
  };

  useEffect(() => {
    getAllDoctorsDat();
  }, []);

useEffect(() => {
  if (token) {
    loadUserProfileData();
  }else{
    setUserData(false);
  }
}, [token]);


  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
