import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import * as XLSX from 'xlsx';

function GroupWise() {
    const [month, setMonth] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [grupdata, setGroupdata] = useState([]);
    useEffect(() => {
        async function fetchMonth() {
            const monthsData = await axios.get('http://localhost:9000/dsr_report/api/unique-months');
            setMonth(monthsData.data);
        }
        fetchMonth();
    }, [])

    useEffect(() => {
        const params = {
            selectedMonth
        };

        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        async function fetchTlTmData() {
            const resData = await axios.get(`http://localhost:9000/dsr_report/group-wise-overall?${queryString}`);
            setGroupdata(resData.data);
        }
        fetchTlTmData();
    }, [selectedMonth])
    console.log(month, 23)
    useEffect(() => {
        if (Object.keys(month).length > 0) {
            setSelectedMonth(Object.keys(month)[0]);
        }
    }, [month]);


    const handleMonthChange = (event) => {
        const value = event.target.value;
        setSelectedMonth(value);
    };

    const renderMonthDropdown = () => {
        const options = Object.values(month);

        return (
            <select className='nav-link' value={selectedMonth} onChange={handleMonthChange}>
                {options.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        );
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'MITSDE',
                accessor: 'MITSDE',
                width: 130,
                Cell: (row) => {
                    if (row.index === 1) {
                        return <div style={{ fontWeight: "bold", border: "1px solid red" }}>{row.value}</div>; // Display "MITSDE" in the second row
                    }
                    return null; // Hide "MITSDE" for other rows
                },
            },

            {
                Header: 'Group',
                accessor: 'Group',
                width: 100,
                Cell: (row) => {
                    if (row.value === 'Grand Total') {
                        return null; // Hide the "Grand Total" row
                    }
                    return row.value; // Display other group values
                },
            }


            ,
            {
                Header: 'Team Leaders',
                accessor: 'Group',
                width: 100,
            },
            {
                Header: 'count',
                accessor: 'headCount',
                width: 50,
            },
            {
                Header: 'Target',
                accessor: 'Target',
                width: 50,
            },
            {
                Header: 'Admissions',
                accessor: 'Admissions',
                width: 100,
                Cell: ({ value }) => {
                    return <div>{value}</div>;
                },
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const admissions = rowInfo.original.Admissions;
                        const uniqueAdmissions = [...new Set(state.sortedData.map(row => row._original.Admissions))];
                        uniqueAdmissions.sort((a, b) => b - a);

                        const maxAdmissions = uniqueAdmissions[0];
                        // const thirdMaxAdmissions = uniqueAdmissions[2];
                        const thirdMaxAdmissions = uniqueAdmissions[3];

                        if (admissions === maxAdmissions) {
                            return {};
                        }

                        const percentage = (admissions / thirdMaxAdmissions).toFixed(2);

                        return {
                            style: {
                                background: `linear-gradient(90deg, rgba(0, 128, 0, ${percentage}), transparent)`,
                            },
                        };
                    } else {
                        return {};
                    }
                },
            },
            {
                Header: '% Achieve',
                accessor: '%Achieve',
                width: 100,
                Cell: ({ value }) => {
                    return <div style={{ color: "white" }}>{value}%</div>;
                },
                getProps: (state, rowInfo, column) => {

                    if (rowInfo && rowInfo.original) {
                        const admissions = rowInfo.original.Admissions;
                        const target = rowInfo.original.Target;
                        const percentageAchieve = ((admissions / target) * 100).toFixed(2);
                        let backgroundColor = '';

                        if (percentageAchieve === '50.00') {
                            backgroundColor = '#b8a304';
                        } else if (percentageAchieve < 50) {
                            backgroundColor = 'red';
                        } else if (percentageAchieve > 50 && percentageAchieve < 100) {
                            backgroundColor = '#c76f04';
                        } else if (percentageAchieve >= 100) {
                            backgroundColor = 'green';
                        }

                        if (rowInfo.viewIndex !== state.sortedData.length - 1) {
                            return {
                                style: {
                                    background: backgroundColor,
                                },
                            };
                        }
                    }
                    return {};
                },
            },

            {
                Header: 'T-Lead',
                accessor: 'TotalLead',
                width: 80,
            },
            {
                Header: '% Conversion',
                accessor: '%Conversion',
                width: 100,
            },
            {
                Header: 'Coll-Reve',
                accessor: 'CollectedRevenue',
                width: 80,
            },
            {
                Header: 'Bill-Reve',
                accessor: 'BilledRevenue',
                width: 80
            },
            {
                Header: 'C_PSR',
                accessor: 'C_PSR',
                width: 70,
            },
            {
                Header: 'B_PSR',
                accessor: 'B_PSR',
                width: 70,
            },
            {
                Header: 'C_PCR',
                accessor: 'C_PCR',
                width: 70,
            },
            {
                Header: 'B_PCR',
                accessor: 'B_PCR',
                width: 70,
            },
            {
                Header: 'PCE',
                accessor: 'PCE',
                width: 50,
            }
        ],
        []
    );
    const exportToExcel = () => {
        const header = columns.map((column) => column.Header);
        const dataToExport = grupdata.map((row) => columns.map((column) => row[column.accessor]));

        const ws = XLSX.utils.aoa_to_sheet([header, ...dataToExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'Group_Wise_Summary.xlsx');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <span className="navbar-brand d-flex ms-2" href="#">
                    <img style={{ width: "140px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" />
                    <small>{renderMonthDropdown()}</small>
                </span>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="#home">
                                <Link to={'/overall-Data-Table'}>Overall</Link>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#link">
                                <Link to={'/'}>C-Wise</Link>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#link">
                                <Link to={'/tltm'}>TL-TM</Link>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#link">
                                <Link to={'/Excluding-TL'}>Ex-TL</Link>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#link">
                                <Link to={'/group-wise'}>Group-Wise</Link>
                            </a>
                        </li>
                        <li className='nav-item'>
                            <p className='nav-link' onClick={exportToExcel}>Export</p>
                        </li>
                    </ul>
                </div>
            </nav>
            <hr />

            <span className='heading ps-5 pe-5'>Group Wise Overall Summary</span>
            <ReactTable
                data={grupdata}
                columns={columns}
                defaultPageSize={7}
                pageSizeOptions={[10, 20, 50, 100]}
                getTheadThProps={(state, rowInfo, column) => ({
                    style: {
                        backgroundColor: 'yellow',
                    },
                    className: 'custom-header',
                })}
                className="-striped -highlight custom-table p-2"
                getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.index === grupdata.length - 1) {
                        return {
                            className: 'last-row',
                        };
                    }
                    return {};
                }}

            />
        </>
    )
}

export default GroupWise;