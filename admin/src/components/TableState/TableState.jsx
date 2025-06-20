import "./TableState.css";
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { RiCloseLargeFill } from "react-icons/ri";
import { BsChevronRight } from "react-icons/bs";

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation,updateTableState} = useContext(StoreContext); // Fetching the context values
    const [isReserved, setIsReserved] = useState(false); // State to track if the table is reserved

    const [isOpenTimeSlot, setIsOpenTimeSlot] = useState(false);
    const onClickReserve = () => {setIsOpenTimeSlot(!isOpenTimeSlot);};
    const time = {"timeSlots": ["10","11","12","13","14","15","16","17","18","19","20","21"]};

    return (
        <section  className="table-item">

            <div class="card">
                <div class="content">
                <p class="logo">Table {tableNumber}</p>
                <div class="h6">Status: {tablestates} Capacity: {tableCapacity} &amp; Customer:</div>
                <div class="hover_content">
                    <p>
                    <button className="TableSteteButton" onClick={()=>updateTableState(tableNumber, "available")} >Enable</button>
                    <button className="TableSteteButton" onClick={()=>updateTableState(tableNumber, "unavailable")}>Disable</button>
                    <button className="TableSteteButton" >Edit</button>
                    </p>
                    <p>
                    <button className="TableSteteButton" >Splite</button>
                    <button className="TableSteteButton" onClick={onClickReserve}>View Detail<BsChevronRight/></button>
                    </p>
                </div>
                </div>
            </div>

            <div className={`table-timeslot ${isOpenTimeSlot ? 'show' : ''}`}>
            <div className="table-timeslot-close-container">
                <RiCloseLargeFill className="table-timeslot-close" onClick={onClickReserve}/>
            </div>
            <h4 className="table-timeslot-tilte">Available Time Slots</h4>
                {time.timeSlots.map((item, index) => {
                    return (
                        <div className="timeslot" >
                            {item}:00
                        </div>
                    );
                })}
            </div>
        </section >
    );
};

export default TableState;
