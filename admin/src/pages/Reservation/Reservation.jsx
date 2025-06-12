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

const Reservation = ({ url }) => {
    const navigate=useNavigate();
    const {token,admin} = useContext(StoreContext);
    const { table_list, updateReservation } = useContext(StoreContext);
    const [reservation_list, setReservation_list]= useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [inputuserId, setInputuserId] = useState();

    const fetchReservation = async (inputuserId, selectedDate) => {
        const response = await axios.post(`${url}/api/table/getReservationA`,{
          ...(inputuserId && { inputuserId }),
          ...(selectedDate && { selectedDate })
        });
        if (response.data.success) {
          setReservation_list(response.data.data);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      };
      
      
    useEffect(()=>{
      if(!sessionStorage.getItem("admin") && !sessionStorage.getItem("token")){
          toast.error("Please Login First");
          navigate("/");
        }
      ;
      },[])

    const modifyReservationStatus = (reservationId, reservationStatus) => {
      toast.info((t) => ( 
      <div>Modify the reserveration?
      <button onClick={() => {
      toast.dismiss(t.id);
      updateReservation(reservationId, reservationStatus);
      }}>Yes</button>
      <button onClick={() => toast.dismiss(t.id)}>No</button>
      </div>
      ),{autoClose: false, position: "bottom-center",});
    }


      
return (
  <div className="reservation-table-container">
    <h3>Reservation</h3>

    <div className="reservation-table-form">
      
      <div className="table-list">
        <h3>Real-time Tables States</h3>
        <p><label >No. of Available Table:</label></p>
        <label >Search Reservation: </label>
        <input className="search-bar" type="text" placeholder="Table no." />
        <button className="search-icon"><BsSearch /></button>
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
      <hr></hr>
      <div className="All-Reservation-list">
        <h3>All Reservation by : </h3>
        <label >Search Reservation : </label>
        <input className="search-bar" type="text" placeholder=" userID... " value={inputuserId}
          onChange={e => setInputuserId(e.target.value)} />
        <button className="search-icon" onClick={()=>fetchReservation(inputuserId, null)}><BsSearch /></button>
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