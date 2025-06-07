import "./TableState.css";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { RiCloseLargeFill } from "react-icons/ri";
import { BsChevronRight } from "react-icons/bs";

const TableState = ({tableNumber,tableCapacity,tablestates }) => {
    const {addReservation, removeReservation} = useContext(StoreContext);
    const [isReserved, setIsReserved] = useState(false);
    const [isOpenTimeSlot, setIsOpenTimeSlot] = useState(false);

    const userId = localStorage.getItem("userId"); 

    /*useEffect(() => {
        
    }, [tablestates]); */

    const onClickReserve = () => {setIsOpenTimeSlot(!isOpenTimeSlot);};

    const time = {"timeSlots": ["10","11","12","13","14","15","16","17","18","19","20","21"]};


    return (
        <div className="table-state-container">

        <div className="table-container">
            <div className="table-info">
                <h2>Table {tableNumber}</h2>
                <p>Capacity: {tableCapacity}</p>
                <p>Status: {tablestates}</p>
            </div>
        
            <div className="button-container">
            {/*tablestates === "available" && !isReserved && (
                <button className="reserveButton"  >Reserve</button>
            )*/}
            <button className="reserveButton" onClick={onClickReserve} >Reserve <BsChevronRight/></button>
            </div>
        </div>

        <div className={`table-timeslot ${isOpenTimeSlot ? 'show' : ''}`}>
            <div className="table-timeslot-close-container">
                <RiCloseLargeFill className="table-timeslot-close" onClick={onClickReserve}/>
            </div>
            <h4 className="table-timeslot-tilte">Available Time Slots</h4>
                {time.timeSlots.map((item, index) => {
                    return (
                        <div className="timeslot" key={index} onClick={()=>{{
                            if (item<(new Date().getHours())) {
                                alert("You can only reserve for future time slots.");
                                return;
                            }else if(window.confirm("Confirm your reserveration?")){
                                addReservation(userId, tableNumber, item);
                            };
                            onClickReserve();
                        }}}>
                            {item}:00
                        </div>
                    );
                })}
        </div>

        </div>
    );
};

export default TableState;
