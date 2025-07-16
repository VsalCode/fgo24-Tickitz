import { FaCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import http from "../../utils/axios.js";
import bca from "../../assets/images/bca.svg";
import bri from "../../assets/images/bri.svg";
import dana from "../../assets/images/dana.svg";
import googlePay from "../../assets/images/googlePay.svg";
import gopay from "../../assets/images/gopay.svg";
import ovo from "../../assets/images/ovo.svg";
import paypal from "../../assets/images/paypal.svg";
import visa from "../../assets/images/visa.svg";
import { bookTicketActions } from "../../redux/reducer/ticket.js";

const paymentMethodMap = {
  dana: 1,
  googlePay: 2,
  bca: 3,
  ovo: 4,
  paypal: 5,
  gopay: 6,
  visa: 7,
  bri: 8,
};

const PaymentPage = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = useSelector((state) => state.auth.token);
  const dataBookingTicket = useSelector((state) => state.ticket.tempHistoryBooking);

  useEffect(() => {
    console.log("Payment ID from params:", id);
    console.log("Available booking data:", dataBookingTicket);

    if (!id) {
      toast.error("Invalid booking reference");
      nav("/");
      return;
    }

    if (!dataBookingTicket || dataBookingTicket.length === 0) {
      console.log("No booking data found in Redux state");
      toast.error("Booking data not found. Please start booking process again.");
      nav("/");
      return;
    }

    const foundData = dataBookingTicket.find((e) => e?.idTransaction === id);
    console.log("Found booking data:", foundData);

    if (foundData) {
      setBookingData(foundData);
      setIsLoading(false);
    } else {
      console.log("Booking data not found for ID:", id);
      toast.error("Booking data not found. Please start booking process again.");
      nav("/");
    }
  }, [id, dataBookingTicket, nav]);

  useEffect(() => {
    const getUserProfile = async (token) => {
      try {
        const { data } = await http(token).get("/user");
        if (data.success) {
          setCurrentUser(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (token && token) {
      getUserProfile(token);
    } else {
      toast.error("You need to login first");
      nav("/login");
    }
  }, [token, nav]);

  function handlePayment(value) {
    const { fullname, email, paymentMethod, phone } = value;

    if (!paymentMethod) {
      toast.error("You must choose one of Payment Method!");
      return;
    }

    if (!phone) {
      toast.error("You must Input Your Phone Number!");
      return;
    }

    setPaymentData({
      ...bookingData,
      fullname,
      email,
      paymentMethod,
      phone,
      status: "pending",
    });

    setShowModal(true);
  }

  async function confirmPayment() {
    try {
      setIsSubmitting(true);

      const payload = {
        amount: parseInt(paymentData.amount, 10), 
        cinema: paymentData.cinema,
        customer_email: paymentData.email,
        customer_fullname: paymentData.fullname,
        customer_phone: paymentData.phone,
        location: paymentData.location,
        movie_id: parseInt(paymentData.movieId, 10),
        payment_method_id: paymentMethodMap[paymentData.paymentMethod],
        seat: paymentData.seats, 
        show_date: paymentData.date,
        show_time: paymentData.time,
      };

      console.log("Payment payload:", payload);

      const response = await http(token).post("/transactions", payload);

      if (response.data.success) {
        dispatch(
          bookTicketActions({
            ...paymentData,
            status: "paid",
            transactionId: response.data.transactionId,
          })
        );

        toast.success("Payment successful!");
        nav(`/ticket/${id}`, { replace: true });
      } else {
        toast.error(response.data.message || "Payment failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Payment failed");
      console.error("Payment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-third mb-4"></div>
          <p className="text-white text-xl">Loading booking data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && paymentData && (
        <PaymentModal
          total={paymentData.amount} 
          onConfirm={confirmPayment}
          onCancel={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <section className="bg-primary text-white flex flex-col items-center gap-10 py-30">
        <div className="sm:flex sm:flex-row items-center hidden">
          <div className="flex-col flex-center gap-3">
            <div className="bg-green-700 text-white font-semibold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">
              <FaCheck />
            </div>
            <p>Dates & Time</p>
          </div>
          <div className="flex md:before:content-['------------'] md:after:content-['------------'] before:content-['----'] after:content-['----']">
            <div className="flex flex-col flex-center gap-3 px-5">
              <div className="bg-green-700 text-white font-semibold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">
                <FaCheck />
              </div>
              <p>Seat</p>
            </div>
          </div>
          <div className="flex flex-col flex-center gap-3">
            <div className="bg-third text-primary font-bold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">3</div>
            <p>Payment</p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col gap-5 mx-7">
          <form onSubmit={handleSubmit(handlePayment)} className="w-full md:min-w-[732px] sm:min-w-[500px] h-fit sm:bg-secondary bg-primary rounded-2xl shadow-xl sm:px-10 px-3 py-7">
            <p className="text-4xl font-semibold text-third">Payment Information</p>

            <DetailInfo label="DATE & TIME" value={`${bookingData.date}, ${bookingData.time}`} />
            <DetailInfo label="MOVIE TITLE" value={bookingData.title} />
            <DetailInfo label="CINEMA NAME" value={bookingData.cinema} />
            <DetailInfo label="SEAT" value={bookingData.seats?.join(", ") || "No seats selected"} />
            <DetailInfo label="TOTAL PAYMENT" value={`$ ${bookingData.amount}`} variant="text-third font-bold" />

            <p className="text-4xl font-semibold text-star text-third">People Information</p>

            <InputPayment label="Fullname" type="text" defaultValue={currentUser?.fullname || currentUser?.email?.split("@")[0]} {...register("fullname")} />
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}

            <InputPayment
              label="Email"
              type="email"
              defaultValue={currentUser?.email}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

            <InputPayment
              label="Phone Number"
              type="number"
              defaultValue={currentUser?.phone}
              placeholder="Input your phone number.."
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

            <p className="text-4xl font-semibold text-star text-third">Payment Method</p>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-10 relative">
              <PaymentKey srcImage={dana} value="dana" {...register("paymentMethod")} />
              <PaymentKey srcImage={googlePay} value="googlePay" {...register("paymentMethod")} />
              <PaymentKey srcImage={bca} value="bca" {...register("paymentMethod")} />
              <PaymentKey srcImage={ovo} value="ovo" {...register("paymentMethod")} />
              <PaymentKey srcImage={paypal} value="paypal" {...register("paymentMethod")} />
              <PaymentKey srcImage={gopay} value="gopay" {...register("paymentMethod")} />
              <PaymentKey srcImage={visa} value="visa" {...register("paymentMethod")} />
              <PaymentKey srcImage={bri} value="bri" {...register("paymentMethod")} />
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">Please select a payment method</p>}

            <button type="submit" className="bg-third text-primary font-bold w-full py-4 rounded-md cursor-pointer mt-10">
              Pay Your Order
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

const PaymentModal = ({ total, onConfirm, onCancel, isSubmitting }) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 2);
  const tanggal = dueDate.getDate();
  const bulan = dueDate.getMonth();
  const tahun = dueDate.getFullYear();

  return (
    <section className="z-100 position fixed w-full h-full TOP-0 bg-[#00000099] flex-center">
      <div className="bg-white h-fit lg:w-[40%] sm:w-[70%] w-[90%] sm:text-sm text-[10px] rounded-4xl text-primary flex flex-col p-7">
        <p className="sm:text-2xl text-sm text-center font-semibold mb-5">Payment Info</p>
        <div className="text-lg grid grid-cols-2 mb-8 sm:text-sm text-[12px]">
          <span className="text-start text-[#8692A6]">No. Rekening Virtual:</span>
          <span className="text-end font-semibold">12321328913829724</span>
        </div>
        <div className="text-lg grid grid-cols-2 mb-8 sm:text-sm text-[12px]">
          <span className="text-start text-[#8692A6]">Total Payment: </span>
          <span className="text-end font-bold">${total}</span>
        </div>
        <p>
          Pay this payment bill before it is due, <span className="text-[#a51414] font-bold">on {tanggal + 2 + "-" + (bulan + 1) + "-" + tahun}</span>. If the bill has not been paid by the specified time, it will be forfeited
        </p>
        <button onClick={onConfirm} disabled={isSubmitting} type="submit" className="bg-third text-secondary font-bold w-full py-4 rounded-md cursor-pointer mt-5">
          {isSubmitting ? "Processing..." : "Pay Your Order"}
        </button>
        <button className="text-secondary font-bold mt-5 cursor-pointer" onClick={onCancel}>
          Pay Later
        </button>
      </div>
    </section>
  );
};

export const DetailInfo = ({ label, value, variant }) => {
  return (
    <div className="flex flex-col gap-3 my-10">
      <p className="font-bold">{label}</p>
      <input className={`${variant} italic border-none outline-none`} name="payment" value={value} readOnly />
      <hr />
    </div>
  );
};

export const InputPayment = ({ label, type, ...props }) => {
  return (
    <div className="flex flex-col gap-3 my-10 cursor-pointer">
      <label>{label}</label>
      <input className="border p-3 rounded-lg" type={type} {...props} />
    </div>
  );
};

export const PaymentKey = ({ srcImage, value, ...props }) => {
  return (
    <label className="bg-white border-third border-2 opacity-30 rounded-xl py-2 flex justify-center items-center cursor-pointer has-checked:opacity-80">
      <input type="radio" value={value} name="payment" className="peer hidden" id="payment-method" {...props} />
      <img className="object-scale-down" src={srcImage} alt="payment_method" />
    </label>
  );
};

export default PaymentPage;