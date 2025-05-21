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


const Reservation = ({ url }) => {
    const navigate=useNavigate();
    const {token,admin} = useContext(StoreContext);
    const { table_list } = useContext(StoreContext);
    const [reservation_list, setReservation_list]= useState([]);

    const fetchReservation = async () => {
        const response = await axios.get(`${url}/api/table/getReservation`);
        if (response.data.success) {
          setReservation_list(response.data.data);
        } else {
          toast.error("Error");
        }
      };
      
      
    useEffect(()=>{
      if(!admin && !token){
        toast.error("Please Login First");
          navigate("/");
        }
      fetchReservation();
      },[])

    
      
return (
  <div className="reservation-table-container">
    <h3>Reservation</h3>

    <div className="reservation-table-form">
      
      <div className="table-list">
        <h3>Real-time Tables States</h3>
        <p><label >No. of Available Table:</label></p>
        <label >Search Reservation: </label>
        <input type="text" placeholder="Table/ID/Phone.no" />
        <img src={assets.search} alt="search" className="search-icon"/>
        <div className="table-list-container">
          {table_list.map((item, index) => {
          return(
          <TableState
          key={index}
          tableNumber={item.tableNumber}
          tableCapacity={item.tableCapacity}
          tablestates={item.tablestates} // Assuming this is the state of the table
          />
          )})}
        </div>
      </div>

      <div className="All-Reservation-list">
        <h3>All Reservation List</h3>
        <label >Search Reservation: </label>
        <input type="text" placeholder="Table/ID/Phone.no" />
        <img src={assets.search} alt="search" className="search-icon"/>
        
        <div className="All-Reservation-table">
          
          {reservation_list.map((item) => {
            return (
              <div className="All-Reservation-container" key={item.reservationId}>
                <p>Reservation ID: {item.reservationId}</p>
                <p>User ID: {item.userId}</p>
                <p>Table ID: {item.tableId}</p>
                <p>Time: {item.reservationUpdate}</p>
                <p>States: {item.reservationStatus}</p>
                <button className="ReservationButton">Pending</button>
                <button className="ReservationButton">confirm</button>
                <button className="ReservationButton">Cancel</button>
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