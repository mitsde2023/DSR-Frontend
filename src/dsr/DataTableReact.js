import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function DataTableReact() {
    const [data, setData] = useState([]);
    const [selectedSalesManager, setSelectedSalesManager] = useState('');
    const [selectedTeamManager, setSelectedTeamManager] = useState('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    useEffect(() => {
        async function fetchHierarchyData() {
            try {
                const hierarchyData = await axios.get('http://localhost:8000/dsr_report/hierarchical-data-filter');
                setData(hierarchyData.data);
            } catch (error) {
                console.error('Error fetching hierarchical data:', error);
            }
        }
        fetchHierarchyData();
    }, []);
    const renderSalesManagerDropdown = () => {
        const salesManagers = Object.keys(data);
        const options = salesManagers.map((salesManager) => (
            <option key={salesManager} value={salesManager}>
                {salesManager}
            </option>
        ));

        return (
            <select value={selectedSalesManager} onChange={handleSalesManagerChange}>
                <option value={''}>All Manager</option>
                {options}
            </select>
        );
    };

    const renderTeamManagerDropdown = () => {
        if (!selectedSalesManager) return null;

        const filtTeamManagers = data[selectedSalesManager];
        const filteredTeamManagers = Object.keys(filtTeamManagers)
        const options = filteredTeamManagers.map((teamManager) => (
            <option key={teamManager} value={teamManager}>
                {teamManager}
            </option>
        ));

        return (
            <select value={selectedTeamManager} onChange={handleTeamManagerChange}>
                <option value={''}>{`All Team Manager`}</option>
                {options}
            </select>
        );
    };

    const renderTeamLeaderDropdown = () => {
        if (!selectedSalesManager || !selectedTeamManager) return null;

        const filtTeamLeaders = data[selectedSalesManager][selectedTeamManager];
        const filteredTeamLeaders = Object.keys(filtTeamLeaders)
        const options = filteredTeamLeaders.map((teamLeader) => (
            <option key={teamLeader} value={teamLeader}>
                {teamLeader}
            </option>
        ));

        return (
            <select value={selectedTeamLeader} onChange={handleTeamLeaderChange}>
                <option value={''}>{`All Team Leader under`}</option>
                {options}
            </select>
        );
    };
    const handleSalesManagerChange = (event) => {
        const value = event.target.value;
        localStorage.setItem('selectedSalesManager', value);
        localStorage.removeItem('selectedTeamManager');
        localStorage.removeItem('selectedTeamLeader');
        setSelectedSalesManager(value);
        setSelectedTeamManager('');
        setSelectedTeamLeader('');
    };

    const handleTeamManagerChange = (event) => {
        const value = event.target.value;
        localStorage.setItem('selectedTeamManager', value);
        localStorage.removeItem('selectedTeamLeader');
        setSelectedTeamManager(value);
        setSelectedTeamLeader('');
    };

    const handleTeamLeaderChange = (event) => {
        const value = event.target.value;
        localStorage.setItem('selectedTeamLeader', value);
        setSelectedTeamLeader(value);
    };


    return (
        <>
            <div className='m-2 d-flex'>
                <button className='btn btn-primary me-2 active'><Link className='text-white' to={'/'}>CounselorWiseSummary</Link></button>
                <button className='btn btn-primary me-2'><Link className='text-white' to={'/overall-Data-Table'}>Overall Summary</Link></button>
                <button className='btn btn-primary'><Link className='text-white' to={'/tltm'}>TL-TM</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/Excluding-TL'}>Excluding-TL</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/group-wise'}>Group-Wise</Link></button>
                <div className='ps-5 d-flex'>
                    <div className='ps-2'>{renderSalesManagerDropdown()}</div>
                    <div className='ps-2'>{renderTeamManagerDropdown()}</div>
                    <div className='ps-2'>{renderTeamLeaderDropdown()}</div>
                </div>
            </div>

        </>
    )
}

export default DataTableReact;