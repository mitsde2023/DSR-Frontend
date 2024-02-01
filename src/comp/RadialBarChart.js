import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RadialBarChart = ({ data }) => {
    // Extract unique CourseShortName values
    const courseNames = [...new Set(data.map(item => item.CourseShortName))];

    // Prepare series data for each course
    const series = courseNames.map(courseName => {
        const courseData = data
            .filter(item => item.CourseShortName === courseName)
            .map(item => item.CourseCount);

        return courseData.reduce((acc, count) => acc + count, 0);
    });

    // Prepare options
    const options = {
        chart: {
            height: 390,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 330,
                hollow: {
                    margin: 10,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    }
                }
            }
        },
        labels: courseNames,
        legend: {
            show: true,
            floating: true,
            fontSize: '10px',
            position: 'bottom',
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
            },
            itemMargin: {
                vertical: 3
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    show: true
                },
                data: {
                    show: true
                }
            }
        }]
    };

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="radialBar" height={490} />
            </div>
        </div>
    );
};

export default RadialBarChart;
