import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ValidationMovies } from "../../components/ValidationMovies";

const EditMoviePage = () => {
  const { id } = useParams();
  // const dispatch = useDispatch();
  const nav = useNavigate();
  const movie = useSelector((state) => state.admin.listMovie.find((m) => m.id === id));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ValidationMovies),
    defaultValues: movie,
  });

  const handleEditMovie = (data) => {
    // dispatch(editMovieActions({ id, movie: data }));
    console.log(data)
    toast.success("Movie updated successfully!");
    setTimeout(() => {
      nav("/movies-admin");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(handleEditMovie)} className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[65svw] w-full h-fit sm:p-8 py-6 px-4">
      <Toaster />
      <p className="sm:text-4xl text-3xl font-medium text-third">Edit Movie</p>

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie {...register("poster")} errors={errors.poster?.message && <p className="text-red-400 text-sm italic">{errors.poster.message}</p>} label="Poster URL" id="poster" placeholder="Input Poster URL" />
        </div>
        <div className="flex-1">
          <InputAddMovie {...register("backdrop")} errors={errors.backdrop?.message && <p className="text-red-400 text-sm italic">{errors.backdrop.message}</p>} label="Backdrop URL" id="backdrop" placeholder="Input Backdrop Image URL" />
        </div>
      </div>

      <InputAddMovie {...register("title")} errors={errors.title?.message && <p className="text-red-400 text-sm italic">{errors.title.message}</p>} label="Movie Name" id="movieName" placeholder="Input Movie Name" />

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie {...register("genre")} errors={errors.genre?.message && <p className="text-red-400 text-sm italic">{errors.genre.message}</p>} label="Category / Genres" id="category" placeholder="Input Movie Category / Genres" />
        </div>
        <div className="flex-1">
          <InputAddMovie
            {...register("vote_average")}
            errors={errors.vote_average?.message && <p className="text-red-400 text-sm italic">{errors.vote_average.message}</p>}
            label="Rating"
            id="rating"
            placeholder="Movie Rating (0-10)"
            type="number"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie
            {...register("release_date")}
            errors={errors.release_date?.message && <p className="text-red-400 text-sm italic">{errors.release_date.message}</p>}
            label="Release date"
            id="release_date"
            placeholder="Input Release date (YYYY-MM-DD)"
            type="date"
          />
        </div>
        <div className="flex-1">
          <InputAddMovie
            {...register("runtime")}
            errors={errors.runtime?.message && <p className="text-red-400 text-sm italic">{errors.runtime.message}</p>}
            label="Duration (Minute)"
            id="duration"
            placeholder="Input Movie duration"
            type="number"
          />
        </div>
      </div>

      <InputAddMovie {...register("director")} errors={errors.director?.message && <p className="text-red-400 text-sm italic">{errors.director.message}</p>} label="Director Name" id="director" placeholder="Input director name" />
      <InputAddMovie {...register("cast")} errors={errors.cast?.message && <p className="text-red-400 text-sm italic">{errors.cast.message}</p>} label="Cast" id="cast" placeholder="Input casts name" />
      <InputAddMovie
        {...register("overview")}
        errors={errors.overview?.message && <p className="text-red-400 text-sm italic">{errors.overview.message}</p>}
        type="textarea"
        label="overview"
        id="overview"
        placeholder="Input movie overview"
      />

      <button className="bg-third cursor-pointer py-4 text-primary font-semibold rounded-xl mt-4" type="submit">
        Update Movie
      </button>
    </form>
  );
};

const InputAddMovie = ({ label, id, type = "text", placeholder, errors, ...props }) => {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={id}>{label}</label>
      {type === "textarea" ? (
        <textarea className="p-3 bg-[#283246] rounded-xl" name={id} id={id} rows={7} placeholder={placeholder} {...props} />
      ) : (
        <input id={id} type={type} placeholder={placeholder} className="p-3 bg-[#283246] rounded-xl" {...props} />
      )}
      {errors}
    </div>
  );
};

export default EditMoviePage;
