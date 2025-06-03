import React, {useContext} from "react";
import "./Reservation.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import TableState from "../../components/TableState/TableState";
import { use } from "react";

const Reservation = ({}) => {
    const naivigate = useNavigate();
    const { table_list } = useContext(StoreContext);
    

    return(
        <div className="reservation-container">
            <h1>Reservation</h1>
            <div className="reservation-form">
                <p><label >Your Reservation:</label></p>
                <p><label >Table:</label></p>
                <p><label >Time:</label></p>
            </div>

            <h2>Real-time Tables States</h2>
            <h3>No. of Available Table:</h3>
            
            <div className="table-list-container">
                {/*table_list.map((item, index) => {
                return(
                <TableState
                key={index}
                tableNumber={item.tableNumber}
                tableCapacity={item.tableCapacity}
                tablestates={item.tablestates}
                />
                )})*/}

                <TableState />
                <TableState />
                <TableState />
                
            </div>
            
        </div>
    );
}

export default Reservation;