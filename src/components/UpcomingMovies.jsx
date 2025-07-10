// import axios from "../utils/axios";
// import requests from "../utils/Requests";
// import { useEffect, useRef, useState } from "react";
// import Button from "./Button";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const UpcomingMovies = () => {
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const UpcomingMovies = await axios.get(requests.fetchUpcomingMovies);
//       const dataMovies = UpcomingMovies.data.results;

//       // console.log(dataMovies);

//       // const data = dataMovies.slice(16);
//       setMovies(dataMovies);
//     }
//     fetchData();
//   }, []);

//   const ref = useRef(null);
//   const scroll = (scrollOffset) => {
//     ref.current.scrollLeft += scrollOffset;
//   };

//   return (
//     <section className="text-white max-h-[1440px] h-fit bg-sixth  py-20">
//       <div className="flex lg:flex-row flex-col-reverse lg:px-15 md:px-10 px-5  ">
//         <div className="scroll-x overflow-x-auto scroll-smooth flex justify-items-center flex-3" ref={ref}>
//           {movies.map((item) => (
//             <div key={item.id} className="flex items-center justify-between flex-col pb-10">
//               <div className="relative w-50">
//                 <img className="rounded-xl" src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt="" />
//               </div>
//               <div className="flex-center flex-col text-center py-4">
//                 <div className="flex-center text-center">
//                   <p className="text-lg text-center font-semibold line-clamp-1">{item.title || item.name}</p>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex-center gap-2">
//                   <div className="flex-center gap-2">
//                     <div className="text-base bg-secondary text-third font-medium px-2 py-1 rounded-full">{item.release_date}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex-1 gap-7 md:mx-10 mx-0 mb-10">
//           <div className="flex flex-col lg:items-start items-center gap-6">
//             <div className="chip">UPCOMING MOVIES</div>
//             <p className="lg:text-5xl text-4xl font-bold lg:text-start text-center">Exciting Movie Coming Soon</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between pt-10 overflow-hidden md:px-15 px-7">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => {scroll(-400)}}
//             className="button-icon"
//           >
//             <FaArrowLeft className="md:text-lg text-sm" />
//           </button>
//           <button
//             onClick={() => {scroll(400)}}
//             className="button-icon"
//           >
//             <FaArrowRight />
//           </button>
//         </div>
//         <div className="lg:flex-between flex justify-center gap-5">
//           <Link to="/movies" className="flex items-center gap-5 bg-third text-primary font-bold rounded-full px-4 py-2">
//             <span>VIEW ALL</span>
//             <FaArrowRight className="md:text-lg text-sm" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UpcomingMovies;
