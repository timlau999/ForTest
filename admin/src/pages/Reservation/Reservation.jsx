import React from "react";
import "./Reservation.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import TableState from "../../components/TableState/TableState";
import { BsSearch } from "react-icons/bs";
import {io} from 'socket.io-client';

//const socket = io('http://localhost:4000', {query: {role: 'admin'}});
const socket = io('http://smart.restaurant.vtcb02.tech', {query: {role: 'admin'}});

const Reservation = ({ url }) => {
    const navigate=useNavigate();
    const {token,admin} = useContext(StoreContext);
    const { table_list, updateReservation, fetchReservation, modifyReservationStatus, reservation_list } = useContext(StoreContext);
    const [selectedDate, setSelectedDate] = useState();
    const [inputuserId, setInputuserId] = useState();
    const [inputTableId, setInputTableId] = useState();

    useEffect(()=>{
        if (!sessionStorage.getItem("token")) {
              toast.error("Please Login First");
              navigate("/");
        }else if (sessionStorage.getItem("admin") || sessionStorage.getItem("staff")) {
              setSelectedDate(new Date().toLocaleDateString());
              fetchReservation(null, new Date().toLocaleDateString());}
    },[])
    
    useEffect(() => {
          socket.on('reservation_updated', () => {
            console.log("test")
              if(selectedDate){
                fetchReservation(null, selectedDate);
              }
              if(inputuserId){
                fetchReservation(inputuserId, null);
              }
          });
          return () => {
          socket.off('reservation_updated');
          };
        }, []);

return (
  <div className="reservation-table-container">
    <h3>Reservation</h3>

    <div className="reservation-table-form">
      
      <div className="table-list">
        <h3>Real-time Tables States</h3>
        <label >Search Table<BsSearch /></label>
        <input className="search-bar" type="text" placeholder="Table no." value={inputTableId} onChange={e => setInputTableId(e.target.value)} />
        <div className="table-list-container">
          {!inputTableId &&
            table_list.map((item, index) => (
              <TableState
                key={index}
                tableNumber={item.tableNumber}
                tableCapacity={item.tableCapacity}
                tablestates={item.tablestates}
              />
            ))
          }
          {inputTableId &&
            table_list.filter(item => item.tableNumber.toString() === (inputTableId)).map((item, index) => (
              <TableState
                key={index}
                tableNumber={item.tableNumber}
                tableCapacity={item.tableCapacity}
                tablestates={item.tablestates}
              />
            ))
          }
        </div>
      </div>
      <hr></hr>
      <div className="All-Reservation-list">
        <h3>All Reservation by : </h3>
        <label >Search Reservation : </label>
        <input className="search-bar" type="text" placeholder=" userID... " value={inputuserId}
          onChange={e => setInputuserId(e.target.value)} />
        <button className="search-icon" onClick={()=>{
          fetchReservation(inputuserId, null);
          setSelectedDate("")}}><BsSearch /></button>
        Or Search by date :
        <input className="search-reservation-bar-datepicker" type="date" value={selectedDate} 
          onChange={e => {setSelectedDate(e.target.value);
          fetchReservation(null, e.target.value);setInputuserId("")}}/>
        

        <div className="All-Reservation-table">
          {reservation_list.map((item) => {
            return (
              <div className="All-Reservation-container" key={item.reservationId}>
                <p>Reservation ID: {item.reservationId}</p>
                <p>User ID: {item.userId}</p>
                <p>Table ID: {item.tableId}</p>
                <p>Timeslot: {new Date(item.timeslot).toLocaleString()}</p>
                <p>States: {item.reservationStatus}</p>
                <p>Update at: {new Date(item.updatedAt).toLocaleString()}</p>
                <button className="ReservationButton" onClick={()=>modifyReservationStatus(item.reservationId, "pending")}>Pending</button>
                <button className="ReservationButton" onClick={()=>modifyReservationStatus(item.reservationId, "confirmed")}>confirm</button>
                <button className="ReservationButton" onClick={()=>modifyReservationStatus(item.reservationId, "cancelled")}>Cancel</button>
              </div>
            );
          })}           
        </div>
      </div>
    </div>

  </div>
  );
}

export default Reservation;
