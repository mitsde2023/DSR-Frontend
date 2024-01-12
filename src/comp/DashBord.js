import React, { useEffect, useState } from 'react'
import BarChart from './BarChart';
import axios from 'axios';
import { useMonths } from '../Contexts/MonthsContext';
import AreaChart from './AreaChart';


function DashBord() {
    const [loading, setLoading] = useState(true);
    const { months } = useMonths()
    const [monthData, setMonthData] = useState({});
    const [firstMonthData, setFirstMonthData] = useState(null);
    const [currMonthGTs, setCurrMonthGTs] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/dsr_report/admissionsCountByDate/Jan24');
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchDataForAllMonths = async () => {
            try {
                const promises = months.map(async (monthObject) => {
                    const params = {
                        selectedMonth: monthObject.month,
                    };

                    const queryString = Object.keys(params)
                        .filter((key) => params[key] !== null && params[key] !== undefined)
                        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                        .join('&');

                    const resData = await axios.get(`http://localhost:8000/dsr_report/group-wise-overall?${queryString}`);
                    return { [monthObject.month]: resData.data };
                });

                const dataForAllMonths = await Promise.all(promises);
                const combinedData = Object.assign({}, ...dataForAllMonths);
                setMonthData(combinedData);

                if (monthData) {
                    const firstMonth = months.length > 0 ? months[0].month : null;
                    const firstMonthData = combinedData[firstMonth];
                    setFirstMonthData(firstMonthData);

                    const lastObjectIndex = firstMonthData.length - 1;
                    const lastObject = firstMonthData[lastObjectIndex];
                    setCurrMonthGTs(lastObject);
                }

                setLoading(false); // Set loading to false when data fetching is complete
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        if (months.length > 0) {
            setLoading(true); // Set loading to true before starting data fetching
            fetchDataForAllMonths();
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dsr_report/admissionsCountByDate/${months[0].month}`);
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [months]);

    if (loading) {
        return <>
            <div class="card" aria-hidden="true">
                <img src="..." class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                    </p>
                    <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                </div>
            </div>
        </>

    }

    console.log(currMonthGTs, 45)
    console.log(firstMonthData, 46)
    console.log(months, 47)
    console.log(monthData, 48)



    const target = currMonthGTs.Target;
    const admissions = currMonthGTs.Admissions;
    const achievementPercentage = (admissions / target) * 100;
    return (
        <>
            <div className="container-fluid mb-5">
                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card border border-2 border-primary rounded-4">
                                    <div className="card-body">
                                        {/* <h6 className="card-title text-primary">CURRENT MONTHLY</h6> */}

                                        <div className='d-flex justify-content-between'>
                                            <div className='px-2 bg-success-subtle border border-1 rounded-2'>
                                                <h6 className="card-title">Target</h6>
                                                <h3 class="card-subtitle m-2">{currMonthGTs.Target}</h3>
                                            </div>
                                            <div className='px-2 bg-success-subtle border border-1 rounded-2'>
                                                <h6 className="card-title">Admissions</h6>
                                                <h3 class="card-subtitle m-2">{currMonthGTs.Admissions}</h3>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <strong>Achievement: {achievementPercentage.toFixed(2)}%</strong>
                                            </div>

                                            <div className='border border-1 border-success rounded-2'>
                                                <div className='border border rounded-2' style={{ width: `${achievementPercentage}%`, height: '20px', backgroundColor: 'green' }}> </div>
                                            </div>


                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="card border border-2 border-primary rounded-4">
                                    <div className="card-body text-center">
                                        <div className='px-2 bg-info-subtle border border-1 rounded-2'>
                                            <h6 className="card-title">Leads</h6>
                                            <h3 class="card-subtitle m-2">{currMonthGTs.TotalLead}</h3>
                                        </div>
                                        <div>
                                            <div>
                                                <strong>Conversion: {((currMonthGTs.Admissions / currMonthGTs.TotalLead) * 100).toFixed(2)}%</strong>
                                            </div>

                                            <div className='border border-1 border-success rounded-2'>
                                                <div className='border border rounded-2' style={{ width: `${(currMonthGTs.Admissions / currMonthGTs.TotalLead) * 100}%`, height: '20px', backgroundColor: 'green' }}> </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="card border border-2 border-primary rounded-4">
                                    <div className="card-body">
                                        <div className='d-flex flex-column justify-content-between'>
                                            <div className='p-2 d-flex bg-warning-subtle border border-1 rounded-2'>
                                                <h5 className="card-subtitle m-2">B_PCR : </h5>
                                                <h5 class="card-subtitle m-2">₹ {currMonthGTs.B_PCR}</h5>
                                            </div>
                                            <div className='p-2 mt-1 d-flex bg-warning-subtle border border-1 rounded-2'>
                                                <h5 className="card-subtitle m-2">B_PSR : </h5>
                                                <h5 class="card-subtitle m-2">₹ {currMonthGTs.B_PSR}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border border-2 border-primary rounded-4">
                                    <div className="card-body">
                                        <strong className="card-title text-primary">CURRENT MONTH</strong>
                                        <div className='p-2 bg-danger-subtle border border-1 rounded-5'>
                                            <h6 className="card-title">PCE</h6>
                                            <h3 class="card-subtitle m-2">{currMonthGTs.PCE}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6 mt-2">
                        <h6 class="card-subtitle">Total Sales Report:</h6> <small>Chart Shows Total Admission & Group wise Admissions per Month</small>

                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total & Group Wise Monthly Admistion Count</h5>
                                <BarChart data={monthData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-2">
                        <h6 class="card-subtitle">Current Month Sales Report:</h6> <small>Chart Shows Date Wise Admmistion Count for Current Month</small>

                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Date vs Admissions</h5>
                                <AreaChart data={chartData} />
                            </div>
                        </div>
                    </div>


                </div>

                {/* Detailed Reports Container */}
                {/* <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Detailed Reports</h5>
                                
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default DashBord;