import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-6';
import axios from 'axios';
import 'react-table-6/react-table.css';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
function CounselorWiseSummary() {
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [month, setMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSalesManager, setSelectedSalesManager] = useState('');
  const [selectedTeamManager, setSelectedTeamManager] = useState('');
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');

  useEffect(() => {
    async function fetchHierarchyData() {
      try {
        const hierarchyData = await axios.get('http://65.1.54.123:8000/dsr_report/hierarchical-data-filter');
        setMonth(hierarchyData.data.uniqueMonths);
        setFilterData(hierarchyData.data.hierarchicalData);
      } catch (error) {
        console.error('Error fetching hierarchical data:', error);
      }
    }

    fetchHierarchyData();
  }, []);

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

  console.log(selectedSalesManager, selectedTeamManager, selectedTeamLeader, 112)

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
        const response = await axios.get(`http://65.1.54.123:8000/dsr_report/counselor-metrics?${queryString}`);
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
      width: 120,
      fixed: 'sticky',
      sticky: 'sticky',
    },
    {
      Header: 'Team Leaders',
      accessor: 'TeamLeaders',
      width: 120,
    },
    {
      Header: 'Team Manager',
      accessor: 'TeamManager',
      width: 120,
    },
    {
      Header: 'S Manager',
      accessor: 'SalesManager',
      Cell: ({ value }) => value === 'Jayjeet Deshmukh' ? 'JD' : value,
      width: 50,
    },
    {
      Header: 'Team',
      accessor: 'Team',
      width: 80,
    },
    {
      Header: 'Status',
      accessor: 'Status',
      width: 70,
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
      Header: 'Collected Revenue',
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
      Header: 'BilledRevenue',
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
      Header: '% Achievement',
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
      Header: 'Conversion%',
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
      id: 'cpsr', // Unique ID for the 'C.PSR' column
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
      id: 'bpsr', // Unique ID for the 'B.PSR' column
    },
    {
      Header: 'C-Call',
      accessor: 'ConnectedCall',
      width: 50,
    },
    {
      Header: 'Talk Time',
      accessor: 'TalkTime',
      width: 70,
      Cell: ({ value }) => {
        const time = value.split(' ')[1];
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
      width: 50,
    },
    {
      Header: 'CounselorWiseSummaries',
      accessor: 'CounselorWiseSummaries',
      Cell: ({ original }) => (
        <select>
          {original.CounselorWiseSummaries.map((summary, index) => (
            <option key={index}>
              {`${summary.AmountReceived}/${summary.AmountBilled}/${summary.Specialization}`}
            </option>
          ))}
        </select>
      ),
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
    XLSX.writeFile(wb, 'CounselorWiseSummary.xlsx');
  };



  return (

    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand d-flex ms-2" href="#home">
          <img style={{ width: "140px" }} src='https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png' alt="MITSDE logo" />
          <small className='ms-2'>{renderMonthDropdown()}</small>
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
            <li className="nav-item">
              {renderSalesManagerDropdown()}
            </li>
            <li className="nav-item">
              {renderTeamManagerDropdown()}
            </li>
            <li className="nav-item">
              {renderTeamLeaderDropdown()}
            </li>

            <li className='nav-item'>
              <p className='nav-link' role="button" onClick={exportToExcel}>Export</p>
            </li>
          </ul>
        </div>
      </nav>
      <hr />
      <span className='heading ps-5 pe-5 p-1'>Counselor Wise Summary</span>

      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={112}
        pageSizeOptions={[10, 20, 50, 100, 115, 125, 150, 200]}
        getTheadThProps={(state, rowInfo, column) => ({
          style: {
            backgroundColor: 'yellow',
            position: 'sticky',
            top: '0',
            zIndex: '1'
          },
          className: 'custom-header',
        })}
        className="-striped -highlight custom-table p-2"
      />

    </>
  )
}

export default CounselorWiseSummary