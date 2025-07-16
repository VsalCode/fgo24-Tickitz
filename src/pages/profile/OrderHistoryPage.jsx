import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import qr from "../../assets/images/QR.svg";
import http from "../../utils/axios"; 

const HistoryItem = ({ item, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section key={`history-payment-${index}`} className="bg-secondary w-full rounded-xl h-fit px-5 py-7">
      <div className="flex-between border-b-2 border-b-third pb-5">
        <div className="flex flex-col gap-3">
          <p>
            {item.date} - {item.time}
          </p>
          <p>{item.title}</p>
        </div>
        <p className="text-third font-bold text-xl">{item.cinema}</p>
      </div>
      <div className="flex-between mt-6">
        <div className="flex-1 flex gap-3">
          <button className="text-[#6E7191] bg-[#6E719133] w-full py-1">Ticket Used</button>
          <button className="text-green bg-[#00BA8833] w-full py-1">Paid</button>
        </div>
        <div className="flex-1 flex justify-end">
          <button onClick={() => setShowDetails(!showDetails)} className="cursor-pointer flex-between">
            <span>Show Details</span>
            {showDetails ? <RiArrowDropUpLine className="text-3xl" /> : <RiArrowDropDownLine className="text-3xl" />}
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="flex flex-col gap-5 mt-6">
          <p className="font-semibold text-xl text-third pb-3">Ticket Information</p>
          <div className="flex gap-5">
            <div className="bg-white">
              <img src={qr} alt="" />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <p>
                Movie: <span className="text-third font-bold">{item.title}</span>
              </p>
              <p>
                Category: <span className="text-third font-bold">{item.genres?.map((e) => e.name).join(", ")}</span>
              </p>
              <p>
                Date: <span className="text-third font-bold">{item.date}</span>
              </p>
              <p>
                Time: <span className="text-third font-bold">{item.time}</span>
              </p>
              <p>
                Seat: <span className="text-third font-bold">{item.seat}</span>
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-bold text-xl">
                TOTAL: <span className="text-third font-bold">$ {item.total}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const OrderHistoryPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await http(token).get("/transactions/history");
        setHistoryData(response.data.results);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

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

  return (
    <>
      <section className="bg-secondary w-full rounded-xl grid grid-cols-2">
        <Link to="/profile" className="text-center py-5 cursor-pointer font-medium hover:opacity-70 transition-colors">
          Account Settings
        </Link>
        <Link to="/order-history" className="text-center py-5 cursor-pointer hover:text-third font-medium border-b-third border-b-4 hover:opacity-70 transition-colors">
          Order History
        </Link>
      </section>
      {historyData.length !== 0 ? (
        <section className="flex flex-col gap-7">
          {historyData?.map((item, index) => (
            <HistoryItem key={`history-payment-${index}`} item={item} index={index} />
          ))}
        </section>
      ) : (
        <section className="text-center py-10">
          <p>You do not have a ticket booking history yet</p>
        </section>
      )}
    </>
  );
};

export default OrderHistoryPage;