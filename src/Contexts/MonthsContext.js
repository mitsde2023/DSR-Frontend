import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MonthsContext = createContext();

export const MonthsProvider = ({ children }) => {
    const [months, setMonths] = useState([]);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const monthsData = await axios.get('http://65.1.54.123:8000/dsr_report/api/unique-monthsID');
                setMonths(monthsData.data);

                const initialFilterData = await axios.get(
                    `http://65.1.54.123:8000/dsr_report/hierarchical-data-filterID?selectedMonth=${monthsData.data[0]?.month || ''}`
                );
                setFilterData(initialFilterData.data.hierarchicalData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const fetchFilterData = async (selectedMonth) => {
        try {
            const hierarchyData = await axios.get(
                `http://65.1.54.123:8000/dsr_report/hierarchical-data-filterID?selectedMonth=${selectedMonth}`
            );
            setFilterData(hierarchyData.data.hierarchicalData);
        } catch (error) {
            console.error("Error fetching hierarchical data:", error);
        }
    };

    return (
        <MonthsContext.Provider value={{ months, filterData, crrMonth: 'Mar24', fetchFilterData }}>
            {children}
        </MonthsContext.Provider>
    );
};

export const useMonths = () => {
    return useContext(MonthsContext);
};
