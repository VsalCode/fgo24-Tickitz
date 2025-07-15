import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GiTicket } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import qr from "../assets/images/QR.svg";
import http from "../utils/axios";

const TicketResult = () => {
  const { queryId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setIsLoading(true);
        const response = await http(token).get("/transactions");
        const data = response.data.results

          
          if (queryId) {
            setTicketData({
              ...data,
              date: new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              time: new Date(data.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          } else {
            toast.error("Ticket not found");
          }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to fetch ticket data");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && queryId) {
      fetchTicketData();
    }
  }, [queryId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-third mb-4"></div>
          <p className="text-white text-xl">Loading ticket data...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
        <p className="text-white text-xl">Ticket not found</p>
        <Link to="/" className="text-third mt-4">Back to Home</Link>
      </div>
    );
  }

  return (
    <section className="bg-primary text-white h-fit flex flex-col items-center py-35 gap-7 ">
      <div className="w-fit sm:mx-5 mx-0 flex flex-col items-center gap-7">
        <Toaster />
        <p className="text-3xl font-semibold text-third text-center">Thank You For Purchasing</p>
        <div className="bg-white shadow-2xl h-fit flex flex-col gap-7 px-5 py-7">
          <div className="flex flex-col items-center gap-2 text-primary text-center py-3 font-bold">
            <p className="flex items-center gap-2">
              <GiTicket className="text-xl" />
              CINEVO.id
            </p>
            <img src={qr} alt="QR Code" className="w-32 h-32" />
            <p>
              Total : <span className="bg-third text-secondary font-bold rounded-xl px-2 py-1">$ {ticketData.amount}</span>
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-7 text-primary">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Movie</p>
                <p className="italic border-none outline-none pb-5">{ticketData.title}</p>
              </div>
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Category</p>
                <p className="italic border-none outline-none pb-5 flex-wrap">
                  {ticketData.genre.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Date</p>
                <p className="italic border-none outline-none pb-5">{ticketData.date}</p>
              </div>
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Time</p>
                <p className="italic border-none outline-none pb-5">{ticketData.time}</p>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Count</p>
                <p className="italic border-none outline-none pb-5">{ticketData.seat.length}</p>
              </div>
              <div className="flex flex-col gap-3 border-b-1">
                <p className="font-bold">Seats</p>
                <p className="italic border-none outline-none pb-5">{ticketData.seat.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => toast.success("Ticket Downloaded!")}
            className="bg-third text-primary md:text-base text-sm font-bold px-10 py-3 rounded-md cursor-pointer"
          >
            Download Your Ticket
          </button>
          <Link
            to="/"
            replace
            className="bg-secondary text-center text-white md:text-base text-sm font-bold px-10 py-3 rounded-md cursor-pointer"
          >
            Back To Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TicketResult;