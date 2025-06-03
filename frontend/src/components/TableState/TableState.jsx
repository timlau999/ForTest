import "./TableState.css";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { RiCloseLargeFill } from "react-icons/ri";

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation} = useContext(StoreContext);
    const [isReserved, setIsReserved] = useState(false);
    const [isOpenTimeSlot, setIsOpenTimeSlot] = useState(false);

    const [test,setIsTest] = useState("test");

    const userId = localStorage.getItem("userId"); 

    useEffect(() => {
        
    }, [tablestates]); 

    const onClickReserve = () => {setIsOpenTimeSlot(!isOpenTimeSlot);};

    const time = {"timeSlots": [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM"
    ]};


    return (
        <div className="table-state-container">

        <div className="table-container">
            <div className="table-info">
                <h2>Table {tableNumber}</h2>
                <p>Capacity: {tableCapacity}</p>
                <p>Status: {tablestates}</p>
                <p>test: {test} </p>
            </div>
        
            <div className="button-container">
            {/*tablestates === "available" && !isReserved && (
                <button className="reserveButton"  >Reserve</button>
            )*/}
            <button className="reserveButton" onClick={onClickReserve} >Reserve</button>
            </div>
        </div>

        <div className={`table-timeslot ${isOpenTimeSlot ? 'show' : ''}`}>
            <div className="table-timeslot-close-container"><RiCloseLargeFill className="table-timeslot-close"  onClick={onClickReserve} /></div>
            <h4 className="table-timeslot-tilte">Available Time Slots</h4>
                {time.timeSlots.map((item, index) => {
                    return (
                        <div className="timeslot" key={index} onClick={()=>{{setIsTest(item); alert("test");}}}>{item}</div>
                    );
                    {/*onClick={() => addReservation(userId, tableNumber, item)}*/}
                })}
        </div>

        </div>
    );
};

export default TableState;
