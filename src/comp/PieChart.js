
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ data }) => {
  const chartOptions = {
    labels: data.map(item => item.Month),
  };

  const chartSeries = data.map(item => item.LeadToSaleDurationCount);

  const chartData = {
    series: chartSeries,
    options: chartOptions,
  };

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        height={360}
      />
    </div>
  );
};

export default PieChart;
