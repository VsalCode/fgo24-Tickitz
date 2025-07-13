import { RiArrowDropDownLine } from "react-icons/ri";
import { MdCalendarToday } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MovieAdmin = () => {
  // const dispatch = useDispatch();
  const listMovie = useSelector((state) => state.admin.listMovie);

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
            {listMovie.map((movie, index) => (
              <tr key={movie.id} className="text-center border-b border-gray-700">
                <td className="px-4 py-3 text-sm">{index + 1}.</td>
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
                    // onClick={() => dispatch(removeMovieActions(movie.id))}
                    className="cursor-pointer bg-error text-white p-1 rounded-sm hover:bg-red-700"
                  >
                    <HiOutlineTrash className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MovieAdmin;