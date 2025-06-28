import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client';

export const StoreContext = createContext(null);

//const socket = io('http://localhost:4000', {query: {role: 'admin'}});
const socket = io('http://smart.restaurant.vtcb02.tech', {query: {role: 'admin'}});

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [staff, setStaff] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [table_list, setTableList] = useState([]);
  const {url} = props;
  const [reservation_list, setReservation_list]= useState([]);

  useEffect(() => {
    async function loadData() {
      if (sessionStorage.getItem("token")) {
        setToken(sessionStorage.getItem("token"));
      }
      if (sessionStorage.getItem("admin")) {
        setAdmin(sessionStorage.getItem("admin"));
      }
      if (sessionStorage.getItem("userId")) {
        setUserId(sessionStorage.getItem("userId"));
      }
      if (sessionStorage.getItem("username")) {
        setUsername(sessionStorage.getItem("username"));
      }
    }
    loadData();
  }, []);

  const fetchtable = async () => {
    try{
        const response = await axios.get(`${url}/api/table/getTable`);
        console.log('API response:', response.data); 
        if (response.data.success) {
            setTableList(response.data.data);
            console.log('Stored table list in context:', response.data.data);
        } else {
            console.log('Failed to fetch table list:', response.data.message);
        }          
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchtable();
  }, [/*table_list*/]);

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

  const updateTableState = async (tableId, state) => {
        try {
            const response = await axios.post(`${url}/api/table/updateTableState`, {
                tableId,
                state
            });
            console.log('API response:', response.data); 
            if (response.data.success) {
                console.log('Table state updated successfully:', response.data.data);
                toast.success('Table state updated successfully');
                fetchtable();
            } else {
                console.log('Failed to update table state:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating table state:', error);
        }
    };

    const updateReservation = async (reservationId, reservationStatus) => {
        try {
            const response = await axios.post(`${url}/api/table/updateReservation`,{
               reservationId,
               reservationStatus 
            });
            if (response.data.success) {
                console.log('Update reservation status successfully:', response.data.data);
                toast.success('Update reservation status successfully');
            } else {
                console.log('Failed to update reservation:', response.data.message);
                toast.error('Failed to update reservation')
            }
        } catch (error) {
            console.error('Error update reservation:', error);
            toast.error(error);
        }
    };
    
    useEffect(() => {
            socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
            });
    
            socket.on('disconnect', () => {
            console.log('Disconnected from server');
            });
        }, []);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    staff,
    setStaff,
    userId,
    setUserId,
    username,
    setUsername,
    table_list,
    updateTableState,
    updateReservation,
    fetchReservation,
    modifyReservationStatus,
    reservation_list
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
