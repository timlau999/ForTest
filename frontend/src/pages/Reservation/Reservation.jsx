import React, {useContext, useEffect, useState} from "react";
import "./Reservation.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import TableState from "../../components/TableState/TableState";
import { use } from "react";
import { BsXLg } from "react-icons/bs";
import axios from "axios";

    const Reservation = ({ backendUrl }) => {
    const naivigate = useNavigate();
    const { table_list, removeReservationF, reservationF_list } = useContext(StoreContext);
    const userId = localStorage.getItem("userId");

    
    return(
        <div className="reservation-container">
            <h1>Reservation</h1>
            <div className="reservation-form">
                <p><label >Your Reservation : {userId? "UserID:" + userId : "Please Login"}</label></p>
                <p><label >Table : {userId? (reservationF_list?.tableId) : "~"}</label></p>
                <p><label >Time : {userId? new Date(reservationF_list?.timeslot).toLocaleString() : "~"}</label></p>
                <button className="your-reservation-button" 
                    onClick={()=>{{
                        if(window.confirm("Confirm cancel you reservation?")){
                            removeReservationF(userId);
                        }
                    }}}>
                    Cancel<BsXLg/>
                </button>
            </div>
            <hr></hr>

            <h2>Real-time Tables States</h2>
            <h3>No. of Available Table:</h3>
            
            <div className="table-list-container">
                {table_list.map((item, index) => {
                return(
                <TableState
                key={index}
                tableNumber={item.tableNumber}
                tableCapacity={item.tableCapacity}
                tablestates={item.tablestates}
                />
                )})}
            </div>
            
        </div>
    );
}

export default Reservation;