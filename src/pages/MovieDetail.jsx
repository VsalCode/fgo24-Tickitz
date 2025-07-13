import Button from "../components/Button";
import React, { useEffect, useState } from "react";
import http from "../utils/axios"; 
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { bookTicketActions } from "../redux/reducer/ticket";
import { nanoid } from "@reduxjs/toolkit";
import fallback from "../assets/images/fallback.png";
import fallbackBackdrop from "../assets/images/fallback_backdrop.png";

const MovieDetail = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const credentials = useSelector((state) => state.auth.credentials);

  function handleBookTicket(value) {
    const { cinema, date, time, location } = value;

    if (!credentials?.token) {
      toast.error("You must Login or Register!");
      return;
    }

    if (!date) {
      toast.error("You must choose date!");
      return;
    }

    if (!time) {
      toast.error("You must choose time!");
      return;
    }

    if (!location) {
      toast.error("You must choose location!");
      return;
    }

    if (!cinema) {
      toast.error("You must choose one cinema!");
      return;
    }

    const idTransaction = String(nanoid());

    const bookTicket = {
      idTransaction: idTransaction,
      title: data.title,
      genres: data.genres,
      cinema: cinema,
      date: date,
      time: time,
      poster: data?.poster || fallback,
      location: location,
    };

    dispatch(bookTicketActions(bookTicket));
    nav(`/order/${idTransaction}`, { replace: true });
  }

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await http().get(`/movies/${id}`);

        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch movie details");
        }

        const movieData = response.results;
        
        if (!movieData) {
          throw new Error("Movie not found");
        }

        setData({
          ...movieData,
          backdrop: movieData.backdrop_path || fallbackBackdrop,
          poster: movieData.poster_path || fallback,
          genres: movieData.genres.map((name, index) => ({
            id: `genre-${index}-${Date.now()}`,
            name: name.trim(),
          })),
          credits: {
            cast: movieData.casts.map((name) => ({ name: name.trim() })),
            crew: movieData.directors.map((name) => ({
              job: "Director",
              name: name.trim()
            }))
          }
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load movie details");
        console.error("Movie fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const director = data.credits?.crew?.find((e) => e.job === "Director");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-primary">
        <p className="text-white text-xl">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-primary">
        <p className="text-red-500 text-xl">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <section className="flex flex-col justify-end mb-15 pt-25">
        <div className="flex justify-center relative">
          <div className="bg-[linear-gradient(180deg,_rgba(15,16,13,0)_0%,_rgba(15,16,13,0.8)_65.1%)] h-full w-full rounded-[40px] absolute z-40"></div>
          <img
            className="h-[520px] object-cover w-full rounded-[40px] relative"
            src={data.backdrop || fallbackBackdrop}
            onError={(e) => {
              e.currentTarget.src = fallbackBackdrop;
            }}
            alt="movie-backdrop"
          />
        </div>

        <div className="flex lg:flex-row lg:justify-between flex-col items-center sm:gap-15 px-20 mt-[-220px] z-50">
          <div className="flex-center lg:w-[25vw]">
            <img
              className="rounded-2xl h-100 w-250 object-contain"
              src={data.poster || fallback}
              alt="movie-poster"
              onError={(e) => {
                e.currentTarget.src = fallback;
              }}
            />
          </div>
          <div className="flex flex-col gap-15 py-2 h-fit text-white w-[75vw]">
            <div id="movie-overview" className="flex flex-col items-start justify-center gap-3">
              <p className="font-bold md:text-3xl text-2xl bg-third text-primary rounded-sm px-5 py-1">
                {data.title}
              </p>
              <p className="text-base font-medium">{data.overview}</p>
              <div id="movie-information" className="flex sm:flex-row flex-col gap-3">
                {data.genres?.map((genre) => (
                  <div
                    key={genre.id}
                    className="text-third border-2 font-medium px-3 py-1 rounded-full sm:text-base text-sm"
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-white text-base flex flex-col gap-4">
              <div className="grid sm:grid-cols-3 ">
                <div className="flex flex-col justify-end sm:pb-0 pb-5">
                  <p className="text-third">Release Date</p>
                  <p className="font-bold">{data.release_date}</p>
                </div>
                <div className=" flex flex-col justify-end sm:pb-0 pb-5">
                  <p className="text-third">Duration</p>
                  <p className="font-bold">{data.runtime} minutes</p>
                </div>
                <div className=" flex flex-col justify-end sm:pb-0 pb-5">
                  <p className="text-third">Directed By</p>
                  <p className="font-bold">{director?.name || "Unknown"}</p>
                </div>
              </div>
              <div>
                <div>
                  <p className="text-third">Cast</p>
                  <p className="text-sm">
                    {data.credits?.cast?.map((cast) => cast.name).join(", ") || "No cast information"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <form
        onSubmit={handleSubmit(handleBookTicket)}
        className="bg-sixth sm:p-20 p-10 h-fit flex flex-col"
      >
        <div className="flex md:flex-row md:justify-between flex-col pb-15">
          <h3 className="font-semibold md:mb-0 mb-5">Book Tickets</h3>
          <Button type="submit" style="bg-third text-secondary font-extrabold md:py-0 py-2">
            BOOK NOW
          </Button>
        </div>
        <div className="flex lg:flex-row flex-col gap-10">
          <div className="w-full">
            <h5 className="font-semibold pb-5">Choose Date</h5>
            <SelectOptions {...register("date", )} type="date" id="date" name="date" />
          </div>
          <div className="w-full">
            <h5 className="font-semibold pb-5">Choose Time</h5>
            <SelectOptions {...register("time", )} type="time" id="time" name="time" />
          </div>
          <div className="w-full">
            <h5 className="font-semibold pb-5">Choose Location</h5>
            <SelectOptions {...register("location", )} type="location" />
          </div>
        </div>
        <div>
          <h5 className="font-semibold pb-10 pt-15">Choose Cinema</h5>
          <div className="flex lg:flex-row flex-col gap-5">
            <SponsorCheckbox cinema="ebv.id" {...register("cinema" )} />
            <SponsorCheckbox cinema="hiflix" {...register("cinema" )} />
            <SponsorCheckbox cinema="CineOne21" {...register("cinema" )} />
            <SponsorCheckbox cinema="idlix" {...register("cinema" )} />
          </div>
        </div>
      </form>
    </>
  );
};

export default MovieDetail;

function SponsorCheckbox({ cinema, ...props }) {
  return (
    <label
      className={`sm:w-[269px] w-full h-[153px] px-5 flex flex-col justify-center gap-7 rounded-xl cursor-pointer border text-fourth has-checked:bg-third has-checked:text-secondary relative`}
    >
      <div className="flex justify-end">
        <input 
          type="radio" 
          name="cinema" 
          value={`${cinema}`} 
          className="sr-only" 
          {...props} 
        />
        <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-transparent checked:bg-secondary"></div>
        </div>
      </div>
      <h2 className="font-semibold sm:text-4xl text-3xl">{cinema}</h2>
    </label>
  );
}

export const SelectOptions = ({ id, type, name, ...props }) => {
  if (type === "location") {
    return (
      <label
        htmlFor={type}
        className="bg-white text-primary font-semibold flex-between gap-5 rounded-full border py-3 px-5 w-full"
      >
        <IoSearch className="text-xl" />
        <select 
          id={type} 
          name={name} 
          {...props} 
          className="grow outline-none bg-transparent"
        >
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Bekasi">Bekasi</option>
          <option value="Depok">Depok</option>
        </select>
      </label>
    );
  }
  
  return (
    <label htmlFor={id} className="bg-white text-primary font-semibold flex-between gap-5 rounded-full border py-3 px-3">
      <IoSearch className="text-xl" />
      <input 
        className="grow outline-none bg-transparent"
        type={type}
        id={id}
        name={name}
        {...props}
      />
    </label>
  );
};