import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import {useNavigate } from "react-router-dom";

const Add = ({url}) => {
  const navigate=useNavigate();
  const {token,admin, userId} = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    calories: "",
    category: "Japanese Cuisine",
    menuId: "1",
    price: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let menuId = "";
    setData((data) => ({ ...data, [name]: value }));
    switch (value) {
    case "Japanese Cuisine":menuId = "1";break;
    case "Chinese Cuisine":menuId = "2";break;
    case "Western Cuisine":menuId = "3";break;
    case "Thai Cuisine":menuId = "4";break;
    case "Korean Cuisine":menuId = "5";break;
    case "Deserts":menuId = "6";break;
    default:menuId = "";
    }
    setData((data) => ({ ...data, menuID: menuId }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("calories", data.calories);
    formData.append("category", data.category);
    formData.append("menuID", data.menuId);
    formData.append("price", Number(data.price));
    //formData.append("image", image);

    const response = await axios.post(`${url}/api/menuItem/add`, formData,{headers:{token}});
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        calories: "",
        category: "Japanese Cuisine",
        menuId: "1",
        price: "",
      });
      //setImage(false);
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
  },[])
  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            //onChange={(e) => setImage(e.target.files[0])}
            //type="file"
            //id="image"
            hidden
            //required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-price flex-col">
            <p>Calories</p>
            <input
              onChange={onChangeHandler}
              value={data.calories}
              type="Number"
              name="calories"
              placeholder="cal"
              required
            />
          </div>
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Japanese Cuisine">Japanese Cuisine</option>
              <option value="Chinese Cuisine">Chinese Cuisine</option>
              <option value="Western Cuisine">Western Cuisine</option>
              <option value="Thai Cuisine">Thai Cuisine</option>
              <option value="Korean Cuisine">Korean Cuisine</option>
              <option value="Deserts">Deserts</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
