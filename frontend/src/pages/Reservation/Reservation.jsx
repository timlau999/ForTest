import React, {useContext, useEffect, useState} from "react";
import "./Reservation.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import TableState from "../../components/TableState/TableState";
import { use } from "react";
import { BsXLg } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';

    const Reservation = ({ backendUrl }) => {
    const naivigate = useNavigate();
    const { table_list, updateReservation, reservationF_list, getReservationF } = useContext(StoreContext);
    const userId = localStorage.getItem("userId");

    
    return(
        <div className="reservation-container">
            <h2>Reservation</h2>
            <div className="reservation-form">
                <p><label >Your Reservation : {userId? "" : "Please Login"} {userId & reservationF_list==null? "no pendind reservation" : ""}</label></p>
                <p><label >Table : {userId? (reservationF_list?.tableId) : "~"}</label></p>
                <p><label >Time : {userId? new Date(reservationF_list?.timeslot).toLocaleString() : "~"} </label></p>
                { userId? <button className="your-reservation-button" 
                    onClick={()=>{ toast.info((t) => ( 
                    <div>Cancel your reserveration?
                    <button onClick={() => {
                    toast.dismiss(t.id);
                    updateReservation(userId, "cancelled");
                    //getReservationF();
                    }}>Yes</button>
                    <button onClick={() => toast.dismiss(t.id)}>No</button>
                    </div>
                    ),{autoClose: false, position: "bottom-center",});
                    }}>Cancel<BsXLg/>
                </button> : "" }
            </div>
            <hr></hr>

            <h3>Real-time Tables States</h3>
            <h4>No. of Available Table:</h4>
            
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