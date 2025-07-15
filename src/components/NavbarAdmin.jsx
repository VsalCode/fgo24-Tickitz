import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import logo from '../assets/icon/logo.png'
import { useDispatch } from "react-redux";
import { authActions } from "../redux/reducer/auth";
import { currentUserActions } from "../redux/reducer/user"

const NavbarAdmin = () => {
  const [showHamburger, setShowHamburger] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  function HandleHamburger() {
    setShowHamburger(!showHamburger);
  }

  function handleLogout() {
    toast.success("Logout Success!");
    dispatch(authActions(null));
          dispatch(currentUserActions(null));
    toast.dismiss();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="bg-secondary text-white z-100 fixed left-0 right-0 top-0 md:shadow shadow-xl h-100px md:px-15 sm:px-10 px-7 py-4">
      <Toaster />
      <div className="flex-between">
        <div>
          <img className="md:w-20 w-17" src={logo} alt="logo" />
        </div>
        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 md:flex md:gap-7 md:font-sans md:font-semibold md:text-lg hidden">
          <Link to="/dashboard-admin">Dashboard</Link>
          <Link to="/movies-admin">Movie</Link>
        </div>
        <div className="md:flex md:items-center md:gap-3 hidden">
          <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">AD</div>
          <div>
            <p className="text-xl">Admin</p>
          </div>
          <button onClick={handleLogout} aria-label="logout" className="ms-3 cursor-pointer flex flex-col justify-center items-center text-red-500">
            <MdLogout className="text-2xl" />
          </button>
        </div>

        <button className="md:hidden text-2xl" onClick={HandleHamburger}>
          {showHamburger === false ? <GiHamburgerMenu /> : <IoClose />}
        </button>
      </div>
      {showHamburger === true && (
        <div className="flex flex-col h-fit rounded-b-xl text-center text-base font-bold py-7 gap-5">
          <Link to="/dashboard-admin">Dashboard</Link>
          <Link to="/movies-admin">Movie</Link>
          <button onClick={handleLogout} aria-label="logout" className="ms-3 cursor-pointer flex flex-col justify-center items-center text-red-500">
            <p>Logout</p>
          </button>
          <div className="flex-center gap-3">
            <div className="bg-[#EAEFEF] size-9 text-primary flex items-center justify-center rounded-full font-bold">AD</div>
            <div>
              <p className="text-xl">Admin</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;
