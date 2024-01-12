import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table-6';
import * as XLSX from 'xlsx';
import { useMonths } from '../Contexts/MonthsContext';
function TltmExclude() {
    const { months, filterData, crrMonth, fetchFilterData } = useMonths();
    const [tltmdata, settltmdata] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(crrMonth);
    const [selectedSalesManager, setSelectedSalesManager] = useState('');
    const [selectedTeamManager, setSelectedTeamManager] = useState('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [showNavbar, setShowNavbar] = useState(false)

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar)
    }

    useEffect(() => {
        fetchFilterData(selectedMonth);

    }, [selectedMonth]);

    const handleSalesManagerChange = (event) => {
        const value = event.target.value;
        setSelectedSalesManager(value);
        setSelectedTeamManager('');
        setSelectedTeamLeader('');
    };

    const handleTeamManagerChange = (event) => {
        const value = event.target.value;
        setSelectedTeamManager(value);
        setSelectedTeamLeader('');
    };

    const handleTeamLeaderChange = (event) => {
        const value = event.target.value;
        setSelectedTeamLeader(value);
    };

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

    const renderSalesManagerDropdown = () => {
        const salesManagers = Object.keys(filterData);
        const options = salesManagers.map((salesManager) => (
            <option key={salesManager} value={salesManager}>
                {salesManager}
            </option>
        ));

        return (
            <select className='nav-link' value={selectedSalesManager} onChange={handleSalesManagerChange}>
                <option value={''}>select manager</option>
                {options}
            </select>
        );
    };

    const renderTeamManagerDropdown = () => {
        if (!selectedSalesManager) return null;

        const filtTeamManagers = filterData[selectedSalesManager];
        const filteredTeamManagers = Object.keys(filtTeamManagers)
        const options = filteredTeamManagers.map((teamManager) => (
            <option key={teamManager} value={teamManager}>
                {teamManager}
            </option>
        ));

        return (
            <select className='nav-link' value={selectedTeamManager} onChange={handleTeamManagerChange}>
                <option value={''}>select Team manager</option>
                {options}
            </select>
        );
    };

    const renderTeamLeaderDropdown = () => {
        if (!selectedSalesManager || !selectedTeamManager) return null;

        const filtTeamLeaders = filterData[selectedSalesManager][selectedTeamManager];
        const filteredTeamLeaders = Object.keys(filtTeamLeaders)
        const options = filteredTeamLeaders.map((teamLeader) => (
            <option key={teamLeader} value={teamLeader}>
                {teamLeader}
            </option>
        ));

        return (
            <select className='nav-link' value={selectedTeamLeader} onChange={handleTeamLeaderChange}>
                <option value={''}>select Team Leader</option>
                {options}
            </select>
        );
    };

    useEffect(() => {
        const params = {
            selectedSalesManager,
            selectedTeamManager,
            selectedTeamLeader,
            selectedMonth
        };

        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const fetchTlTmData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dsr_report/Excluding-TL?${queryString}`);
                const tlTmData = response.data;
                settltmdata(tlTmData);
            } catch (error) {
                console.error('Error fetching TL-TM data:', error);
            }
        };

        fetchTlTmData();
    }, [selectedSalesManager, selectedTeamManager, selectedTeamLeader, selectedMonth]);


    const columns = React.useMemo(
        () => [
            {
                Header: 'Asst. Manager',
                accessor: 'SalesManager',
                width: 120,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.SalesManager === tltmdata[row.index - 1].SalesManager;
                    const isSameAsNext =
                        row.index < tltmdata.length - 1 &&
                        row.original.SalesManager === tltmdata[row.index + 1].SalesManager;

                    if (isSameAsPrevious && isSameAsNext) {
                        return null;
                    }

                    if (!isSameAsNext) {
                        return <div className='total-cell'>{`Total ${row.value}`}</div>;
                    }

                    return row.value;
                },
            },

            {
                Header: 'Team Manager',
                accessor: 'TeamManager',
                width: 130,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.TeamManager === tltmdata[row.index - 1].TeamManager;

                    if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            }


            ,
            {
                Header: 'Team Leader',
                accessor: 'TeamLeaders',
                width: 130,
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
                width: 90,
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
                        }else {
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
                width: 50,
            },
            {
                Header: '% Conversion',
                accessor: '%Conversion',
                width: 90,
            },
            {
                Header: 'Coll-Reve',
                accessor: 'AmountReceived',
                width: 80,
            },
            {
                Header: 'Bill-Reve',
                accessor: 'AmountBilled',
                width: 80
            },
            {
                Header: 'C_PSR',
                accessor: 'C_PSR',
                width: 65,
            },
            {
                Header: 'B_PSR',
                accessor: 'B_PSR',
                width: 65,
            },
            {
                Header: 'C_PCR',
                accessor: 'C_PCR',
                width: 65,
            },
            {
                Header: 'B_PCR',
                accessor: 'B_PCR',
                width: 65,
            },
            {
                Header: 'PCE',
                accessor: 'PCE',
                width: 40,
            },
            {
                Header: 'Rank',
                accessor: 'Rank',
                width: 50,
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        // const rolesPresent = ['AsstManager', 'TeamManager', 'TeamLeader'].filter(
                        //     (role) => rowInfo.original[role]
                        // );

                        let backgroundColor = 'white'; // Default background color

                        // Check the rank and set background color accordingly
                        if (rowInfo.original.Rank === 1 || rowInfo.original.Rank === 2 || rowInfo.original.Rank === 3) {
                            backgroundColor = 'green'; // Top 3 ranks are green
                        }
                        // else if (rowInfo.original.Rank > 3 && rowInfo.original.Rank <= 5) {
                        //     backgroundColor = '#f0ab0a'; // Ranks 4 and 5 are orange
                        // }
                        else if (rowInfo.original.Rank > 3) {
                            backgroundColor = 'red'; // Ranks greater than 5 are red
                        }

                        if (rowInfo.viewIndex !== state.sortedData.length - 1) {
                            return {
                                style: {
                                    background: backgroundColor,
                                    color: 'white',
                                },
                            };
                        }
                    }

                    return {};
                },
            },

        ],
        [tltmdata]
    );
    const exportToExcel = () => {
        const header = columns.map((column) => column.Header);
        const dataToExport = tltmdata.map((row) => columns.map((column) => row[column.accessor]));

        const ws = XLSX.utils.aoa_to_sheet([header, ...dataToExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, `${selectedMonth}_Exclude_TLTM.xlsx`);
    };

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <img style={{ width: "140px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" />
                        {/* <small className='ms-2'>{renderMonthDropdown()}</small> */}
                    </div>
                    <div className="menu-icon" onClick={handleShowNavbar}>
                        <span className="navbar-toggler-icon"></span>
                    </div>
                    <div className={`nav-elements  ${showNavbar && 'active'}`}>
                        <ul>
                            <li>
                                <NavLink to={'/'}>C-Wise</NavLink>
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
                            <li>
                                {renderSalesManagerDropdown()}
                            </li>
                            <li>
                                {renderTeamManagerDropdown()}
                            </li>
                            <li>
                                {renderTeamLeaderDropdown()}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='d-flex justify-content-around'>
                <small className='ms-2'>{renderMonthDropdown()}</small>
                <span className='heading ps-2 pe-2' style={{fontSize:"11px"}}>TL-Excluding TL Admission Count</span>
                <small role="button" onClick={exportToExcel}>Export</small>
            </div>
            <ReactTable
                data={tltmdata}
                columns={columns}
                defaultPageSize={25}
                pageSizeOptions={[10, 20, 25, 50, 75, 100]}
                getTheadThProps={(state, rowInfo, column) => ({
                    style: {
                        backgroundColor: 'yellow',
                    },
                    className: 'custom-header',
                })}
                style={{
                    height: "820px",
                }}
                className="-striped -highlight custom-table p-2"
                getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.index === tltmdata.length - 1) {
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

export default TltmExclude;