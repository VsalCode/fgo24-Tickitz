// import { useEffect, useRef, useState } from "react";
// import axios from "../utils/axios";
// import requests from "../utils/Requests";
// import "swiper/css";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const NowShowingMovies = () => {
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const requestMovies = await axios.get(requests.fetchNowPlaying);
//       const dataMovies = requestMovies.data.results;
//       const requestGenres = await axios.get(requests.fetchMovieGenres);
//       const movieGenres = requestGenres.data.genres;

//       // console.log(dataMovies);
//       // console.log(genres);

//       const updatedMovies = dataMovies.map((movie) => {
//         const genreNames = movie.genre_ids.map((id) => movieGenres.find((e) => e.id === id)).filter(Boolean);

//         return {
//           ...movie,
//           genre_ids: genreNames,
//         };
//       });

//       // console.log(updatedMovies);
//       // const data = updatedMovies.slice(16);
//       setMovies(updatedMovies);
//     }
//     fetchData();
//   }, []);

//   const ref = useRef(null);
//   const scroll = (scrollOffset) => {
//     ref.current.scrollLeft += scrollOffset;
//   };

//   return (
//     <div className="w-full my-20">
//       <div className="flex  justify-between items-center overflow-hidden">
//         <button
//           onClick={() => { scroll(-470) }}
//           className="button-icon md:text-lg text-sm"
//         >
//           <FaArrowLeft />
//         </button>
//         <p className="md:font-semibold font-bold md:text-4xl sm:text-2xl text-xl">Now Showing in Cinemas</p>
//         <button
//           onClick={() => {scroll(470) }}
//           className="button-icon md:text-lg text-sm bg-third"
//         >
//           <FaArrowRight />
//         </button>
//       </div>
//       <div className="scroll-x overflow-x-auto scroll-smooth flex gap-5 justify-items-center py-10 " ref={ref}>
//         {movies.map((item) => (
//           <Link to={`/movieDetail/${item.id}`} key={item.id} className="flex flex-col justify-between w-500 hover:scale-102 transition-transform duration-300">
//             <div className="relative lg:w-70 w-50">
//               {item.vote_average > 7 && <div className="absolute text-primary bg-third font-bold px-2 py-1 rounded-b-lg ">Recommended</div>}
//               <img className="rounded-xl object-cover lg:h-105 h-80 w-full" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="" />
//             </div>
//             <div className="flex flex-col pt-5 gap-2 w-full">
//               <div className="flex justify-center items-center text-center">
//                 <h6 className="font-semibold line-clamp-1">{item.title || item.name}</h6>
//               </div>
//               <div className="flex justify-center items-center gap-2 ">
//                 <div className="flex-wrap flex-center gap-2 pt-4">
//                   {item.genre_ids.length > 2
//                     ? item.genre_ids.slice(0, 2).map((genre) => (
//                         <div key={genre?.id} className="text-sm bg-secondary text-third font-medium px-2 py-1 rounded-full">
//                           {genre.name}
//                         </div>
//                       ))
//                     : item.genre_ids.map((genre) => (
//                         <div key={genre?.id} className="text-sm bg-secondary text-third font-medium px-2 py-1 rounded-full">
//                           {genre.name}
//                         </div>
//                       ))}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//       <div className="flex-center mt-7">
//         <Link to="/movies" className="flex items-center bg-third text-primary font-bold gap-3 rounded-full px-4 py-2">
//           <span>VIEW ALL</span>
//           <FaArrowRight />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default NowShowingMovies;
