import * as yup from "yup";

export const ValidationMovies = yup.object({
  title: yup.string().required("Title Movie is required"),
  poster_path: yup
    .string()
    .required("Poster URL is required")
    .url("Poster must be a valid URL")
    .matches(/\.(jpg|jpeg|png|webp)$/i, "Poster URL must be an image (jpg, jpeg, png, or webp)"),
  
  backdrop_path: yup
    .string()
    .required("Backdrop URL is required")
    .url("Backdrop must be a valid URL")
    .matches(/\.(jpg|jpeg|png|webp)$/i, "Backdrop URL must be an image (jpg, jpeg, png, or webp)"),
  
  genres: yup
    .array()
    .min(1, "Genre is required")
    .of(yup.object().shape({
      value: yup.mixed(),
      label: yup.string(),
      __isNew__: yup.boolean()
    })),
  
  vote_average: yup
    .number()
    .required("Rating is required")
    .min(0, "Rating cannot be less than 0")
    .max(10, "Rating cannot be more than 10")
    .typeError("Rating must be a number"),
  
  release_date: yup
    .string()
    .required("Release date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Release date must be in YYYY-MM-DD format"),
  
  runtime: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute")
    .max(600, "Duration cannot exceed 600 minutes")
    .typeError("Duration must be a number"),
  
  directors: yup
    .array()
    .min(1, "Director name is required")
    .of(yup.object().shape({
      value: yup.mixed(),
      label: yup.string(),
      __isNew__: yup.boolean()
    })),
  
  casts: yup
    .array()
    .min(1, "Cast is required")
    .of(yup.object().shape({
      value: yup.mixed(),
      label: yup.string(),
      __isNew__: yup.boolean()
    })),
  
  overview: yup
    .string()
    .required("overview is required")
    .min(10, "overview must be at least 10 characters")
    .max(1000, "overview cannot exceed 1000 characters"),
});