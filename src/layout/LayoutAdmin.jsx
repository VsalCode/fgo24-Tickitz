import { Outlet, Navigate, ScrollRestoration } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const LayoutAdmin = () => {
  const user = useSelector((state) => state.user.user);

  if(user.role !== "admin"){
    toast.error("You must login as admin!");
    return <Navigate to="/" replace />
  }

  if (user === null ) {
    toast.error("You must login as admin!");
    return <Navigate to="/login" replace />
  }

  return (
    <main className="bg-primary h-fit min-h-[100svh] py-30 flex-center flex-col gap-7 sm:px-10 px-5">
      <ScrollRestoration/>
      <Toaster />
      <NavbarAdmin />
      <Outlet />
    </main>
  );
};

export default LayoutAdmin;
