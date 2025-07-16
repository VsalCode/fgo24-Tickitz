import React from 'react';
import { useState } from "react";
import { MdOutlineMail, MdLockOutline } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import http from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const resetPasswordSchema = yup.object({
  code: yup.string().required("OTP code is required").length(6, "OTP must be 6 digits"),
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ForgotPasswordPage = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmNewPassword: false
  });
  const nav = useNavigate();

  const { 
    register: forgotRegister, 
    handleSubmit: handleForgotSubmit, 
    formState: { errors: forgotErrors } 
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { 
    register: resetRegister, 
    handleSubmit: handleResetSubmit, 
    formState: { errors: resetErrors },
    reset: resetResetForm
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const handleForgotPassword = async (data) => {
    setIsLoading(true);
    try {
      await http().post("/auth/forgot-password", {
        email: data.email
      });
      setEmail(data.email);
      setIsOTPSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setIsResetting(true);
    try {
      await http().post("/auth/reset-password", {
        email,
        code: data.code,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword
      });
      toast.success("Password reset successful! Please login with your new password.");
      nav("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please check your OTP and try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const closeResetModal = () => {
    setIsOTPSent(false);
    resetResetForm();
    setShowPasswords({
      newPassword: false,
      confirmNewPassword: false
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <main className="sm:bg-sixth sm:bg-primary bg-white h-screen py-10 flex-center flex-col font-sans">
      <Toaster />
      <section className="max-w-[500px] w-full h-fit bg-white sm:p-10 p-7 rounded-2xl sm:shadow-2xl">
        <form onSubmit={handleForgotSubmit(handleForgotPassword)}>
          <div className="pb-5">
            <p className="font-semibold pb-3 sm:text-4xl text-2xl">Forgot Password</p>
            <p className="sm:text-xl text-base">OTP will be sent to your email</p>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="email">Email</label>
            <span className="flex items-center gap-4 border sm:px-5 px-2 py-3 rounded-lg">
              <MdOutlineMail className="sm:text-xl text-base" />
              <input 
                {...forgotRegister("email")} 
                className="border-0 outline-none grow sm:text-base text-sm" 
                type="email" 
                placeholder="Enter your email" 
              />
            </span>
            {forgotErrors.email && (
              <p className="text-error text-sm italic">{forgotErrors.email.message}</p>
            )}
          </div>
          <div className="text-center font-medium sm:text-base text-sm">
            <button 
              type="submit" 
              className="cursor-pointer bg-third w-full text-primary font-bold py-3 rounded-lg mb-5 hover:bg-secondary hover:text-white transition-colors flex justify-center items-center" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                "SEND OTP"
              )}
            </button>
            <p>
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </p>
          </div>
        </form>
      </section>

      {/* Reset Password Modal */}
      {isOTPSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-2xl">Reset Password</h3>
              <button 
                onClick={closeResetModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="mb-4">
              We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>
            </p>
            
            <form onSubmit={handleResetSubmit(handleResetPassword)}>
              <div className="flex flex-col gap-4 mb-6">
                {/* OTP Code */}
                <div>
                  <label className="block mb-2">OTP Code</label>
                  <div className="flex items-center gap-4 border sm:px-5 px-2 py-3 rounded-lg">
                    <MdLockOutline className="sm:text-xl text-base" />
                    <input
                      {...resetRegister("code")}
                      className="border-0 outline-none grow sm:text-base text-sm"
                      type="text"
                      placeholder="Enter OTP code"
                      maxLength={6}
                    />
                  </div>
                  {resetErrors.code && (
                    <p className="text-error text-sm italic mt-1">{resetErrors.code.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block mb-2">New Password</label>
                  <div className="flex items-center gap-4 border sm:px-5 px-2 py-3 rounded-lg">
                    <MdLockOutline className="sm:text-xl text-base" />
                    <input
                      {...resetRegister("newPassword")}
                      className="border-0 outline-none grow sm:text-base text-sm"
                      type={showPasswords.newPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="cursor-pointer text-xl"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPasswords.newPassword ? 
                        <LuEyeClosed className="sm:text-xl text-base" /> : 
                        <LuEye className="sm:text-xl text-base" />
                      }
                    </button>
                  </div>
                  {resetErrors.newPassword && (
                    <p className="text-error text-sm italic mt-1">{resetErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-2">Confirm Password</label>
                  <div className="flex items-center gap-4 border sm:px-5 px-2 py-3 rounded-lg">
                    <MdLockOutline className="sm:text-xl text-base" />
                    <input
                      {...resetRegister("confirmNewPassword")}
                      className="border-0 outline-none grow sm:text-base text-sm"
                      type={showPasswords.confirmNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="cursor-pointer text-xl"
                      onClick={() => togglePasswordVisibility("confirmNewPassword")}
                    >
                      {showPasswords.confirmNewPassword ? 
                        <LuEyeClosed className="sm:text-xl text-base" /> : 
                        <LuEye className="sm:text-xl text-base" />
                      }
                    </button>
                  </div>
                  {resetErrors.confirmNewPassword && (
                    <p className="text-error text-sm italic mt-1">{resetErrors.confirmNewPassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-third text-primary font-bold py-3 rounded-lg hover:bg-secondary hover:text-white transition-colors flex justify-center items-center"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  "RESET PASSWORD"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default ForgotPasswordPage;