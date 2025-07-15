import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { yupResolver } from "@hookform/resolvers/yup";
import { ValidationMovies } from "../components/ValidationMovies";
import CreatableSelect from "react-select/creatable";
import http from "../utils/axios";

const AddMovie = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ValidationMovies),
    defaultValues: {
      genres: [],
      directors: [],
      casts: [],
    }
  });
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  

  // const stringToOptions = (str) => 
  //   str ? str.split(',').map(item => ({ value: item.trim(), label: item.trim() })) : [];

  const optionsToIds = (options) => options.map(opt => opt.value);

  async function addMovieEndpoint(movie){
    const { data } = await http(token).post("/auth/login", movie, {
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (data.success){
    return data.message
  }
  }

  const handleAddMovie = (data) => {
    const movie = {
      id: nanoid(),
      backdrop_path: data.backdrop,
      casts: optionsToIds(data.casts),
      directors: optionsToIds(data.directors),
      genres: optionsToIds(data.genres),
      overview: data.overview,
      poster_path: data.poster,
      release_date: data.release_date,
      runtime: parseInt(data.runtime),
      title: data.title,
      vote_average: parseFloat(data.vote_average),
    };

    const response = addMovieEndpoint(movie)
    toast.success(`${response}`);

    setTimeout(() => {
      navigate("/movies-admin");
    }, 2000);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#283246',
      border: 'none',
      borderRadius: '12px',
      minHeight: '48px',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#3a4a6b',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'white',
    }),
    input: (base) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#a0aec0',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#283246',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#3a4a6b' : '#283246',
      color: 'white',
    }),
  };

  return (
    <form onSubmit={handleSubmit(handleAddMovie)} className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[65svw] w-full h-fit sm:p-8 py-6 px-4">
      <Toaster />
      <p className="sm:text-4xl text-3xl font-medium text-third">Add New Movie</p>

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie 
            name="poster" 
            control={control}
            errors={errors.poster?.message && <p className="text-red-400 text-sm italic">{errors.poster.message}</p>} 
            label="Poster URL" 
            placeholder="Input Poster URL" 
          />
        </div>
        <div className="flex-1">
          <InputAddMovie 
            name="backdrop" 
            control={control}
            errors={errors.backdrop?.message && <p className="text-red-400 text-sm italic">{errors.backdrop.message}</p>} 
            label="Backdrop URL" 
            placeholder="Input Backdrop Image URL" 
          />
        </div>
      </div>

      <InputAddMovie 
        name="title" 
        control={control}
        errors={errors.title?.message && <p className="text-red-400 text-sm italic">{errors.title.message}</p>} 
        label="Movie Name" 
        placeholder="Input Movie Name" 
      />

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            <label>Category / Genres</label>
            <Controller
              name="genres"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  isMulti
                  styles={customStyles}
                  placeholder="Input Movie Category / Genres (e.g., Action, Comedy)"
                  onChange={(selected) => field.onChange(selected)}
                  value={field.value}
                />
              )}
            />
            {errors.genres?.message && <p className="text-red-400 text-sm italic">{errors.genres.message}</p>}
          </div>
        </div>
        <div className="flex-1">
          <InputAddMovie 
            name="vote_average" 
            control={control}
            errors={errors.vote_average?.message && <p className="text-red-400 text-sm italic">{errors.vote_average.message}</p>} 
            label="Rating" 
            placeholder="Movie Rating (0-10)" 
            type="number"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie 
            name="release_date" 
            control={control}
            errors={errors.release_date?.message && <p className="text-red-400 text-sm italic">{errors.release_date.message}</p>} 
            label="Release Date" 
            placeholder="Input Release Date (YYYY-MM-DD)" 
            type="date"
          />
        </div>
        <div className="flex-1">
          <InputAddMovie 
            name="runtime" 
            control={control}
            errors={errors.runtime?.message && <p className="text-red-400 text-sm italic">{errors.runtime.message}</p>} 
            label="Duration (Minutes)" 
            placeholder="Input Movie Duration" 
            type="number"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label>Director Name</label>
        <Controller
          name="directors"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              styles={customStyles}
              placeholder="Input Director Name (e.g., Christopher Nolan)"
              onChange={(selected) => field.onChange(selected)}
              value={field.value}
            />
          )}
        />
        {errors.directors?.message && <p className="text-red-400 text-sm italic">{errors.directors.message}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <label>Cast</label>
        <Controller
          name="casts"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              styles={customStyles}
              placeholder="Input Cast Names (e.g., Tom Hanks, Emma Watson)"
              onChange={(selected) => field.onChange(selected)}
              value={field.value}
            />
          )}
        />
        {errors.casts?.message && <p className="text-red-400 text-sm italic">{errors.casts.message}</p>}
      </div>

      <InputAddMovie
        name="overview"
        control={control}
        errors={errors.overview?.message && <p className="text-red-400 text-sm italic">{errors.overview.message}</p>}
        type="textarea"
        label="Overview"
        placeholder="Input Movie overview"
      />

      <button className="bg-third cursor-pointer py-4 text-primary font-semibold rounded-xl mt-4" type="submit">
        Submit
      </button>
    </form>
  );
};

const InputAddMovie = ({ name, control, label, type = "text", placeholder, errors, ...props }) => {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={name}>{label}</label>
      {type === "textarea" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="p-3 bg-[#283246] rounded-xl"
              rows={7}
              placeholder={placeholder}
              {...props}
            />
          )}
        />
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="p-3 bg-[#283246] rounded-xl"
              {...props}
            />
          )}
        />
      )}
      {errors}
    </div>
  );
};

export default AddMovie;