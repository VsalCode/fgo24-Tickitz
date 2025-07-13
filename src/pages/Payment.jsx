// import { FaCheck } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// // import { paymentAction } from "../redux/reducer/ticket";
// import toast, { Toaster } from "react-hot-toast";
// import bca from "../assets/images/bca.svg";
// import bri from "../assets/images/bri.svg";
// import dana from "../assets/images/dana.svg";
// import googlePay from "../assets/images/googlePay.svg";
// import gopay from "../assets/images/gopay.svg";
// import ovo from "../assets/images/ovo.svg";
// import paypal from "../assets/images/paypal.svg";
// import visa from "../assets/images/visa.svg";

// const Payment = () => {
//   const nav = useNavigate();
//   // const [dataPayment, setDataPayment] = useState({});
//   // const dispatch = useDispatch();
//   const { queryId } = useParams();
//   const [showModal, setShowModal] = useState(false);
//   const { register, handleSubmit } = useForm();
//   const userLogin = useSelector((state) => state.auth.currentUser);
//   const checkDataUsers = useSelector((state) => state.users.users);
//   const dataBookingTicket = useSelector((state) => state.ticket.historyBooking);
//   const currentUser = checkDataUsers.filter((e) => e.id === userLogin.id && userLogin.email === e.email)[0];
//   const filtered = dataBookingTicket?.filter((e) => e?.idTransaction === queryId && e.seat && e.total)[0];

//   function handlePayment(value) {
//     const { email, fullname, paymentMethod, phone } = value;

//     if (paymentMethod === null) {
//       toast.error("You must choose one of Payment Method!");
//       return;
//     }

//     if (phone === "") {
//       toast.error("You must Input Your Phone Number!");
//       return;
//     }

//     const dataPayment = {
//       ...filtered,
//       fullname: fullname,
//       email: email,
//       paymentMethod: paymentMethod,
//       phone: phone,
//       status: "paid",
//     };

//     // setDataPayment(dataPayment);
//     setShowModal(true);
//   }

//   function confirmPayment() {
//     // dispatch(paymentAction(dataPayment));
//     nav(`/ticket/${queryId}`, { replace: true });
//   }

//   const date = new Date();
//   const tahun = date.getFullYear();
//   const bulan = date.getMonth();
//   const tanggal = date.getDate();

//   return (
//     <>
//       {showModal === true && (
//         <section className="z-100 position fixed w-full h-full TOP-0 bg-[#00000099] flex-center">
//           <Toaster />
//           <div className="bg-white h-fit lg:w-[40%] sm:w-[70%] w-[90%] sm:text-sm text-[10px] rounded-4xl text-primary flex flex-col p-7">
//             <p className="sm:text-2xl text-sm text-center font-semibold mb-5">Payment Info</p>
//             <div className="text-lg grid grid-cols-2 mb-8  sm:text-sm text-[12px]">
//               <span className="text-start text-[#8692A6]">No. Rekening Virtual:</span>
//               <span className="text-end font-semibold">12321328913829724</span>
//             </div>
//             <div className="text-lg grid grid-cols-2 mb-8 sm:text-sm text-[12px]">
//               <span className="text-start text-[#8692A6]">Total Payment: </span>
//               <span className="text-end font-bold">${filtered.total}</span>
//             </div>
//             <p>
//               Pay this payment bill before it is due, <span className="text-[#a51414] font-bold">on {tanggal + 2 + "-" + (bulan + 1) + "-" + tahun}</span>. If the bill has not been paid by the specified time, it will be forfeited
//             </p>
//             <button onClick={confirmPayment} type="submit" className="bg-third text-secondary font-bold w-full py-4 rounded-md cursor-pointer mt-5">
//               Pay Your Order
//             </button>
//             <button className="text-secondary font-bold mt-5 cursor-pointer" onClick={() => setShowModal(false)}>
//               Pay Later
//             </button>
//           </div>
//         </section>
//       )}

//       <section className="bg-primary text-white flex flex-col items-center gap-10 py-30">
//         <div className="sm:flex sm:flex-row items-center hidden">
//           <div className="flex-col flex-center gap-3">
//             <div className="bg-green-700 text-white font-semibold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">
//               <FaCheck />
//             </div>
//             <p>Dates & Time</p>
//           </div>
//           <div className="flex md:before:content-['------------'] md:after:content-['------------'] before:content-['----'] after:content-['----']">
//             <div className="flex flex-col flex-center gap-3 px-5">
//               <div className="bg-green-700 text-white font-semibold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">
//                 <FaCheck />
//               </div>
//               <p>Seat</p>
//             </div>
//           </div>
//           <div className="flex flex-col flex-center gap-3">
//             <div className="bg-third text-primary font-bold rounded-full md:text-md text-sm sm:size-9 size-7 flex-center">3</div>
//             <p>Payment</p>
//           </div>
//         </div>
//         <div className="flex lg:flex-row flex-col gap-5 mx-7">
//           <form onSubmit={handleSubmit(handlePayment)} className="w-full md:min-w-[732px] sm:min-w-[500px] h-fit sm:bg-secondary bg-primary rounded-2xl shadow-xl sm:px-10 px-3 py-7">
//             <p className="text-4xl font-semibold text-third">Payment Information</p>
//             <DetailInfo label="DATE & TIME" value={filtered.date + ", " + filtered.time} />
//             <DetailInfo label="MOVIE TITLE" value={filtered.title} />
//             <DetailInfo label="CINEMA NAME" value={filtered.cinema} />
//             <DetailInfo label="SEAT" value={filtered.seat} />
//             <DetailInfo label="TOTAL PAYMENT" value={"$ " + filtered.total} variant="text-third font-bold" />
//             <p className="text-4xl font-semibold text-star text-third">People Information</p>
//             <InputPayment label="Fullname" type="text" defaultValue={currentUser.fullname ? currentUser.fullname : currentUser?.email && currentUser.email?.split("@").splice(0, 1)} {...register("fullname")} />
//             <InputPayment label="Email" type="email" defaultValue={currentUser.email} {...register("email")} />
//             <InputPayment label="Phone Number" type="number" defaultValue={currentUser.phone} placeholder="Input your phone number.." {...register("phone")} />
//             <p className="text-4xl font-semibold text-star text-third">Payment Method</p>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-10 relative">
//               <PaymentKey srcImage={dana} value="dana" {...register("paymentMethod")} />
//               <PaymentKey srcImage={googlePay} value="googlePay" {...register("paymentMethod")} />
//               <PaymentKey srcImage={bca} value="bca" {...register("paymentMethod")} />
//               <PaymentKey srcImage={ovo} value="ovo" {...register("paymentMethod")} />
//               <PaymentKey srcImage={paypal} value="paypal" {...register("paymentMethod")} />
//               <PaymentKey srcImage={gopay} value="gopay" {...register("paymentMethod")} />
//               <PaymentKey srcImage={visa} value="visa" {...register("paymentMethod")} />
//               <PaymentKey srcImage={bri} value="bri" {...register("paymentMethod")} />
//             </div>
//             <button type="submit" className="bg-third text-primary font-bold w-full py-4 rounded-md cursor-pointer mt-10">
//               Pay Your Order
//             </button>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Payment;

// export const DetailInfo = ({ label, value, variant }) => {
//   return (
//     <div className="flex flex-col gap-3 my-10">
//       <p className="font-bold">{label}</p>
//       <input className={`${variant} italic border-none outline-none`} name="payment" value={value} />
//       <hr />
//     </div>
//   );
// };

// export const InputPayment = ({ label, type, ...props }) => {
//   return (
//     <div className=" flex flex-col gap-3 my-10 cursor-pointer">
//       <label>{label}</label>
//       <input className="border p-3 rounded-lg" type={`${type}`} {...props} />
//     </div>
//   );
// };

// export const PaymentKey = ({ srcImage, ...props }) => {
//   return (
//     <label className="bg-white border-third border-2 opacity-30 rounded-xl py-2 flex justify-center items-center cursor-pointer has-checked:opacity-80">
//       <input type="radio" name="payment" className="peer hidden" id="payment-method" {...props} />
//       <img className="object-scale-down" src={`${srcImage}`} alt="payment_method" />
//     </label>
//   );
// };
