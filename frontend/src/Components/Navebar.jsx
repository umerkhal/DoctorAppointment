import React, { useContext, useState } from "react";
import { assets } from "./../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Navebar = () => {

  const { token, setToken ,userData} = useContext(AppContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick={()=>navigate("/")} className="w-44 cursor-pointer" src={assets.logo} alt="" />
      <ul className="hidden md:flex gap-5 item-start font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex item-center gap-4">
      {
        token && userData 
        ? <div className="flex items-center gap-2 cursor-pointer group relative">
          <img className="w-12 h-12 rounded-full" src={userData.image} alt="" />
          <img className="w-2.5 " src={assets.dropdown_icon} alt="" />
          <div className="absolute top-0 right-0 pt-17 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
              <p onClick={()=>navigate("/my-profile")} className="hover:text-black cursor-pointer">My Porfile</p>
              <p onClick={()=>navigate("/my-appointment")} className="hover:text-black cursor-pointer">My Appointments</p>
              <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
            </div>
          </div>
        </div>
        :
        <button onClick={()=> navigate("/login")} className ="font-;bold cursor-pointer border-none border-[1px] text-white bg-blue-500 px-5 py-3 rounded-[75px] transition border-opacity-10">LoginCreate Accounts</button>
      }
        <img onClick={() => setShowMenu(true)} className="w-6 md-hidden" src={assets.menu_icon} alt="" />
        {/* ----------------------Mobile Menu---------------------- */}
      <div className={`${showMenu ? 'flexd w-full' : 'h-0 w-0'} md:hidden right-0 border-0 top-0 z-20 overflow-hidden bg-white transition-all`}>
        <div className="flex justify-between items-center px-5 py-6">
        <img className="w-36" src={assets.logo} alt="" />
        <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
        </div>
        <ul className="flex flex-col gap-2 text-lg item-center font-medium mt-5 px-5">
          <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block '>HOME</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block '>ALL DOCTORS</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block '>ABOUT</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block '>CONTACT</p></NavLink>
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Navebar;
