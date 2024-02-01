import React from 'react';
import ReactApexChart from 'react-apexcharts';

const MonthlyCourseChart = ({ data }) => {
    // Extract unique CourseShortName values
    const courseNames = [...new Set(data.map(item => item.CourseShortName))];
    const months = Array.from(new Set(data.map(item => item.Month)));

    // Prepare series data for each course
    const series = courseNames.map(courseName => {
        const seriesData = data
            .filter(item => item.CourseShortName === courseName)
            .map(item => item.CourseCount);

        return {
            name: courseName,
            data: seriesData,
        };
    });

    // Prepare options
    const options = {
        chart: {
            type: 'bar',
            stacked: true,
        },
        xaxis: {
            categories: months,
        },
        legend: {
            position: 'top',
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={490} />
        </div>
    );
};

export default MonthlyCourseChart;
