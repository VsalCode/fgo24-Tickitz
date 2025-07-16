import { RiArrowDropDownLine } from "react-icons/ri";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import React from "react";

const DashboardAdminPage = () => {
  const [ticketSalesData, setTicketSalesData] = React.useState([]);
  const [salesChartData, setSalesChartData] = React.useState([]);
  const { register, handleSubmit } = useForm();

  const dataHistoryPayment = useSelector((state) => state.ticket.historyPayment);

  React.useEffect(() => {
    if (dataHistoryPayment && dataHistoryPayment.length > 0) {
      handleSalesChart({ filter: "movieName" });
      handleTicketSales({ option: "location" });
    }
  }, [dataHistoryPayment]);

  function handleSalesChart(value) {
    const { filter } = value;

    if (filter === "movieName") {
      const movieCounter = {};

      dataHistoryPayment.forEach((item) => {
        const movieName = item.title || item.name;

        if (!movieCounter[movieName]) {
          movieCounter[movieName] = 0;
        }

        movieCounter[movieName] += 1;
      });

      const sortedMovies = Object.entries(movieCounter)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
      const chartData = [["Movie", "Ticket Sales"], ...sortedMovies];

      setSalesChartData(chartData);

    } else if (filter === "genre") {
      const genreCounter = {};

      dataHistoryPayment.forEach((item) => {
        const genres = item.genres || [];

        genres.forEach((genre) => {
          const genreName = genre.name;
          if (!genreCounter[genreName]) {
            genreCounter[genreName] = 0;
          }
          genreCounter[genreName] += 1;
        });
      });

      const sortedGenres = Object.entries(genreCounter).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const chartData = [["Genre", "Ticket Sales"], ...sortedGenres];

      setSalesChartData(chartData);
    }
  }

  function handleTicketSales(value) {
    const { option } = value;

    if (option === "location") {
      function findLocation(locationParams) {
        return dataHistoryPayment.filter((e) => e.location === locationParams).length;
      }

      const ticketSales = [
        ["Location", "Ticket Sales"],
        ["Jakarta", findLocation("Jakarta")],
        ["Bandung", findLocation("Bandung")],
        ["Bekasi", findLocation("Bekasi")],
        ["Depok", findLocation("Depok")],
      ];

      setTicketSalesData(ticketSales);
    } else if (option === "cinema") {
      function findCinema(cinemaParams) {
        return dataHistoryPayment.filter((e) => e.cinema === cinemaParams).length;
      }

      const ticketSales = [
        ["Cinema", "Ticket Sales"],
        ["ebv.id", findCinema("ebv.id")],
        ["CineOne21", findCinema("CineOne21")],
        ["hiflix", findCinema("hiflix")],
        ["idlix", findCinema("idlix")],
      ];

      setTicketSalesData(ticketSales);
    }
  }

  return (
    <>
      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[70svw] w-full h-fit p-8">
        <p className="text-3xl font-medium">Sales Chart</p>
        <form onSubmit={handleSubmit(handleSalesChart)} className="flex sm:flex-row flex-col sm:items-center items-start gap-3 text-primary">
          <select {...register("filter")} className="cursor-pointer bg-[#EFF0F6] flex items-center gap-3 py-1 px-5 rounded-lg">
            <option value="movieName" selected>
              Movies Name
            </option>
            <option value="genre">Genre</option>
          </select>
          <button type="submit" className="cursor-pointer bg-third font-semibold gap-3 py-2 px-4 rounded-lg hover:opacity-80 transition-opacity">
            <span>Filter</span>
          </button>
        </form>
        <Chart
          chartType="PieChart"
          data={salesChartData}
          width={"100%"}
          height={"350px"}
        />
      </section>

      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[70svw] w-full h-fit p-8">
        <p className="text-3xl font-medium">Ticket Sales</p>
        <form onSubmit={handleSubmit(handleTicketSales)} className="flex sm:flex-row flex-col sm:items-center items-start gap-3 text-primary">
          <select {...register("option")} className="cursor-pointer bg-[#EFF0F6] flex items-center gap-3 py-1 px-5 rounded-lg">
            <option value="location" selected>
              Location
            </option>
            <option value="cinema">Cinema</option>
          </select>
          <button type="submit" className="cursor-pointer bg-third font-semibold gap-3 py-2 px-4 rounded-lg hover:opacity-80 transition-opacity">
            <span>Filter</span>
          </button>
        </form>
        <Chart
          chartType="PieChart"
          data={ticketSalesData}
          width={"100%"}
          height={"350px"}
        />
      </section>
    </>
  );
};

export default DashboardAdminPage;
