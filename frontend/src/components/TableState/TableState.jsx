import "./Tablestate.css";
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext"; 

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation} = useContext(StoreContext); // Fetching the context values
    const [isReserved, setIsReserved] = useState(false); // State to track if the table is reserved

    

    return (
        <div className="table-container">
            <h2>Table {tableNumber}</h2>
            <p>Capacity: {tableCapacity}</p>
            <p>Status: {tablestates}</p>
            {tablestates === "available" && !isReserved && (
                <button >Reserve</button>
            )}
        </div>
    );
};

export default TableState;
