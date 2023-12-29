import React from 'react'
import Chart from 'react-apexcharts';

function BarChart({ data }) {
    const months = Object.keys(data);

    if (months.length === 0) {
        // No data available
        return null;
    }


    const groupsMonth1 = data[months[0]]
        .filter((item) => item.Group !== 'Grand Total')
        .map((item) => item.Group);

    const groupsMonth2 = data[months[1]]
        .filter((item) => item.Group !== 'Grand Total')
        .map((item) => item.Group);

    const combinedGroups = [...new Set([...groupsMonth1, ...groupsMonth2])];

    console.log(combinedGroups)
    const chartDatas = {
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
                categories: months,
            },
            legend: {
                position: 'top',
            },
        },
        series: combinedGroups.map((groupName) => ({
            name: groupName,
            data: months.map((month) => {
                const correspondingData = data[month].find((dataItem) => dataItem.Group === groupName);
                return correspondingData ? correspondingData.Admissions : 0;
            }),
        })),
    };
    return (
        <div>
            <Chart options={chartDatas.options} series={chartDatas.series} type="bar" height={350} />
        </div>
    );
}

export default BarChart