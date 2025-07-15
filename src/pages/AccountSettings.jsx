import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import http from "../utils/axios";

const schema = yup.object().shape({
  fullname: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  phone: yup.string().optional(),
  newPassword: yup.string().optional(),
  confirmPassword: yup.string().when("newPassword", {
    is: (newPassword) => newPassword && newPassword.length > 0,
    then: () =>
      yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
    otherwise: () => yup.string().optional(),
  }),
});

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data } = await http(token).get("/user");
        setOriginalUser(data);
        reset({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        toast.error("Failed to fetch user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, reset]);

  async function handleChangeAcc(formData) {
    try {
      const payload = {};

      if (formData.fullname !== originalUser.fullname) {
        payload.fullname = formData.fullname;
      }

      if (formData.email !== originalUser.email) {
        payload.email = formData.email;
      }

      if (formData.phone !== originalUser.phone) {
        payload.phone = formData.phone;
      }

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      if (Object.keys(payload).length > 0) {
        await http(token).patch("/user", payload);
        toast.success("Account settings updated!");

        const { data } = await http(token).get("/user");
        setOriginalUser(data);
      } else {
        toast("No changes detected", { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-secondary w-full rounded-xl grid grid-cols-2">
        <Link to="/account-settings" className="text-center py-5 cursor-pointer font-medium border-b-third border-b-4 hover:opacity-70 transition-colors">
          Account Settings
        </Link>
        <Link to="/order-history" className="text-center py-5 cursor-pointer hover:text-third font-medium hover:opacity-70 transition-colors">
          Order History
        </Link>
      </section>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleChangeAcc)}>
        <section className="bg-secondary w-full rounded-xl h-fit px-5 py-7">
          <p className="mb-5 text-lg font-semibold text-third">Details Information</p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullname" className="font-semibold">
                Fullname
              </label>
              <input {...register("fullname")} type="text" id="fullname" placeholder="Enter your Fullname" className="p-3 bg-[#283246] rounded-xl" />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>
            <div className="flex md:flex-row flex-col md:gap-5 gap-2">
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
                <input {...register("email")} type="email" id="email" placeholder="Enter your email" className="p-3 bg-[#283246] rounded-xl" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="phone" className="font-semibold">
                  Phone Number
                </label>
                <input {...register("phone")} type="text" id="phone" placeholder="Enter phone number" className="p-3 bg-[#283246] rounded-xl" />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
            </div>
          </div>
        </section>
        <section className="bg-secondary w-full rounded-xl h-fit px-5 py-7">
          <p className="mb-5 text-lg font-semibold text-third">Account and Privacy</p>
          <div className="flex sm:flex-row flex-col gap-5">
            <div className="flex-1 flex flex-col gap-3">
              <label htmlFor="newPassword" className="font-semibold">
                New Password
              </label>
              <span className="flex-between gap-4 p-3 bg-[#283246] rounded-xl">
                <input className="flex-1 outline-none" {...register("newPassword")} type={showPassword ? "text" : "password"} id="newPassword" placeholder="Enter New Password" />
                <button type="button" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeClosed className="text-xl" /> : <LuEye className="text-xl" />}
                </button>
              </span>
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <label htmlFor="confirmNewPassword" className="font-semibold">
                Confirm New Password
              </label>
              <span className="flex-between gap-4 p-3 bg-[#283246] rounded-xl">
                <input className="flex-1 outline-none" {...register("confirmPassword")} type={showPassword ? "text" : "password"} id="confirmNewPassword" placeholder="Confirm your New Password" />
                <button type="button" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeClosed className="text-xl" /> : <LuEye className="text-xl" />}
                </button>
              </span>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </section>
        <button type="submit" disabled={isSubmitting} className={`bg-third py-3 px-15 hover:text-primary font-semibold cursor-pointer rounded-xl ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
          {isSubmitting ? "Updating..." : "Update Changes"}
        </button>
      </form>
    </>
  );
};

export default AccountSettings;
