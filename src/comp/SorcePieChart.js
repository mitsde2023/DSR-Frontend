import React from 'react'
import ReactApexChart from 'react-apexcharts';

function SorcePieChart({ data }) {
    const options = {
        labels: data.map(item => item.AgencySource),
    };

    const series = data.map(item => item.sourceCount);

    return (
        <ReactApexChart options={options} series={series} type="pie" height={155} />
    );
}

export default SorcePieChart