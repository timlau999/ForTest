import "./TableState.css";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation} = useContext(StoreContext); // Fetching the context values
    const [isReserved, setIsReserved] = useState(false); // State to track if the table is reserved

    const userId = localStorage.getItem("userId"); // Fetching the user ID from local storage

    useEffect(() => {
        
    }, [tablestates]); // Effect to handle changes in table states


    return (
        <div className="table-container">
            <h2>Table {tableNumber}</h2>
            <p>Capacity: {tableCapacity}</p>
            <p>Status: {tablestates}</p>
            {tablestates === "available" && !isReserved && (
                <button className="reserveButton" onClick={()=>addReservation(userId,tableNumber)} >Reserve</button>
            )}
        </div>
    );
};

export default TableState;
