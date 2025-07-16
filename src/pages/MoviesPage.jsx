import { useSearchParams } from "react-router-dom";
import Subscribe from "../components/Subscribe";
import Button from "../components/Button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoFilterSharp, IoSearchSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import fallback from "../assets/images/fallback.png";
import banner from "../assets/images/banner-movie.png";
import { useEffect, useState } from "react";
import http from "../utils/axios";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  // const [totalMovies, setTotalMovies] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get("search") || "";
  const filter = searchParams.get("genres") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const { data } = await http().get("/movies", {
          params: { search: query, genres: filter, page, limit }
        });

        if (!data?.success) {
          throw new Error(data?.message || "Failed to fetch movies");
        }

        const formattedMovies = data.results.map(movie => ({
          ...movie,
          poster: movie.poster_path,
          backdrop: movie.backdrop_path,
          genre: movie.genres.join(", "),
          vote_average: movie.vote_average
        }));

        setMovies(formattedMovies);
        // setTotalMovies(data.pageInfo.total);
        setTotalPages(data.pageInfo.totalPages);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page, query, filter, limit]);

  const handleSearch = (data) => {
    const { query: searchQuery } = data;
    setSearchParams({
      page: "1",
      ...(searchQuery && { search: searchQuery }),
      ...(filter && { genres: filter }),
      limit
    });
  };

  const handleGenreFilter = (data) => {
    const { genres: selectedGenres } = data;
    setSearchParams({
      page: "1",
      ...(query && { search: query }),
      ...(selectedGenres.length > 0 && { genres: selectedGenres.join(",") }),
      limit
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <section className="relative pt-16 md:pt-20 lg:pt-24 flex justify-center text-white bg-primary">
        <div className="relative w-full max-w-7xl mx-4 sm:mx-6 lg:mx-8">
          <div className="bg-gradient-to-b from-transparent to-primary absolute z-10 rounded-3xl w-full h-full flex flex-col items-start gap-4 sm:gap-6 justify-end p-6 sm:p-8 lg:p-12">
            <div className="chip bg-third text-white px-3 py-1 rounded-full text-sm">LIST MOVIE OF THE WEEK</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              Experience the Magic of Cinema: <span className="text-third">Book Your Tickets Today</span>
            </h3>
            <p className="text-sm sm:text-base font-medium">Sign up and get tickets with exclusive discounts</p>
          </div>
          <img className="w-full rounded-3xl object-cover h-64 sm:h-80 lg:96" src={banner} alt="Movie Banner" />
        </div>
      </section>
      
      <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-white bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-10 mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Now Showing in Cinemas
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-8 md:mb-12">
            <form onSubmit={handleSubmit(handleSearch)} className="w-full lg:w-1/2">
              <h6 className="font-bold mb-4 text-lg">Find Movie</h6>
              <span className="bg-white border-third text-primary flex items-center border rounded-full w-full max-w-[350px] px-5 py-2">
                <button type="submit">
                  <IoSearchSharp className="text-xl" />
                </button>
                <input
                  type="text"
                  className="outline-none border-0 ps-3 w-full grow text-secondary"
                  placeholder="Search Movie..."
                  defaultValue={query}
                  {...register("query")}
                />
              </span>
            </form>
            
            <div className="w-full lg:w-3/4">
              <h6 className="font-bold mb-4 text-lg">Genre Filters</h6>
              <form onSubmit={handleSubmit(handleGenreFilter)} className="flex flex-wrap gap-3">
                <label className="border-white border-1 md:px-4 md:py-1 px-2 rounded-full font-bold cursor-pointer has-[:checked]:bg-gray-700 has-[:checked]:text-third has-[:checked]:border-none flex-center">
                  <input className="appearance-none" value="Action" {...register("genres")} type="checkbox" />
                  <span className="text-sm">ACTION</span>
                </label>
                <label className="border-white border-1 md:px-4 md:py-1 px-2 rounded-full font-bold cursor-pointer has-[:checked]:bg-gray-700 has-[:checked]:text-third has-[:checked]:border-none flex-center">
                  <input className="appearance-none" value="Comedy" {...register("genres")} type="checkbox" />
                  <span className="text-sm">COMEDY</span>
                </label>
                <label className="border-white border-1 md:px-4 md:py-1 px-2 rounded-full font-bold cursor-pointer has-[:checked]:bg-gray-700 has-[:checked]:text-third has-[:checked]:border-none flex-center">
                  <input className="appearance-none" value="Drama" {...register("genres")} type="checkbox" />
                  <span className="text-sm">DRAMA</span>
                </label>
                <label className="border-white border-1 md:px-4 md:py-1 px-2 rounded-full font-bold cursor-pointer has-[:checked]:bg-gray-700 has-[:checked]:text-third has-[:checked]:border-none flex-center">
                  <input className="appearance-none" value="Horror" {...register("genres")} type="checkbox" />
                  <span className="text-sm">HORROR</span>
                </label>
                <Button type="submit" style="flex items-center gap-2 border bg-third text-primary text-gray-300">
                  <IoFilterSharp />
                  <span className="text-sm">FILTER GENRES</span>
                </Button>
              </form>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl">Loading movies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-xl">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-between">
                {movies.length > 0 ? (
                  movies.map((item) => (
                    <Link to={`/movieDetail/${item.id}`} key={item.id} className="flex flex-col justify-between w-full max-w-xs transition-transform duration-300">
                      <div className="relative transition-transform duration-300 hover:scale-102">
                        {item.vote_average > 7 && (
                          <div className="absolute font-semibold text-primary bg-third shadow-lg px-3 py-1 rounded-br-xl rounded-tl-lg">
                            Recommended
                          </div>
                        )}
                        <img
                          className="rounded-xl object-cover w-full h-80 md:h-96"
                          src={item.poster || fallback}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src = fallback;
                          }}
                        />
                      </div>
                      <div className="flex flex-col pt-4 gap-3 text-center">
                        <h6 className="font-semibold text-base md:text-lg line-clamp-1">
                          {item.title}
                        </h6>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {item.genre.split(", ").map(
                            (genre, index) =>
                              genre && (
                                <div key={`${item.id}-genre-${index}`} className="text-xs bg-gray-700 text-third font-medium px-2 py-1 rounded-full">
                                  {genre}
                                </div>
                              )
                          )}
                        </div>
                        <Link to={`/movieDetail/${item.id}`} className="bg-third text-primary text-sm md:text-base font-semibold py-2 px-4 rounded-md hover:bg-secondary hover:text-white transition-colors">
                          View Details
                        </Link>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center col-span-full py-12 text-xl">
                    No movies found
                  </p>
                )}
              </div>
              
              <div className="flex flex-row justify-center items-center gap-5 mt-10 md:mt-12">
                <Button
                  className="button-icon md:text-lg text-sm bg-third disabled:bg-gray-700 disabled:text-third"
                  disabled={page === 1}
                  onClick={() =>
                    setSearchParams({
                      page: String(page - 1),
                      ...(query && { search: query }),
                      ...(filter && { genres: filter }),
                      limit
                    })
                  }
                >
                  <FaArrowLeft />
                </Button>
                
                {getPageNumbers().map((pageNum) => (
                  <Button
                    key={pageNum}
                    className={`cursor-pointer font-bold size-10 rounded-full md:text-lg text-sm ${
                      page === pageNum 
                        ? "bg-gray-700 text-third" 
                        : "bg-third text-primary"
                    }`}
                    onClick={() =>
                      setSearchParams({
                        page: String(pageNum),
                        ...(query && { search: query }),
                        ...(filter && { genres: filter }),
                        limit
                      })
                    }
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  className="button-icon md:text-lg text-sm bg-third disabled:bg-gray-700 disabled:text-third"
                  disabled={page === totalPages}
                  onClick={() =>
                    setSearchParams({
                      page: String(page + 1),
                      ...(query && { search: query }),
                      ...(filter && { genres: filter }),
                      limit
                    })
                  }
                >
                  <FaArrowRight />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      <Subscribe />
    </>
  );
};

export default MoviesPage;