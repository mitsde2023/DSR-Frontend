import ReactApexChart from "react-apexcharts";

const AreaChart = ({ data }) => {
    const chartData = {
      options: {
        chart: {
          id: 'area-chart',
        },
        xaxis: {
          type: 'datetime',
          categories: data.map(item => item.date),
        },
      },
      series: [
        {
          name: 'Admissions Count',
          data: data.map(item => item.admissionsCount),
        },
      ],
    };
  
    return (
      <div>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </div>
    );
  };
  
  export default AreaChart;
  