import React from "react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ValidationMovies } from "../../components/ValidationMovies";
import CreatableSelect from "react-select/creatable";
import http from "../../utils/axios";

const AddMoviePage = () => {
  const [genreOptions, setGenreOptions] = React.useState([]);
  const [directorOptions, setDirectorOptions] = React.useState([]);
  const [castOptions, setCastOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState({
    genres: true,
    directors: true,
    casts: true,
  });

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const [genresRes, directorsRes, castsRes] = await Promise.all([
          http().get("/movies/genres"), 
          http().get("/movies/directors"), 
          http().get("/movies/casts")
        ]);

        const getData = (response) => {
          return response.data?.data || response.data?.results || response.data || response;
        };

        setGenreOptions(getData(genresRes)?.map((g) => ({ value: g.id, label: g.name })) || []);
        setDirectorOptions(getData(directorsRes)?.map((d) => ({ value: d.id, label: d.name })) || []);
        setCastOptions(getData(castsRes)?.map((c) => ({ value: c.id, label: c.name })) || []);

        setIsLoading({ genres: false, directors: false, casts: false });
      } catch (error) {
        console.error("Full fetch error:", error);
        toast.error(`Failed to load initial data: ${error.message}`);
      }
    };

    fetchInitialOptions();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ValidationMovies),
    defaultValues: {
      genres: [],
      directors: [],
      casts: [],
      poster_path: "",
      backdrop_path: "",
      title: "",
      vote_average: 0,
      release_date: "",
      runtime: 0,
      overview: "",
    },
  });

  async function addMovieEndpoint(movie) {
    try {
      const { data } = await http(token).post("/admin", movie);
      return data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add movie");
    }
  }

  const transformOptions = (options) => {
    if (!Array.isArray(options)) return [];
    
    return options.map((opt) => {
      if (opt.__isNew__) {
        return { name: opt.value };
      } else {
        return { id: opt.value };
      }
    });
  };

  const handleAddMovie = async (data) => {
    console.log("🚀 FUNCTION CALLED - handleAddMovie started");
    console.log("📋 Form data received:", data);
    
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      console.log("❌ Form has validation errors, stopping submission");
      toast.error("Please fix validation errors before submitting");
      return;
    }

    const movie = {
      title: data.title,
      overview: data.overview,
      vote_average: parseFloat(data.vote_average) || 0,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date,
      runtime: parseInt(data.runtime) || 0,
      genres: transformOptions(data.genres),
      directors: transformOptions(data.directors),
      casts: transformOptions(data.casts),
    };

    console.log("📽️ Movie object created:", movie);

    try {
      const response = await addMovieEndpoint(movie);
      console.log("✅ Movie added successfully:", response);
      toast.success(response);

      setTimeout(() => {
        navigate("/movies-admin");
      }, 2000);
    } catch (error) {
      console.error("❌ Error adding movie:", error);
      toast.error(error.message);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#283246",
      border: "none",
      borderRadius: "12px",
      minHeight: "48px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#3a4a6b",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a0aec0",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#283246",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#3a4a6b" : "#283246",
      color: "white",
    }),
  };

  return (
    <form onSubmit={(e) => {
      console.log("🎯 Form onSubmit triggered");
      e.preventDefault();
      console.log("🔒 Default prevented");
      handleSubmit(handleAddMovie)(e);
    }} className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[65svw] w-full h-fit sm:p-8 py-6 px-4">
      <Toaster />
      <p className="sm:text-4xl text-3xl font-medium text-third">Add New Movie</p>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <ul className="text-red-300 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {field}: {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex-1">
          <InputAddMovie 
            name="poster_path" 
            control={control} 
            errors={errors.poster_path?.message && <p className="text-red-400 text-sm italic">{errors.poster_path.message}</p>} 
            label="Poster URL" 
            placeholder="Input Poster URL" 
          />
        </div>
        <div className="flex-1">
          <InputAddMovie 
            name="backdrop_path" 
            control={control} 
            errors={errors.backdrop_path?.message && <p className="text-red-400 text-sm italic">{errors.backdrop_path.message}</p>} 
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
                  isDisabled={isLoading.genres}
                  isLoading={isLoading.genres}
                  options={genreOptions}
                  styles={customStyles}
                  placeholder={isLoading.genres ? "Loading genres..." : "Input Movie Category / Genres (e.g., Action, Comedy)"}
                  onChange={(selected) => {
                    console.log("Genres selected:", selected);
                    field.onChange(selected || []);
                  }}
                  value={field.value || []}
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
            min="0"
            max="10"
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
            min="0"
          />
        </div>
      </div>

      {/* Directors Select */}
      <div className="flex flex-col gap-4">
        <label>Director Name</label>
        <Controller
          name="directors"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              isDisabled={isLoading.directors}
              isLoading={isLoading.directors}
              options={directorOptions}
              styles={customStyles}
              placeholder={isLoading.directors ? "Loading directors..." : "Input Director Name (e.g., Christopher Nolan)"}
              onChange={(selected) => {
                console.log("Directors selected:", selected);
                field.onChange(selected || []);
              }}
              value={field.value || []}
            />
          )}
        />
        {errors.directors?.message && <p className="text-red-400 text-sm italic">{errors.directors.message}</p>}
      </div>

      {/* Casts Select */}
      <div className="flex flex-col gap-4">
        <label>Cast</label>
        <Controller
          name="casts"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              isDisabled={isLoading.casts}
              isLoading={isLoading.casts}
              options={castOptions}
              styles={customStyles}
              placeholder={isLoading.casts ? "Loading casts..." : "Input Cast Names (e.g., Tom Hanks, Emma Watson)"}
              onChange={(selected) => {
                console.log("Casts selected:", selected);
                field.onChange(selected || []);
              }}
              value={field.value || []}
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

      <button 
        className="bg-third cursor-pointer py-4 text-primary font-semibold rounded-xl mt-4 disabled:opacity-50" 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
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
              value={field.value || ""} 
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
              value={field.value ?? ""}
              onChange={(e) => {
                if (type === "number") {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : parseFloat(value));
                } else {
                  field.onChange(e.target.value);
                }
              }}
              {...props}
            />
          )}
        />
      )}
      {errors}
    </div>
  );
};

export default AddMoviePage;