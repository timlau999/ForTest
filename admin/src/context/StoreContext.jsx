import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [table_list, setTableList] = useState([]);
  const {url} = props;

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

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    userId,
    setUserId,
    username,
    setUsername,
    table_list,
    updateTableState,
    updateReservation
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
