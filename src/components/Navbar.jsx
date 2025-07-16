import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
import { authActions } from "../redux/reducer/auth";
import { currentUserActions } from "../redux/reducer/user"
import toast, { Toaster } from "react-hot-toast";
import logo from '../assets/icon/logo.png'
import http from "../utils/axios";

const Navbar = () => {
  const [showHamburger, setShowHamburger] = useState(false);
  const [user, setUser] = useState(null); 
  const dispatch = useDispatch();    
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    setUser(currentUser)
  }, [currentUser])

  async function logoutEndpoint(token) {
    try {
      const { data } = await http(token).post("/auth/logout", {}, {
        headers: { "Content-Type": "application/json" }
      });
      
      if (!data.success) {
        toast.error(data.message || "Logout failed!");
        return null;
      }
      return data.results;
    } catch (error) {
      toast.error("Logout failed due to network error", error.message);
      return null;
    }
  }

  async function handleLogout() {
    try {
      if (token) {
        await logoutEndpoint(token);
      }
      dispatch(authActions(null));
      dispatch(currentUserActions(null));
      setUser(null); 
      toast.success("Logout Success!");
    } catch (error) {
      toast.error("Logout failed!", error.message);
    }
  }

  const getUserInitials = () => {
    if (user?.fullname) {
      return user.fullname.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  const getDisplayName = () => {
    return user?.fullname || user?.email?.split('@')[0] || "User";
  };

  return (
    <nav className="bg-secondary text-white z-100 fixed left-0 right-0 top-0 md:shadow shadow-xl  h-100px md:px-15 sm:px-10 px-7 py-3">
      <Toaster />
      <div className="flex-between">
        <div>
          <img className="md:w-20 w-17" src={logo} alt="logo" />
        </div>
        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 md:flex md:gap-7 md:font-sans md:font-semibold md:text-lg hidden">
          <Link to="/">HOME</Link>
          <Link to="/movies">MOVIE</Link>
          <Link to="/movies">BUY TICKET</Link>
        </div>
        {user ? (
          <div className="md:flex md:items-center md:gap-3 hidden">
            <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">
              {getUserInitials()}
            </div>
            <div>
              <p className="text-xl">{getDisplayName()}</p>
              <Link to="/profile" className="text-sm mb-[-5px] text-third">
                account settings
              </Link>
            </div>
            <button onClick={handleLogout} aria-label="logout" className="ms-3 cursor-pointer flex flex-col justify-center items-center text-red-500">
              <MdLogout className="text-2xl " />
            </button>
          </div>
        ) : (
          <div className="md:flex md:gap-3 hidden">
            <Link to="/login" className="universal-button border">
              LOGIN
            </Link>
            <Link to="/register" className="universal-button bg-third text-primary">
              SIGN UP
            </Link>
          </div>
        )}

        <button
          className="cursor-pointer md:hidden text-2xl"
          onClick={() => setShowHamburger(!showHamburger)}
        >
          {showHamburger ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </div>
      
      {showHamburger && (
        <div className="flex flex-col h-fit rounded-b-xl text-center text-base font-bold py-7 gap-5">
          <Link to="/" onClick={() => setShowHamburger(false)}>HOME</Link>
          <Link to="/movies" onClick={() => setShowHamburger(false)}>MOVIE</Link>
          <Link to="/movies" onClick={() => setShowHamburger(false)}>BUY TICKET</Link>
          
          {user ? (
            <div className="flex-between gap-3 bg-primary p-5 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">
                  {getUserInitials()}
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-xl">{getDisplayName()}</p>
                  <Link 
                    to="/profile" 
                    className="text-sm mb-[-5px] text-third"
                    onClick={() => setShowHamburger(false)}
                  >
                    account settings
                  </Link>
                </div>
              </div>
              <div>
                <button onClick={handleLogout} aria-label="logout" className="ms-3 cursor-pointer flex flex-col justify-center items-center text-red-500">
                  <MdLogout className="text-2xl " />
                </button>
              </div>
            </div>  
          ) : (
            <div className="flex-between gap-3">
              <Link 
                to="/login" 
                className="grow universal-button border text-base"
                onClick={() => setShowHamburger(false)}
              >
                LOGIN
              </Link>
              <Link 
                to="/register" 
                className="grow universal-button bg-third text-primary text-base"
                onClick={() => setShowHamburger(false)}
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;