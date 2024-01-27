import React from "react";
import { useEffect, useState } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { NavLink } from "react-router-dom";
import { useMonths } from '../Contexts/MonthsContext';

function OverAllUsingDataTable() {
    const [data, setData] = useState([]);
    const { months, filterData, crrMonth, fetchFilterData } = useMonths();
    const [selectedMonth, setSelectedMonth] = useState(crrMonth);
    const [showNavbar, setShowNavbar] = useState(false);
    const [selectedSalesManager, setSelectedSalesManager] = useState('');
    const [selectedTeamManager, setSelectedTeamManager] = useState('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    useEffect(() => {
        fetchFilterData(selectedMonth);

    }, [selectedMonth]);

    const handleSalesManagerChange = (event) => {
        const value = event.target.value;
        setSelectedSalesManager(value);
        setSelectedTeamManager("");
        setSelectedTeamLeader("");
    };
    const handleTeamManagerChange = (event) => {
        const value = event.target.value;
        setSelectedTeamManager(value);
        setSelectedTeamLeader("");
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
            <select
                className="nav-link"
                value={selectedSalesManager}
                onChange={handleSalesManagerChange}
            >
                <option value={""}>select manager</option>
                {options}
            </select>
        );
    };

    const renderTeamManagerDropdown = () => {
        if (!selectedSalesManager) return null;
        const filtTeamManagers = filterData[selectedSalesManager];
        const filteredTeamManagers = Object.keys(filtTeamManagers);
        const options = filteredTeamManagers.map((teamManager) => (
            <option key={teamManager} value={teamManager}>
                {teamManager}
            </option>
        ));

        return (
            <select
                className="nav-link"
                value={selectedTeamManager}
                onChange={handleTeamManagerChange}
            >
                <option value={""}>select Team manager</option>
                {options}
            </select>
        );
    };

    const renderTeamLeaderDropdown = () => {
        if (!selectedSalesManager || !selectedTeamManager) return null;
        const filtTeamLeaders =
            filterData[selectedSalesManager][selectedTeamManager];
        const filteredTeamLeaders = Object.keys(filtTeamLeaders);
        const options = filteredTeamLeaders.map((teamLeader) => (
            <option key={teamLeader} value={teamLeader}>
                {teamLeader}
            </option>
        ));

        return (
            <select
                className="nav-link"
                value={selectedTeamLeader}
                onChange={handleTeamLeaderChange}
            >
                <option value={""}>select Team Leader</option>
                {options}
            </select>
        );
    };


    useEffect(() => {
        const params = {
            selectedMonth,
            selectedSalesManager,
            selectedTeamManager,
            selectedTeamLeader,
        };
        const queryString = Object.keys(params)
            .filter((key) => params[key] !== null && params[key] !== undefined)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        if (selectedMonth) {

            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        `http://65.1.54.123:8000/dsr_report/react-table-data?${queryString}`
                    );
                    const allRows = response.data;
                    const lastTwoRows = allRows.slice(0, -2);
                    const lastRow = allRows.slice(-1);

                    setData(lastTwoRows.concat(lastRow));
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }


    }, [
        selectedSalesManager,
        selectedTeamManager,
        selectedTeamLeader,
        selectedMonth
    ]);


    // useEffect(() => {
    //     const params = {
    //         selectedMonth,
    //         selectedSalesManager,
    //         selectedTeamManager,
    //         selectedTeamLeader,
    //     };
    //     const queryString = Object.keys(params)
    //         .filter((key) => params[key] !== null && params[key] !== undefined)
    //         .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    //         .join("&");

    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `http://65.1.54.123:8000/dsr_report/react-table-data?${queryString}`
    //             );
    //             const allRows = response.data;
    //             const lastTwoRows = allRows.slice(0, -2); // Remove the last two rows
    //             const lastRow = allRows.slice(-1); // Get the last row

    //             setData(lastTwoRows.concat(lastRow));
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };
    //     fetchData();
    // }, [
    //     selectedSalesManager,
    //     selectedTeamManager,
    //     selectedTeamLeader,
    //     selectedMonth,
    // ]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Asst. Manager",
                accessor: "AsstManager",
                width: 120,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.AsstManager === data[row.index - 1].AsstManager;

                    const isSameAsNext =
                        row.index < data.length - 1 &&
                        row.original.AsstManager === data[row.index + 1].AsstManager;

                    if (isSameAsPrevious && !isSameAsNext) {
                        const cellClassName =
                            isSameAsPrevious && !isSameAsNext ? "total-cell" : "";
                        const cellValue = row.value ? `Total ${row.value}` : ``;

                        return <div className={cellClassName}>{cellValue}</div>;
                    } else if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            },
            {
                Header: "Team Manager",
                accessor: "TeamManager",
                width: 140,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.TeamManager === data[row.index - 1].TeamManager;

                    const isSameAsNext =
                        row.index < data.length - 1 &&
                        row.original.TeamManager === data[row.index + 1].TeamManager;

                    if (isSameAsPrevious && !isSameAsNext) {
                        const cellClassName =
                            isSameAsPrevious && !isSameAsNext ? "total-cell" : "";
                        const cellValue = row.value ? `Total ${row.value}` : `Total`;

                        return <div className={cellClassName}>{cellValue}</div>;
                    } else if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            },

            {
                Header: "Team Leader",
                accessor: "TeamLeader",
                width: 130,
            },
            {
                Header: "count",
                accessor: "TeamLeaderCounselorCount",
                width: 50,
            },
            {
                Header: "Target",
                accessor: "Target",
                width: 50,
            },
            {
                Header: "Admissions",
                accessor: "Admissions",
                width: 100,
                Cell: ({ value }) => {
                    return <div>{value}</div>;
                },
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const admissions = rowInfo.original.Admissions;
                        const uniqueAdmissions = [
                            ...new Set(
                                state.sortedData.map((row) => row._original.Admissions)
                            ),
                        ];
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
                Header: "% Achieve",
                accessor: "%Achieve",
                width: 70,
                Cell: ({ value }) => {
                    return <div style={{ color: "white" }}>{value}%</div>;
                },
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const percentageAchieve = parseFloat(rowInfo.original["%Achieve"]);
                        let backgroundColor = "";

                        if (percentageAchieve === 50) {
                            backgroundColor = "#f0b624";
                        } else if (percentageAchieve < 50) {
                            backgroundColor = "red";
                        } else if (percentageAchieve > 50 && percentageAchieve < 100) {
                            backgroundColor = "#ed8f24";
                        } else if (percentageAchieve >= 100) {
                            backgroundColor = "green";
                        }

                        // Check if the row is not the last row (Grand Total)
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
                Header: "T-Lead",
                accessor: "T-Lead",
                width: 50,
            },
            {
                Header: "Con%",
                accessor: "Conversion%",
                width: 70,
            },
            {
                Header: "Coll-Reve",
                accessor: "Coll-Revenue",
                width: 80,
            },
            {
                Header: "Bill-Reve",
                accessor: "Bill-Revenue",
                width: 80,
            },
            {
                Header: "C_PSR",
                accessor: "C_PSR",
                width: 70,
            },
            {
                Header: "B_PSR",
                accessor: "B_PSR",
                width: 70,
            },
            {
                Header: "C_PCR",
                accessor: "C_PCR",
                width: 70,
            },
            {
                Header: "B_PCR",
                accessor: "B_PCR",
                width: 70,
            },
            {
                Header: "PCE",
                accessor: "PCE",
                width: 50,
            },
            // {
            //     Header: 'Rank',
            //     accessor: 'Rank',
            //     width: 50,
            //     getProps: (state, rowInfo, column) => {
            //         if (rowInfo && rowInfo.original) {
            //             const rolesPresent = ['AsstManager', 'TeamManager', 'TeamLeader'].filter(
            //                 (role) => rowInfo.original[role]
            //             );

            //             let backgroundColor = 'red'; // Default background color for one field parent

            //             if (rolesPresent.length === 3 && rowInfo.original.Rank < 4) {
            //                 backgroundColor = 'green'; // If 3 fields present and Rank < 4, set to green
            //             } else if (rolesPresent.length === 2) {
            //                 backgroundColor = '#f0ab0a';
            //             } else if (rolesPresent.length === 1) {
            //                 backgroundColor = '#25f21b';
            //             }

            //             if (rowInfo.viewIndex !== state.sortedData.length - 1) {
            //                 return {
            //                     style: {
            //                         background: backgroundColor,
            //                         color: "white"
            //                     },
            //                 };
            //             }
            //             if (rowInfo.viewIndex !== state.sortedData.length - 0) {
            //                 return {
            //                     style: {
            //                         background: "white",
            //                         color: "white"
            //                     },
            //                 };
            //             }
            //         }

            //         return {};
            //     },
            // },
            {
                Header: "Rank",
                accessor: "Rank",
                width: 50,
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const rolesPresent = [
                            "AsstManager",
                            "TeamManager",
                            "TeamLeader",
                        ].filter((role) => rowInfo.original[role]);

                        // Check if any value is empty, null, or ' '
                        const hasEmptyValue = Object.values(rowInfo.original).some(
                            (value) =>
                                value === null ||
                                value === "" ||
                                (typeof value === "string" && value.trim() === "")
                        );

                        let backgroundColor = "red"; // Default background color for one field parent

                        if (!hasEmptyValue) {
                            if (rolesPresent.length === 3 && rowInfo.original.Rank < 4) {
                                backgroundColor = "green"; // If 3 fields present and Rank < 4, set to green
                            } else if (rolesPresent.length === 2) {
                                backgroundColor = "#f0ab0a";
                            } else if (rolesPresent.length === 1) {
                                backgroundColor = "#25f21b";
                            }
                        }

                        return {
                            style: {
                                background: hasEmptyValue ? "white" : backgroundColor,
                                color: "white",
                            },
                        };
                    }

                    return {};
                },
            },
        ],
        [data]
    );

    const exportToExcel = () => {
        const header = columns.map((column) => column.Header);
        const dataToExport = tableData.map((row) =>
            columns.map((column) => row[column.accessor])
        );

        const ws = XLSX.utils.aoa_to_sheet([header, ...dataToExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, `${selectedMonth}_OverallSummary.xlsx`);
    };




    const filteredData = data.filter(
        (row) => row.AsstManager && !row.TeamManager && !row.TeamLeader
    );

    const grandTotal = {
        AsstManager: "Grand Total",
        TeamManager: "",
        TeamLeader: "",
        TeamLeaderCounselorCount: 0,
        Target: 0,
        Admissions: 0,
        "%Achieve": 0,
        "T-Lead": 0,
        "Conversion%": 0,
        "Coll-Revenue": 0,
        "Bill-Revenue": 0,
        C_PSR: 0,
        B_PSR: 0,
        C_PCR: 0,
        B_PCR: 0,
        PCE: 0,
    };

    filteredData.forEach((row) => {
        grandTotal.TeamLeaderCounselorCount += row.TeamLeaderCounselorCount;
        grandTotal.Target += row.Target;
        grandTotal.Admissions += row.Admissions;
        grandTotal["%Achieve"] = parseFloat(row["%Achieve"]);
        grandTotal["T-Lead"] += parseFloat(row["T-Lead"]);
        grandTotal["Conversion%"] = parseFloat(row["Conversion%"]);
        grandTotal["Coll-Revenue"] += parseFloat(row["Coll-Revenue"]);
        grandTotal["Bill-Revenue"] += parseFloat(row["Bill-Revenue"]);
        grandTotal["C_PSR"] = parseFloat(row["C_PSR"]);
        grandTotal["B_PSR"] = parseFloat(row["B_PSR"]);
        grandTotal["C_PCR"] = parseFloat(row["C_PCR"]);
        grandTotal["B_PCR"] = parseFloat(row["B_PCR"]);
        grandTotal["PCE"] = parseFloat(row["PCE"]);
    });

    grandTotal["%Achieve"] = (
        (grandTotal.Admissions / grandTotal.Target) *
        100
    ).toFixed(2);
    grandTotal["Conversion%"] = (
        (grandTotal.Admissions / grandTotal["T-Lead"]) *
        100
    ).toFixed(2);
    grandTotal["C_PSR"] = (
        grandTotal["Coll-Revenue"] / grandTotal.Admissions
    ).toFixed(2);
    grandTotal["B_PSR"] = (
        grandTotal["Bill-Revenue"] / grandTotal.Admissions
    ).toFixed(2);
    grandTotal["C_PCR"] = (
        grandTotal["Coll-Revenue"] / grandTotal.TeamLeaderCounselorCount
    ).toFixed(2);
    grandTotal["B_PCR"] = (
        grandTotal["Bill-Revenue"] / grandTotal.TeamLeaderCounselorCount
    ).toFixed(2);
    grandTotal["PCE"] = (
        grandTotal.Admissions / grandTotal.TeamLeaderCounselorCount
    ).toFixed(2);

    const tableData = data.concat(grandTotal);


    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                    <NavLink to={'/'} ><img style={{ width: "155px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" /></NavLink>
                        {/* <small className='ms-2'>{renderMonthDropdown()}</small> */}
                    </div>
                    <div className="menu-icon" onClick={handleShowNavbar}>
                        <span className="navbar-toggler-icon"></span>
                    </div>
                    <div className={`nav-elements  ${showNavbar && "active"}`}>
                        <ul>
                            <li>
                                <NavLink to={"/Counselor"}>C-Wise</NavLink>
                            </li>
                            <li>
                                <NavLink to={"/overall"}>overall</NavLink>
                            </li>
                            <li>
                                <NavLink to={"/tltm"}>TL-TM</NavLink>
                            </li>
                            <li>
                                <NavLink to={"/Excluding-TL"}>Exc-TL</NavLink>
                            </li>
                            <li>
                                <NavLink to={"/group-wise"}>Group</NavLink>
                            </li>
                            <li>{renderSalesManagerDropdown()}</li>
                            <li>{renderTeamManagerDropdown()}</li>
                            <li>{renderTeamLeaderDropdown()}</li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-around">
                <small className="ms-2">{renderMonthDropdown()}</small>
                <span className="heading ps-5 pe-5" style={{ fontSize: "11px" }}>
                    Overall
                </span>
                <small role="button" onClick={exportToExcel}>
                    Export
                </small>
            </div>
            <ReactTable
                data={tableData}
                columns={columns}
                defaultPageSize={55}
                pageSizeOptions={[10, 20, 45, 50, 75, 100, 200]}
                getTheadThProps={(state, rowInfo, column) => ({
                    style: {
                        backgroundColor: "yellow",
                    },
                    className: "custom-header",
                })}
                style={{
                    height: "820px",
                }}
                className="-striped -highlight custom-table p-2"
                getTrProps={(state, rowInfo) => {
                    if (rowInfo) {
                        const rolesPresent = [
                            "AsstManager",
                            "TeamManager",
                            "TeamLeader",
                        ].filter((role) => rowInfo.original[role]);

                        if (rolesPresent.length === 2) {
                            return {
                                className: "two-fields-row",
                            };
                        }
                        if (rolesPresent.length === 1) {
                            return {
                                className: "one-fields-row",
                            };
                        }
                        if (rolesPresent.length === 0) {
                            return {
                                className: "one-fields-row",
                            };
                        }
                        return {};
                    }

                    if (rowInfo && rowInfo.index === tableData.length - 1) {
                        return {
                            className: "last-row",
                        };
                    }
                    return {};
                }}
            />
        </>
    );
}
export default OverAllUsingDataTable;
