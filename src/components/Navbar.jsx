import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
// import { userLogout } from "../redux/reducer/auth";
import toast, { Toaster } from "react-hot-toast";
import logo from '../assets/icon/logo.png'

const Navbar = () => {
  const [showHamburger, setShowHamburger] = useState(false);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null)
  const userLogin = useSelector((state) => state.auth.currentUser);
  const checkDataUsers = useSelector((state) => state.users.users);

  React.useEffect(() => {
  if (userLogin !== null) {
    const filtered = checkDataUsers.filter(
      (e) => e.id === userLogin.id && userLogin.email === e.email
    )[0]
    setCurrentUser(filtered);
  } else {
    setCurrentUser(null);
  }
}, [userLogin, checkDataUsers]);


  function handleLogout() {
    toast.success("Logout Success!");
    // dispatch(userLogout());
  }

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
        {currentUser ? (
          <div className="md:flex md:items-center md:gap-3 hidden">
            <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">
              {currentUser.fullname ? currentUser.fullname.split("").slice(0, 2).join("").toUpperCase() : currentUser.email?.split("@").splice(0, 1).join("").split("").slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-xl">{currentUser?.fullname ? currentUser.fullname : currentUser.email?.split("@").splice(0, 1)}</p>
              <Link to="/account-settings" className="text-sm mb-[-5px] text-third">
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
            <Link to="/signup" className="universal-button bg-third text-primary">
              SIGN UP
            </Link>
          </div>
        )}

        <button
          className="cursor-pointer md:hidden text-2xl"
          onClick={() => {
            setShowHamburger(!showHamburger);
          }}
        >
          {showHamburger === false ? <GiHamburgerMenu /> : <IoClose />}
        </button>
      </div>
      {showHamburger === true && (
        <div className=" flex flex-col h-fit rounded-b-xl text-center text-base font-bold py-7 gap-5">
          <Link to="/">HOME</Link>
          <Link to="/movies">MOVIE</Link>
          <Link to="/movies">BUY TICKET</Link>
          {currentUser ? (
            <div className="flex-between gap-3 bg-primary p-5 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">
                  {currentUser.fullname ? currentUser.fullname.split("").slice(0, 2).join("").toUpperCase() : currentUser.email?.split("@").splice(0, 1).join("").split("").slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-xl">{currentUser?.fullname ? currentUser.fullname : currentUser.email?.split("@").splice(0, 1)}</p>
                  <Link to="/account-settings" className="text-sm mb-[-5px] text-third">
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
              <Link to="/login" className="grow universal-button border text-base">
                LOGIN
              </Link>
              <Link to="/signup" className="grow universal-button bg-third text-primary text-base">
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
