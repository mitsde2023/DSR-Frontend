import React from 'react';
import Chart from 'react-apexcharts';

function StackedChart({ data }) {
    const months = Object.keys(data);

    if (months.length === 0) {
      return null;
    }
  
    console.log()

  const firstMonthKey = months[0];
  console.log(firstMonthKey, 14)

  const chartData = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: data[firstMonthKey]
          .filter((item) => item.Group !== 'Grand Total')
          .map((item) => item.Group),
      },
      legend: {
        position: 'top',
      },
    },
    series: months.map((month) => ({
      name: month,
      data: data[month]
        .filter((item) => item.Group !== 'Grand Total')
        .map((item) => item.Admissions),
    })),
  };

//   const groups = data[months[0] && months[1]]
//     .filter((item) => item.Group !== 'Grand Total')
//     .map((item) => item.Group);



  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />

      {/* <Chart options={chartDatas.options} series={chartDatas.series} type="bar" height={350} /> */}

    </div>
  );
}

export default StackedChart;
