import React, {useContext} from "react";
import "./Reservation.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import TableState from "../../components/TableState/TableState";

const Reservation = ({}) => {
    const naivigate = useNavigate();
    const { table_list } = useContext(StoreContext);
    
    return(
        <div className="reservation-container">
            <h1>Reservation</h1>
            <div className="reservation-form">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required />

                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" required />

                <label htmlFor="time">Time:</label>
                <input type="time" id="time" name="time" required />

                <label htmlFor="guests">Number of Guests:</label>
                <input type="number" id="guests" name="guests" min="1" required />

                <button type="submit">Submit Reservation</button>
            
            

            <div className="table-list">
            <h2>Tables</h2>
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
            </div>
            </div>
    );
}

export default Reservation;