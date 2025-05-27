// src/App.jsx
import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navebar from "./components/Navebar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashbord from "./pages/Admin/Dashbord";
import AllApointment from "./pages/Admin/AllApointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDeshbord from "./pages/Doctor/DoctorDeshbord";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken  || dToken ? (
    <div className="bg-[#F8F8F8]">
      <ToastContainer />
      <Navebar/>
      <div className="flex items-start">
        <Sidebar/>
        <Routes>
        {/* =============Admin Route =============*/}

          <Route path="/" element={<></>}/>
          <Route path="/admin-dshboard" element={<Dashbord/>}/>
          <Route path="/all-appointments" element={<AllApointment/>}/>
          <Route path="/add-doctors" element={<AddDoctor/>}/>
          <Route path="/doctors-list" element={<DoctorsList/>}/>

        {/* =============Doctor Route =============*/}
          <Route path="/doctors-dshboard" element={<DoctorDeshbord/>}/>
          <Route path="/doctors-appointments" element={<DoctorAppointment/>}/>
          <Route path="/doctors-profile" element={<DoctorProfile/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
