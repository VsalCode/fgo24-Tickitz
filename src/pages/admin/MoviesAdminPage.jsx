import { useState, useEffect, useCallback } from "react";
import { RiArrowDropDownLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { MdCalendarToday } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import http from "../../utils/axios";
import { useSelector } from "react-redux";

const MoviesAdminPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState({});
  const token = useSelector((state) => state.auth.token);
  const limit = 5;

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await http().get("/movies", {
        params: { page: currentPage, limit }
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch movies");
      }

      const formattedMovies = data.results.map(movie => ({
        ...movie,
        poster: movie.poster_path,
        backdrop: movie.backdrop_path,
        genre: movie.genres.join(", "),
        release_date: movie.release_date,
        runtime: movie.runtime
      }));

      setMovies(formattedMovies);
      setTotalPages(data.pageInfo.totalPages);
      setTotalMovies(data.pageInfo.total);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred");
      setMovies([]);
      setTotalPages(1);
      setTotalMovies(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      
      const { data } = await http(token).delete(`/admin/movies/${id}`);
      
      if (!data?.success) {
        throw new Error(data?.message || "Failed to delete movie");
      }

      fetchMovies();
      
      if (movies.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message || "An error occurred while deleting the movie");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) {
    return (
      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[75svw] w-full h-fit md:p-8 px-5 py-8">
        <p>Loading movies...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[75svw] w-full h-fit md:p-8 px-5 py-8">
        <p>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[75svw] w-full h-fit md:p-8 px-5 py-8">
      <div className="flex md:flex-row md:justify-between md:gap-0 flex-col gap-5">
        <p className="text-3xl font-medium">List Movie</p>
        <div className="flex md:flex-row flex-col gap-4 text-primary">
          <button className="cursor-pointer bg-[#EFF0F6] flex items-center gap-4 py-1 px-4 rounded-lg">
            <MdCalendarToday /> <span>November 2025</span> <RiArrowDropDownLine className="text-3xl" />
          </button>
          <Link to="/add-movie" className="cursor-pointer bg-third font-semibold gap-3 py-2 px-4 rounded-lg text-center">
            Add Movies
          </Link>
        </div>
      </div>
      
      <div className="mt-5 overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="text-third bg-[#2D2D2D]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">No</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Thumbnail</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Movie Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Genre</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Release Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Duration (minute)</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <tr key={movie.id} className="text-center border-b border-gray-700">
                  <td className="px-4 py-3 text-sm">{(currentPage - 1) * limit + index + 1}.</td>
                  <td className="px-4 py-3 flex justify-center">
                    <img
                      className="size-13 object-cover rounded-md md:size-14"
                      src={movie.poster}
                      alt={movie.title}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-left">{movie.title}</td>
                  <td className="px-4 py-3 text-sm text-left">{movie.genre}</td>
                  <td className="px-4 py-3 text-sm text-left">{movie.release_date}</td>
                  <td className="px-4 py-3 text-sm text-left">{movie.runtime}</td>
                  <td className="px-4 py-3 flex-center gap-2">
                    <Link
                      to={`/edit-movie/${movie.id}`}
                      className="cursor-pointer text-2xl bg-third p-1 text-primary rounded-sm hover:text-gray-300"
                    >
                      <FaRegEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      disabled={deleteLoading[movie.id]}
                      className={`cursor-pointer bg-error text-white p-1 rounded-sm hover:bg-red-700 ${
                        deleteLoading[movie.id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {deleteLoading[movie.id] ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <HiOutlineTrash className="text-2xl" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                  No movies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalMovies > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * limit, totalMovies)}</span> of{" "}
            <span className="font-medium">{totalMovies}</span> movies
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center p-2 rounded-full ${
                currentPage === 1 
                  ? "text-gray-500 cursor-not-allowed" 
                  : "text-third hover:bg-gray-700"
              }`}
              aria-label="Previous page"
            >
              <RiArrowLeftSLine className="text-2xl" />
            </button>
            
            <span className="px-3 py-1 bg-[#2D2D2D] rounded-md text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center p-2 rounded-full ${
                currentPage === totalPages 
                  ? "text-gray-500 cursor-not-allowed" 
                  : "text-third hover:bg-gray-700"
              }`}
              aria-label="Next page"
            >
              <RiArrowRightSLine className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MoviesAdminPage;