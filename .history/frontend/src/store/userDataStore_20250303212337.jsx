import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();


export const userDataProvider=({children})=>{


    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);