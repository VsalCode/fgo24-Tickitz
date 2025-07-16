import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import http from "../../utils/axios";

const DashboardAdminPage = () => {
  const [ticketSalesData, setTicketSalesData] = React.useState([['Location', 'Sales']]);
  const [salesChartData, setSalesChartData] = React.useState([['Movie', 'Tickets Sold']]);
  const { register, handleSubmit } = useForm();
  const token = useSelector((state) => state.auth.token);

  const formatChartData = (data, labelKey = 'name') => {
    const chartData = [[data[0]?.label || 'Category', 'Value']];
    return data.reduce((acc, item) => {
      acc.push([item[labelKey], item.total]);
      return acc;
    }, chartData);
  };

  const fetchSalesChartData = async (filter) => {
    try {
      const response = await http(token).get("/admin/ticket-sales", {
        params: { filter }
      });
      setSalesChartData(formatChartData(response.data, 'name'));
    } catch (error) {
      console.error("Error fetching sales chart data:", error);
      setSalesChartData([['Error', 'Value'], ['No data', 1]]);
    }
  };

  const fetchTicketSalesData = async (filter) => {
    try {
      const response = await http(token).get("/admin/ticket-sales", {
        params: { filter }
      });
      setTicketSalesData(formatChartData(response.data, 'name'));
    } catch (error) {
      console.error("Error fetching ticket sales data:", error);
      setTicketSalesData([['Error', 'Value'], ['No data', 1]]);
    }
  };

  const handleSalesChart = (data) => {
    const apiFilter = data.filter === "movieName" ? "movie" : "genre";
    fetchSalesChartData(apiFilter);
  };

  const handleTicketSales = (data) => {
    fetchTicketSalesData(data.option);
  };

  useEffect(() => {
    if (token) {
      fetchSalesChartData("movie");
      fetchTicketSalesData("location");
    }
  }, [token]);

  const hasSalesData = salesChartData.length > 1;
  const hasTicketData = ticketSalesData.length > 1;

  return (
    <div className="flex flex-col gap-8">
      {/* Sales Chart Section */}
      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[70svw] w-full h-fit p-8">
        <p className="text-3xl font-medium">Sales Chart</p>
        <form onSubmit={handleSubmit(handleSalesChart)} className="flex sm:flex-row flex-col sm:items-center items-start gap-3 text-primary">
          <select {...register("filter")} className="cursor-pointer bg-[#EFF0F6] flex items-center gap-3 py-1 px-5 rounded-lg">
            <option value="movieName">Movies Name</option>
            <option value="genre">Genre</option>
          </select>
          <button type="submit" className="cursor-pointer bg-third font-semibold gap-3 py-2 px-4 rounded-lg hover:opacity-80 transition-opacity">
            Filter
          </button>
        </form>
        
        {hasSalesData ? (
          <Chart
            chartType="PieChart"
            data={salesChartData}
            options={{
              pieHole: 0.4,
              is3D: false,
              legend: { 
                position: "labeled", 
                textStyle: { color: "white", fontSize: 14 } 
              },
              pieSliceText: "value",
              tooltip: { text: "percentage" },
              backgroundColor: "transparent",
              chartArea: { width: "90%", height: "80%" },
              colors: ["#F0C3F1", "#F999B7", "#C490E4", "#8B93FF", "#5F8DCA", "#6C9BCF"],
            }}
            width={"100%"}
            height={"350px"}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-white">
            <p>No sales data available</p>
          </div>
        )}
      </section>

      {/* Ticket Sales Section */}
      <section className="bg-secondary text-white flex flex-col gap-6 rounded-4xl md:max-w-[70svw] w-full h-fit p-8">
        <p className="text-3xl font-medium">Ticket Sales</p>
        <form onSubmit={handleSubmit(handleTicketSales)} className="flex sm:flex-row flex-col sm:items-center items-start gap-3 text-primary">
          <select {...register("option")} className="cursor-pointer bg-[#EFF0F6] flex items-center gap-3 py-1 px-5 rounded-lg">
            <option value="location">Location</option>
            <option value="cinema">Cinema</option>
          </select>
          <button type="submit" className="cursor-pointer bg-third font-semibold gap-3 py-2 px-4 rounded-lg hover:opacity-80 transition-opacity">
            Filter
          </button>
        </form>
        
        {hasTicketData ? (
          <Chart
            chartType="PieChart"
            data={ticketSalesData}
            options={{
              pieHole: 0.4,
              is3D: false,
              legend: { 
                position: "labeled", 
                textStyle: { color: "white", fontSize: 14 } 
              },
              pieSliceText: "value",
              tooltip: { text: "percentage" },
              backgroundColor: "transparent",
              chartArea: { width: "90%", height: "80%" },
              colors: ["#F0C3F1", "#F999B7", "#C490E4", "#8B93FF", "#5F8DCA", "#6C9BCF"],
            }}
            width={"100%"}
            height={"350px"}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-white">
            <p>No ticket sales data available</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardAdminPage;