import React, { createContext, useContext, useState } from "react";

const DataServiceContext = createContext();

export const useDataServiceContext = () => {
    return useContext(DataServiceContext);
};

const DataServiceProvider = (props) => {

    const [apiData, setApidata] = useState({});
    const [errorDetails, setErrorDetails] = useState({});

    const errorHandlingForApis = (error) => {
        setErrorDetails(error)
    }

    const handleSetApiData = (newData) => {
        setApidata((prev) => {
            return {
                ...prev,
                ...newData
            }
        })
    }

    return (
        <DataServiceContext.Provider value={{apiData, handleSetApiData, errorDetails, setErrorDetails, errorHandlingForApis}}>
            {props.children}
        </DataServiceContext.Provider>
    );
};

export default DataServiceProvider;