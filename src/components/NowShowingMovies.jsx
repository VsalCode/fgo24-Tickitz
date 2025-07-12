import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import http from "../utils/axios";

const NowShowingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getNowShowingMovies() {
    try {
      setIsLoading(true);
      const { data } = await http().get("/movies/now-showing");

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch movies");
      }

      setMovies(data.results || []);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred");
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getNowShowingMovies();
  }, []);

  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button onClick={getNowShowingMovies} className="mt-4 px-4 py-2 bg-third text-primary rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="text-center py-10">
        <p>No movies currently showing</p>
      </div>
    );
  }

  return (
    <div className="w-full my-20">
      <div className="flex  justify-between items-center overflow-hidden">
        <button
          onClick={() => {
            scroll(-470);
          }}
          className="button-icon md:text-lg text-sm"
        >
          <FaArrowLeft />
        </button>
        <p className="md:font-semibold font-bold md:text-4xl sm:text-2xl text-xl">Now Showing in Cinemas</p>
        <button
          onClick={() => {
            scroll(470);
          }}
          className="button-icon md:text-lg text-sm bg-third"
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="scroll-x overflow-x-auto scroll-smooth flex gap-5 justify-items-center py-10 " ref={ref}>
        {movies?.map((item) => (
          <Link to={`/movieDetail/${item.id}`} key={item.id} className="flex flex-col justify-between w-500 hover:scale-102 transition-transform duration-300">
            <div className="relative lg:w-70 w-50">
              {item.vote_average > 7 && <div className="absolute text-primary bg-third font-bold px-2 py-1 rounded-b-lg ">Recommended</div>}
              <img className="rounded-xl object-cover lg:h-105 h-80 w-full" src={item.poster_path} alt="" />
            </div>
            <div className="flex flex-col pt-5 gap-2 w-full">
              <div className="flex justify-center items-center text-center">
                <h6 className="font-semibold line-clamp-1">{item.title}</h6>
              </div>
              <div className="flex justify-center items-center gap-2 ">
                <div className="flex-wrap flex-center gap-2 pt-4">
                  {item.genres.length > 2
                    ? item.genres.map((genre, index) => (
                        <div key={`idx-showing-${index}`} className="text-sm bg-secondary text-third font-medium px-2 py-1 rounded-full">
                          {genre}
                        </div>
                      ))
                    : item.genres.map((genre, index) => (
                        <div key={`idx-showing-${index}`} className="text-sm bg-secondary text-third font-medium px-2 py-1 rounded-full">
                          {genre}
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex-center mt-7">
        <Link to="/movies" className="flex items-center bg-third text-primary font-bold gap-3 rounded-full px-4 py-2">
          <span>VIEW ALL</span>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NowShowingMovies;
