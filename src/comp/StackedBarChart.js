import React from 'react';
import Chart from 'react-apexcharts';

function StackedBarChart({ data, month }) {
  const chartData = {
    options: {
      chart: {
        type: 'bar',
        stacked: true,
      },
      xaxis: {
        categories: data.slice(0, data.length - 1).map((item) => item.Group),
      },
    },
    series: [
      {
        name: 'Admissions',
        data: data.slice(0, data.length - 1).map((item) => item.Admissions),
      },
    ],
  };

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <Chart options={chartData.options} series={chartData.series} type="bar" width="500" />
          </div>
        </div>
      </div>

    </>
  );
}

export default StackedBarChart;
