import { FaCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookTicketActions } from "../../redux/reducer/ticket";
import toast from "react-hot-toast";
import fallback from "../../assets/images/fallback.png";

const OrderPage = () => {
  const nav = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const dataBookingTicket = useSelector((state) => state.ticket.tempHistoryBooking);

  const filtered = dataBookingTicket?.find((e) => e?.idTransaction === id);

  useEffect(() => {
    if (!filtered) {
      toast.error("Booking data not found");
      nav("/");
    }
  }, [filtered, nav]);

  const movie = {
    ...filtered,
    poster: filtered?.poster || fallback,
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const columns = Array.from({ length: 14 }, (_, i) => i + 1);
  const soldSeats = ["C1", "C2", "C3", "F9"];
  const loveNestSeats = ["E8", "E9"];

  const handleSeatClick = (seat) => {
    if (soldSeats.includes(seat) || loveNestSeats.includes(seat)) {
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const ticketPrice = 10;
  const totalPayment = selectedSeats.length * ticketPrice;

  const HandleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error("You haven't selected any seats!");
      return;
    }

    const updatedBooking = {
      ...filtered,
      amount: totalPayment,
      seats: selectedSeats,
    };

    dispatch(bookTicketActions(updatedBooking));

    nav(`/payment/${id}`, { replace: true });
  };

  return (
    <section className="bg-primary text-white flex flex-col items-center gap-10 sm:py-30 py-20">
      <section className="sm:flex items-center hidden">
        <div className="flex-col flex-center gap-3">
          <div className="bg-green-700 text-white font-semibold rounded-full w-9 h-9 flex-center">
            <FaCheck />
          </div>
          <p>Dates & Time</p>
        </div>
        <div className="flex before:content-['------------'] after:content-['------------']">
          <div className="flex flex-col flex-center gap-3 px-5">
            <div className="bg-third text-primary font-bold rounded-full w-9 h-9 flex-center">2</div>
            <p>Seat</p>
          </div>
        </div>
        <div className="flex flex-col flex-center gap-3">
          <div className="bg-secondary text-white font-semibold rounded-full w-9 h-9 flex-center">3</div>
          <p>Payment</p>
        </div>
      </section>
      <section className="flex lg:flex-row flex-col gap-5 sm:mx-7 mx-5 sm:bg-primary ">
        <aside className="sm:min-w-[600px] w-full h-fit rounded-xl sm:bg-secondary bg-primary shadow-xl sm:p-4 p-0">
          <div className="sm:h-[143px] h-fit w-full flex sm:flex-row sm:justify-between sm:items-center flex-col p-3 gap-7">
            <div className="w-[184px] h-full object-cover overflow-hidden rounded-lg">
              <img
                src={movie.poster}
                onError={(e) => {
                  e.currentTarget.src = fallback;
                }}
                alt="poster_movie"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-4">
              <p className="text-xl font-semibold">{movie?.title || "Movie Title"}</p>
              <div className="flex gap-2">
                {movie?.genres?.slice(0, 2).map((item, index) => (
                  <div key={`list-genre-${index}`} className="border px-2 py-1 rounded text-sm">
                    {item.name}
                  </div>
                ))}
              </div>
              <p>Regular - {movie?.time || "00:00"}</p>
            </div>
            <div>
              <button className="bg-third text-primary md:text-base text-sm font-bold p-2 rounded-md cursor-pointer">Change Now</button>
            </div>
          </div>
          <div className="p-3 mt-10">
            <p className="text-xl font-semibold">Choose Your Seat</p>
            <div className="mt-5">
              <div className="text-center mb-3 font-semibold">SCREEN</div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-15 gap-1">
                  <div></div>
                  {columns.map((col) => (
                    <div key={col} className={`text-center font-semibold `}>
                      {col}
                    </div>
                  ))}
                </div>
                {rows.map((row) => (
                  <div key={row} className="grid grid-cols-15 gap-1 items-center">
                    <div className="font-semibold">{row}</div>
                    {columns.map((col) => {
                      const seat = `${row}${col}`;
                      const isSold = soldSeats.includes(seat);
                      const isLoveNest = loveNestSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          className={`md:size-8 sm:size-7 size-4 rounded cursor-pointer ${
                            isSold ? "bg-gray-500 cursor-not-allowed" : isLoveNest ? "bg-pink-400 cursor-not-allowed" : isSelected ? "bg-blue-500" : "bg-gray-200 hover:bg-gray-300"
                          } `}
                          disabled={isSold || isLoveNest}
                        ></button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <p className="font-semibold">Seating Key</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-pink-400 rounded"></div>
                    <span>Love Nest</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <span>Sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <aside className="md:min-w-[330px] w-full h-fit flex flex-col gap-5">
          <div className="sm:bg-secondary bg-primary p-5 items-center rounded-lg">
            <div className="text-center text-2xl mb-8 font-bold text-third">
              <p>
                <span>{movie?.cinema || "Cinema Name"}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 mb-8">
              <span className="text-start">Movie selected</span>
              <span className="text-end font-semibold">{movie?.title || "Movie Title"}</span>
            </div>
            <div className="grid grid-cols-2 mb-8">
              <span className="text-start">{movie?.date || "Date"}</span>
              <span className="text-end font-semibold">{movie?.time || "Time"}</span>
            </div>
            <div className="grid grid-cols-2 mb-8">
              <span className="text-start">One ticket price</span>
              <span className="text-end font-semibold">$10</span>
            </div>
            <div className="grid grid-cols-2 mb-8">
              <span className="text-start">Seat choosed</span>
              <span className="text-end font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="grid grid-cols-2 my-5 text-xl font-bold">
              <span className="text-start">Total Payment</span>
              <span className="text-end font-semibold text-third">${totalPayment}</span>
            </div>
          </div>
          <button onClick={HandleCheckout} className="bg-third text-primary font-bold w-full py-4 rounded-md cursor-pointer md:text-base text-sm hover:bg-yellow-500 transition-colors">
            Checkout Now
          </button>
        </aside>
      </section>
    </section>
  );
};

export default OrderPage;
