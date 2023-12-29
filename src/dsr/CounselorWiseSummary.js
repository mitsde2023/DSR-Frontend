import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-6';
import axios from 'axios';
import 'react-table-6/react-table.css';
import * as XLSX from 'xlsx';
import { NavLink } from 'react-router-dom';
function CounselorWiseSummary() {
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [month, setMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSalesManager, setSelectedSalesManager] = useState('');
  const [selectedTeamManager, setSelectedTeamManager] = useState('');
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }
  useEffect(() => {
    async function fetchHierarchyData() {
      try {
        const hierarchyData = await axios.get(`http://localhost:8000/dsr_report/hierarchical-data-filter?selectedMonth=${selectedMonth}`);
        setMonth(hierarchyData.data.uniqueMonths);
        setFilterData(hierarchyData.data.hierarchicalData);
      } catch (error) {
        console.error('Error fetching hierarchical data:', error);
      }
    }

    fetchHierarchyData();
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
      <select
        className="nav-link"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <option value={""}>All</option>
        {month.map((entry) => (
          <option key={entry.id} value={entry.month}>
            {entry.month}
          </option>
        ))}
      </select>
    );
  };

  const renderSalesManagerDropdown = () => {
    const salesManagers = Object.keys(filterdata);
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

    const filtTeamManagers = filterdata[selectedSalesManager];
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

    const filtTeamLeaders = filterdata[selectedSalesManager][selectedTeamManager];
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

  // console.log(selectedSalesManager, selectedTeamManager, selectedTeamLeader, 112)

  useEffect(() => {
    const fetchData = async () => {
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

      try {
        const response = await axios.get(`http://localhost:8000/dsr_report/counselor-metrics?${queryString}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedSalesManager, selectedTeamManager, selectedTeamLeader]);


  const calculateAchievement = (row) => {
    const admissions = row.Admissions;
    const target = row.Target;
    const percentage = ((admissions / target) * 100).toFixed(2);

    return percentage;
  };

  // Define a function to calculate the Conversion%
  const calculateConversion = (row) => {
    const admissions = row.Admissions;
    const totalLead = row.TotalLead;
    if (totalLead === 0) {
      return 'N/A';
    } else {
      const percentage = ((admissions / totalLead) * 100).toFixed(2);
      return `${percentage}%`;
    }
  };



  const columns = [
    {
      Header: 'Counselor',
      accessor: 'Counselor',
      width: 110,
      disableFilters: true,
      sticky: 'left',

    },
    {
      Header: 'Team Leaders',
      accessor: 'TeamLeaders',
      width: 110,
    },
    {
      Header: 'Team Manager',
      accessor: 'TeamManager',
      width: 110,
    },
    {
      Header: 'S M',
      accessor: 'SalesManager',
      Cell: ({ value }) => value === 'Jayjeet Deshmukh' ? 'JD' : value,
      width: 50,
    },
    {
      Header: 'Team',
      accessor: 'Team',
      width: 50,
    },
    {
      Header: 'Status',
      accessor: 'Status',
      width: 60,
    },
    {
      Header: 'Target',
      accessor: 'Target',
      width: 50,
    },
    {
      Header: 'Admissions',
      accessor: 'Admissions',
      width: 50,
    },
    {
      Header: 'Coll Rev',
      accessor: 'CollectedRevenue',
      width: 80,
      Cell: ({ value }) => {
        return <div>{value}</div>;
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const collectedRevenue = rowInfo.original.CollectedRevenue;
          const maxCollectedRevenue = Math.max(...state.sortedData.map(row => row._original.CollectedRevenue));
          const percentage = (collectedRevenue / maxCollectedRevenue).toFixed(2);

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
      Header: 'Bill Rev',
      accessor: 'BilledRevenue',
      width: 80,
      Cell: ({ value }) => {
        return <div>{value}</div>;
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const billedRevenue = rowInfo.original.BilledRevenue;
          const maxBilledRevenue = Math.max(...state.sortedData.map(row => row._original.BilledRevenue));
          const percentage = (billedRevenue / maxBilledRevenue).toFixed(2);

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
      Header: 'T-Lead',
      accessor: 'TotalLead',
      width: 50,
    },
    {
      Header: '% Achieve',
      accessor: 'Admissions',
      width: 80,
      Cell: ({ original }) => {
        const achievement = calculateAchievement(original);
        const cellColor = achievement >= 100 ? 'green' : 'red';

        return (
          <div style={{ backgroundColor: cellColor, color: 'white' }}>
            {achievement}%
          </div>
        );
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const achievement = calculateAchievement(rowInfo.original);
          const cellColor = achievement >= 100 ? 'green' : 'red';

          return {
            style: {
              backgroundColor: cellColor,
            },
          };
        } else {
          return {};
        }
      },
    },


    {
      Header: 'Con%',
      accessor: 'Admissions',
      width: 70,
      Cell: ({ original }) => calculateConversion(original),
    },
    {
      Header: 'C.PSR',
      width: 60,
      accessor: (row) => {
        const collectedRevenue = row.CollectedRevenue;
        const admissions = row.Admissions;
        if (admissions === 0) {
          return 'N/A';
        }
        const cpsr = (collectedRevenue / admissions).toFixed(2);
        return cpsr;
      },
      id: 'cpsr',
    },
    {
      Header: 'B.PSR',
      width: 60,
      accessor: (row) => {
        const billedRevenue = row.BilledRevenue;
        const admissions = row.Admissions;
        if (admissions === 0) {
          return 'N/A';
        }
        const bpsr = (billedRevenue / admissions).toFixed(2);
        return bpsr;
      },
      id: 'bpsr',
    },
    {
      Header: 'C-Call',
      accessor: 'ConnectedCall',
      width: 50,
    },
    {
      Header: 'Talk Time',
      accessor: 'TalkTime',
      width: 80,
      Cell: ({ value }) => {
        const time = value.split(' ')[4];
        return <span>{time}</span>;
      },
    },
    {
      Header: 'Final',
      accessor: 'Final',
      width: 100,
    },
    {
      Header: 'Group',
      accessor: 'Group',
      width: 40,
    },
  ];



  const exportToExcel = () => {
    const dataToExport = data.map(item => ({
      'Counselor': item.Counselor,
      'Team Leaders': item.TeamLeaders,
      'Team Manager': item.TeamManager,
      'Sales Manager': item.SalesManager,
      'Role': item.Role,
      'Team': item.Team,
      'Status': item.Status,
      'Target': item.Target,
      'Admissions': item.Admissions,
      'Collected Revenue': item.CollectedRevenue,
      'Billed Revenue': item.BilledRevenue,
      'Total Lead': item.TotalLead,
      '% Achievement': ((item.Admissions / item.Target) * 100).toFixed(2) + '%',
      'Conversion%': ((item.Admissions / item.TotalLead) * 100).toFixed(2) + '%',
      'C.PSR': (item.CollectedRevenue / item.Admissions).toFixed(2),
      'B.PSR': (item.BilledRevenue / item.Admissions).toFixed(2),
      'Connected Call': item.ConnectedCall,
      'Talk Time': item.TalkTime.split(' ')[1],
      'Final': item.Final,
      'Group': item.Group,
      // 'CounselorWiseSummaries': item.CounselorWiseSummaries,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    // Save the workbook
    XLSX.writeFile(wb, `${selectedMonth}_CounselorWiseSummary.xlsx`);
  };

  // Add styling to the header row
  const getTheadThProps = (state, rowInfo, column) => ({
    className: 'custom-header',
  });

  // Add styling to the first column
  const getTdProps = (state, rowInfo, column) => ({
    className: 'custom-column',
  });


  return (

    <>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img style={{ width: "155px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" />
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
        <span className='heading ps-2 pe-2' style={{ fontSize: "11px" }}>Counselor Wise</span>
        <small role="button" onClick={exportToExcel}>Export</small>
      </div>
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={115}
        pageSizeOptions={[10, 20, 50, 100, 115, 125, 150, 200]}
        style={{
          height: "820px",
        }}
        getTheadThProps={getTheadThProps}
        getTdProps={getTdProps}
        className="-striped -highlight custom-table"
      />

    </>
  )
}

export default CounselorWiseSummary