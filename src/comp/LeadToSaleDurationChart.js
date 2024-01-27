import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const LeadToSaleDurationChart = ({ apiData }) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'line',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM dd', // Use 'MMM dd' for month abbreviation and day
        },
      },
      yaxis: {
        title: {
          text: 'LeadToSaleDuration Count',
        },
      },
    },
    series: [
      {
        name: 'LeadToSaleDuration Count',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const dates = apiData.map(entry => new Date(entry.LeadCreationDate).getTime());
      const counts = apiData.map(entry => entry.LeadToSaleDurationCount);

      setChartData(prevState => ({
        ...prevState,
        series: [
          {
            name: 'Count',
            data: dates.map((date, index) => [date, counts[index]]),
          },
        ],
      }));
    }
  }, [apiData]);

  return <Chart options={chartData.options} series={chartData.series} type="line" height={250} />;
};

export default LeadToSaleDurationChart;