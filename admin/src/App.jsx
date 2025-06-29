import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import Reservation from "./pages/Reservation/Reservation";
import Account from "./pages/Account/Account";
import StoreContextProvider from './context/StoreContext.jsx';
import Test from "./pages/Test/Test";

const App = () => {
 const url = "http://localhost:4000";
//const url = "http://smart.restaurant.vtcb02.tech";

  return (
    <StoreContextProvider url={url}>
    <div>
      <ToastContainer />
      <Navbar url={url}/>
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login url={url}/>} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          <Route path="/Reservation" element={<Reservation url={url}/>} />
          <Route path="/Account" element={<Account url={url}/>} />
          <Route path="/Test" element={<Test url={url}/>} />
        </Routes>
      </div>
    </div>
    </StoreContextProvider>
  );
};

export default App;
