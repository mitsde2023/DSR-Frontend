import React, { useEffect, useState } from 'react'
import BarChart from './BarChart';
import axios from 'axios';
import StackedBarChart from './StackedBarChart';
import StackedChart from './StackedChart';

function DashBord() {
    // const [data, setData] = useState([]);
    // const [month, setMonth] = useState([]);
    const [months, setMonths] = useState([]);
    const [monthData, setMonthData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showMonthWiseGrup, setShowsMonthWiseGrup] = useState(false)

    useEffect(() => {
        async function fetchMonthsData() {
            const monthsData = await axios.get('http://localhost:8000/dsr_report/api/unique-months');
            setMonths(monthsData.data);
        }
        fetchMonthsData();
    }, []);

    useEffect(() => {
        const fetchDataForAllMonths = async () => {
            const promises = Object.keys(months).map(async (month) => {
                const params = {
                    selectedMonth: month,
                };

                const queryString = Object.keys(params)
                    .filter((key) => params[key] !== null && params[key] !== undefined)
                    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                    .join('&');

                const resData = await axios.get(`http://localhost:8000/dsr_report/group-wise-overall?${queryString}`);
                return { [month]: resData.data };
            });

            const dataForAllMonths = await Promise.all(promises);
            const combinedData = Object.assign({}, ...dataForAllMonths);
            setMonthData(combinedData);
        };

        // Fetch data for all months when months data is available
        if (Object.keys(months).length > 0) {
            fetchDataForAllMonths();
        }
    }, [months]);

    console.log(months)
    console.log(monthData, 48)


    const cleanGroupNames = async (data) => {
        const cleanedData = data.map((item) => {
            return {
                ...item,
                Group: item.Group.trim(), // Remove leading and trailing spaces
            };
        });

        // Combine data with the same Group name
        const groupedData = Object.values(
            cleanedData.reduce((acc, item) => {
                const groupName = item.Group;

                if (!acc[groupName]) {
                    acc[groupName] = {
                        ...item,
                    };
                } else {
                    acc[groupName].Target += item.Target;
                    acc[groupName].TotalLead += item.TotalLead;
                    acc[groupName].Admissions += item.Admissions;
                    acc[groupName].CollectedRevenue += item.CollectedRevenue;
                    acc[groupName].BilledRevenue += item.BilledRevenue;
                    acc[groupName].headCount += item.headCount;
                    acc[groupName]['%Achieve'] = (
                        (acc[groupName].Admissions / acc[groupName].Target) *
                        100
                    ).toFixed(2);
                    // Add other fields to aggregate

                    // Optionally, you can calculate additional percentages or perform other aggregations.
                    // Example: acc[groupName].SomeOtherField += item.SomeOtherField;
                }

                return acc;
            }, {})
        );

        return groupedData;
    };

    // useEffect(() => {

    //     const fetchGraphData = async () => {
    //         const resData = await axios.get(`http://localhost:8000/dsr_report/group-wise-overall?selectedMonth`);
    //         const cleanedData = await cleanGroupNames(resData.data);
    //         setData(cleanedData)
    //     }
    //     fetchGraphData();
    // }, [])


    const MonthWiseGrupAdmistion = () => {
        if (showMonthWiseGrup === true) {
            setShowsMonthWiseGrup(false)
        } else {
            setShowsMonthWiseGrup(true)
        }
    }

    return (
        <>
            <BarChart data={monthData} />

            <div>
                {selectedMonth && monthData[selectedMonth] && <BarChart data={monthData[selectedMonth]} />}


                <div>
                    <h1>Group-wise Admissions in month</h1>
                    <StackedChart data={monthData} />
                </div>

                <button onClick={MonthWiseGrupAdmistion}>show month wise</button>
                {showMonthWiseGrup ? <>
                    <div>
                        <h1>Group-wise Admissions Stacked Bar Chart</h1>
                        {Object.keys(monthData).map((month) => (
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-6'>
                                    <StackedBarChart key={month} data={monthData[month]} month={month} />
                                    </div>

                                </div>
                              
                            </div>
                        ))}
                    </div>
                </> : <>
                </>}
            </div>

        </>
    )
}

export default DashBord;