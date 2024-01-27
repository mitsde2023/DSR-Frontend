import React from 'react';
import ReactApexChart from 'react-apexcharts';

function StackedBarChart({ data }) {

  const chartOptions = {
    xaxis: {
      categories: data.map(item => item.Month),
    },
  };

  const chartSeries = [
    {
      name: 'LeadToSaleDurationCount',
      data: data.map(item => item.LeadToSaleDurationCount),
    },
  ];

  const chartData = {
    series: chartSeries,
    options: chartOptions,
  };

  return (
    <>
      <div>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height="250"
        />
      </div>
    </>
  );
}

export default StackedBarChart;
