import "./TableState.css";
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext"; 

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation,updateTableState} = useContext(StoreContext); // Fetching the context values
    const [isReserved, setIsReserved] = useState(false); // State to track if the table is reserved

    

    return (
        <div className="table-container">
            <h2>Table {tableNumber}</h2>
            <p>Capacity: {tableCapacity}</p>
            <p className="table-container-state">Status: {tablestates}</p>
            {tablestates === "available" && !isReserved && (
            <></>
            )}
            <p>Customer:</p>
            
            <p>
            <button className="TableSteteButton" onClick={()=>updateTableState(tableNumber)} >Enable</button>
            <button className="TableSteteButton" >Disable</button>
            <button className="TableSteteButton" >Edit</button>
            </p>
            <p>
            <button className="TableSteteButton" >View Detail</button>
            <button className="TableSteteButton" >Splite</button>
            </p>
            
        </div>
    );
};

export default TableState;
