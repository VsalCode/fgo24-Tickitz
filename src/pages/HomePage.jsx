import Navbar from "../components/Navbar";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdStars } from "react-icons/md";
import BenefitCard from "../components/BenefitCard";
import NowShowingMovies from "../components/NowShowingMovies";
import UpcomingMovies from "../components/UpcomingMovies";
import Subscribe from "../components/Subscribe";

const HomePage = () => {
  return (
    <>
      <section className="text-white flex flex-col items-center text-center pt-30 lg:px-15 sm:px-10 px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="chip ">
            <p className="md:text-base text-sm">MOVIE TICKET PURCHASES #1 IN INDONESIA</p>
          </div>
          <div className="lg:text-6xl md:text-5xl text-4xl">
            <p className=" font-semibold">Experience the Magic of Cinema: </p>
            <p className="text-third font-extrabold">Book Your Tickets Today</p>
          </div>
          <div>
            <p className="text-fourth text-lg">Sign up and get the ticket with a lot of discount</p>
          </div>
        </div>
        <NowShowingMovies />
      </section>
      <section id="benefit-page" className="bg-secondary text-white w-full text-sixth flex lg:flex-row flex-col lg:px-15 px-10 h-fit py-20 rounded-6xl justify-center items-center ">
        <div className=" flex lg:items-start items-center flex-col gap-5 p-2 lg:pb-0 pb-10">
          <div className="flex chip">
            <p className="md:text-base text-sm">WHY CHOOSE US</p>
          </div>
          <p className="font-medium lg:text-6xl md:text-5xl text-3xl lg:text-start text-center">Unleashing the Ultimate Movie Experience</p>
        </div>
        <div className="flex lg:flex-row md:gap-5 flex-col gap-10 items-center text-primary">
          <BenefitCard text="Guaranted" icon={<MdStars />} />
          <BenefitCard text="Affordable" icon={<FaMoneyBillWave />} />
          <BenefitCard text="24/7 Customer Support" icon={<RiCustomerService2Fill />} />
        </div>
      </section>
        <UpcomingMovies /> 
      <Subscribe />
    </>
  );
};

export default HomePage;
