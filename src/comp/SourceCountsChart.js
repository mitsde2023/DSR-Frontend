import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SourceCountsChart = ({ data }) => {
  const months = Array.from(new Set(data.map(item => item.Month)));
  const series = Array.from(new Set(data.map(item => item.AgencySource)))
    .map(agencySource => ({
      name: agencySource,
      data: months.map(month => {
        const entry = data.find(item => item.Month === month && item.AgencySource === agencySource);
        return entry ? entry.sourceCount : 0;
      }),
    }));

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: 'Source Count',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default SourceCountsChart;
