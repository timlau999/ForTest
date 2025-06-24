import React, { useEffect, useState } from "react";
import "./Test.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Test = ({url}) => {

    const navigate = useNavigate();
    const { token, admin } = useContext(StoreContext);

    return(
       <div>Hello World</div> 
    );

    
}

export default Test;