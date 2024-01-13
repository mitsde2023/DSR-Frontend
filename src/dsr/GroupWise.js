import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table-6';
import * as XLSX from 'xlsx';
import { useMonths } from '../Contexts/MonthsContext';

function GroupWise() {
    const { months, crrMonth } = useMonths();

    const [selectedMonth, setSelectedMonth] = useState(crrMonth);
    const [grupdata, setGroupdata] = useState([]);
    const [showNavbar, setShowNavbar] = useState(false)


    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar)
    }
    const handleMonthChange = (event) => {
        const value = event.target.value;
        setSelectedMonth(value);
    };

    const renderMonthDropdown = () => {
        return (
            <select value={selectedMonth} onChange={handleMonthChange}>
                {months.map((entry) => (
                    <option key={entry.id} value={entry.month}>
                        {entry.month}
                    </option>
                ))}
            </select>
        );
    };

    useEffect(() => {
        const params = {
            selectedMonth
        };

        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        async function fetchTlTmData() {
            const resData = await axios.get(`http://localhost:8000/dsr_report/group-wise-overall?${queryString}`);
            setGroupdata(resData.data);
        }
        fetchTlTmData();
    }, [selectedMonth])

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
                        } else {
                            // Apply a different style to the last row
                            return {
                                style: {
                                    background:"black"
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

        XLSX.writeFile(wb, `${selectedMonth}_Group_Wise_Summary.xlsx`);
    };

    return (
        <>

            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                    <NavLink to={'/'} ><img style={{ width: "140px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" /></NavLink>
                    </div>
                    <div className="menu-icon" onClick={handleShowNavbar}>
                        <span className="navbar-toggler-icon"></span>
                    </div>
                    <div className={`nav-elements  ${showNavbar && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to={'/Counselor'}>C-Wise</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/overall'}>overall</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/tltm'}>TL-TM</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/Excluding-TL'}>Exc-TL</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/group-wise'}>Group</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='d-flex justify-content-around'>
                <small className='ms-2'>{renderMonthDropdown()}</small>
                <span className='heading ps-5 pe-5' style={{ fontSize: "11px" }}>Group Wise</span>
                <small role="button" onClick={exportToExcel}>Export</small>

            </div>
            <ReactTable
                data={grupdata}
                columns={columns}
                defaultPageSize={8}
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