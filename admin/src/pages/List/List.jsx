import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { assets } from "../../assets/assets";
import { BsXCircle } from "react-icons/bs";
import { BsArrowClockwise } from "react-icons/bs";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token,admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [menuItem, setMenuItem] = useState([]);
  const [category, setCategory] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
      name: "",
      description: "",
      calories: "",
      category: "",
      menuId: "",
      price: "",
    });
  const [copiedData, setCopiedData] = useState(Object.assign({}, data));
  const [showIngredientForm, setShowIngredientForm] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/menus`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const fetchMenuItem= async () => {
    const response = await axios.get(`${url}/api/menuItem`);
    if (response.data.success) {
      setMenuItem(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

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
    formData.append("menuItemId", data.menuItemId);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("calories", data.calories);
    formData.append("category", data.category);
    formData.append("menuID", data.menuId);
    formData.append("price", Number(data.price));
    //formData.append("image", image);

    const response = await axios.post(`${url}/api/menuItem/edit`, formData,{headers:{token}});
    if (response.data.success) {
      fetchMenuItem();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("token")) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
    fetchMenuItem();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List {category? category: ""}</p>

      <div className="list-table">
        {list.map((item, index) => {
          return (
            <div key={index}>
              <button className="list-button" onClick={()=>setCategory(item.description)}>
                {item.menuId}{item.description}
              </button>
            </div>
            );
        })}
      </div>

      <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Description</b>
          <b>Price</b>
          <b>Action</b>
      </div>

        {menuItem.map((item, index) => {
          if (category === item.category){
            return (
            <div key={index} className="list-table-format">
              <img /* src={`${url}/images/` + item.image} */ alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <p>
                <div className="cursor">
                  <div><BsFillPencilFill onClick={() => {setShowEditForm(!showEditForm);
                  let preData = {
                    menuItemId: item._id,
                    name: item.name,
                    description: item.description,
                    calories: item.calories,
                    category: item.category,
                    menuId: item.menuId,
                    price: item.price,
                  }
                  setData(preData); setCopiedData(preData);
                  }}/></div>
                  <div><BsReverseLayoutTextSidebarReverse onClick={() => 
                  setShowIngredientForm(!showIngredientForm)}/></div>
                </div>
              </p>
            </div>
          );
          }
          return null;
        })}
        
        {showEditForm && (
          <div className="edit-menuitem-container">
          <BsXCircle onClick={() => setShowEditForm(!showEditForm)}/>
            <BsArrowClockwise onClick={() => setData(copiedData)}/>
            <form onSubmit={onSubmitHandler} className="flex-col">
              <div className="edit-img-upload flex-col">
                <p>Upload image</p>
                <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt=""/>
            </label>
            <input
              //onChange={(e) => setImage(e.target.files[0])}
              //type="file"
              //id="image"
              hidden
              //required
            />
          </div>
          <div className="edit-product-name flex-col">
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
          <div className="edit-product-description flex-col">
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
          <div className="edit-category-price">
            <div className="edit-price flex-col">
              <p>Calories{data.calories}</p>
              <input
                onChange={onChangeHandler}
                value={data.calories}
                type="Number"
                name="calories"
                placeholder="cal"
                required
              />
            </div>
            <div className="edit-category flex-col">
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
            <div className="edit-price flex-col">
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
          <button type="submit" className="edit-btn">
            EDIT
          </button>
        </form>
      </div>)}

      {showIngredientForm && (
        <div className="edit-menuitem-container">
          <BsXCircle onClick={() => setShowIngredientForm(!showIngredientForm)}/>
          <BsArrowClockwise/>
          <form className="flex-col">
            <p>Ingredients</p>
            <textarea
              rows="6"
              placeholder="testing"
              required
            ></textarea>
            <button className="edit-btn">Edit</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default List;
