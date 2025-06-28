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
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { BsArrowClockwise } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";

const List = ({ url }) => {
    const navigate = useNavigate();
    const { token, admin, userId } = useContext(StoreContext);
    const [list, setList] = useState([]);
    const [menuItem, setMenuItem] = useState([]);
    const [category, setCategory] = useState("Japanese Cuisine");
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
    const [showOtherForm, setShowOtherForm] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentMenuItemId, setCurrentMenuItemId] = useState(null);
    const [currentMenuItemName, setCurrentMenuItemName] = useState("");
    const [showIngredientsTab, setShowIngredientsTab] = useState(true);
    const [showEditIngredientsForm, setShowEditIngredientsForm] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [copySelectedIngredients, setCopySelectedIngredients] = useState([]);
    const [ingredientsForm, setIngredientsForm] = useState([]);
    const [inputSearch, setInputSearch] = useState("");

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/menus`);
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error");
        }
    };

    const fetchMenuItem = async () => {
        const response = await axios.get(`${url}/api/menuItem`);
        if (response.data.success) {
            setMenuItem(response.data.data);
            console.log(response.data.data);
        } else {
            toast.error("Error");
        }
    };

    const onIngredientChange = (ingredientId, name) => {

    if (selectedIngredients.some(item => item.ingredientId === ingredientId)) {
      setSelectedIngredients(selectedIngredients.filter(item => item.ingredientId !== ingredientId));
    } else {
      setSelectedIngredients([...selectedIngredients, {ingredientId: ingredientId, name: name}]);
    }
    };

    const onSubmitHandlerEditIngredients = async (event) => {
        event.preventDefault();
        const ingredientIds = selectedIngredients.map(item => item.ingredientId);
        const response = await axios.post(`${url}/api/menuItem/editIngredients`, {
            menuItemId: currentMenuItemId,
            ingredientsIds: ingredientIds
        }, {
            headers: { token },
        });
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
            
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let menuId = "";
        setData((data) => ({ ...data, [name]: value }));
        switch (value) {
            case "Japanese Cuisine":
                menuId = "1";
                break;
            case "Chinese Cuisine":
                menuId = "2";
                break;
            case "Western Cuisine":
                menuId = "3";
                break;
            case "Thai Cuisine":
                menuId = "4";
                break;
            case "Korean Cuisine":
                menuId = "5";
                break;
            case "Deserts":
                menuId = "6";
                break;
            default:
                menuId = "";
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

        const response = await axios.post(`${url}/api/menuItem/edit`, formData, {
            headers: { token },
        });
        if (response.data.success) {
            fetchMenuItem();
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    };

    const fetchIngredients = async (menuItemId) => {
        try {
            const response = await axios.get(
                `${url}/api/menuItem/menuItemingredients?menuItemId=${menuItemId}`
            );
            if (response.data.success) {
                setIngredients(response.data.data);
                console.log(response.data.data);
            } else {
                toast.error("Error fetching ingredients");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching ingredients");
        }
    };

    const fetchIngredientsForm = async () => {
      try {
        const response = await axios.get(`${url}/api/menuItem/ingredients`);
        setIngredientsForm(response.data.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    const fetchReviews = async (menuItemId) => {
        try {
            const response = await axios.get(
                `${url}/api/menuItem/reviews?menuItemId=${menuItemId}`
            );
            if (response.data.success) {
                setReviews(response.data.data);
            } else {
                toast.error("Error fetching reviews");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching reviews");
        }
    };

    const renderRatingStars = (ratingValue) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= ratingValue ? '#ffc107' : '#ddd',
                        fontSize: '18px',
                        marginRight: '2px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
                    toast.error("Please Login First");
                    navigate("/");
                }else if (!sessionStorage.getItem("admin")) {
                    toast.error("You are not an admin");
                    navigate("/orders");
                }else{
        fetchList();
        fetchMenuItem();}
    }, []);

    const handleImageLoad = (menuItemId) => {
        console.log(`Image for menu item ${menuItemId} loaded successfully`);
    };

    const handleImageError = (menuItemId) => {
        console.error(`Failed to load image for menu item ${menuItemId}`);
    };

    return (
        <div className="list add flex-col">
            <p>All Menuitem List</p>
            <div><input className="search-menuitem-input" type="text" placeholder="Search..." 
            value={inputSearch} onChange={e => {setInputSearch(e.target.value);setCategory("");}}
            /><BsSearch style={{marginLeft: "5px"}}/></div>
            <div className="list-table">
                {list.map((item, index) => {
                    return (
                        <div key={index}>
                            <button
                                className={`list-button${category === item.description ? "active" : ""}`}
                                onClick={() => {setCategory(item.description); setInputSearch("");}}
                            >
                                {item.description}
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

            {!inputSearch && menuItem.map((item, index) => {
                if (category === item.category) {
                    return (
                        <div key={index} className="list-table-format">
                            <img
                                src={`../../../public/menuitem_${item._id}.png`}
                                alt={item.name || "Menu Item"}
                                onLoad={() => handleImageLoad(item._id)}
                                onError={() => handleImageError(item._id)}
                            />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{item.description}</p>
                            <p>${item.price}</p>
                            <div className="action-column">
                                <div className="cursor">
                                    <div>
                                        <BsFillPencilFill
                                            onClick={() => {
                                                setShowEditForm(!showEditForm);
                                                let preData = {
                                                    menuItemId: item._id,
                                                    name: item.name,
                                                    description: item.description,
                                                    calories: item.calories,
                                                    category: item.category,
                                                    menuId: item.menuId,
                                                    price: item.price,
                                                };
                                                setData(preData);
                                                setCopiedData(preData);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BsReverseLayoutTextSidebarReverse
                                            onClick={() => {
                                                setShowOtherForm(!showOtherForm);
                                                const menuItemId = item._id;
                                                setCurrentMenuItemId(menuItemId);
                                                const menuItemName = item.name;
                                                setCurrentMenuItemName(menuItemName);
                                                if (showOtherForm) {
                                                    setIngredients([]);
                                                    setReviews([]);
                                                } else {
                                                    fetchIngredients(menuItemId);
                                                }
                                                setShowIngredientsTab(true);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BsXCircle
                                            onClick={async () => {
                                                toast.info((t)=>(
                                                    <div>
                                                        <div>Delete this menu item?</div>
                                                        <button
                                                        onClick={async()=>{
                                                            toast.dismiss(t.id);
                                                                const response = await axios.delete(
                                                                `${url}/api/menuItem/delete?menuItemId=${item._id}&userId=${userId}`,
                                                                { headers: { token } }
                                                                );
                                                                if (response.data.success) {
                                                                fetchMenuItem();
                                                                toast.success(response.data.message);
                                                                } else {
                                                                toast.error(response.data.message);
                                                                }
                                                        }}
                                                        >Yes</button>
                                                        <button onClick={() => toast.dismiss(t.id)}>No</button>
                                                    </div>
                                                ), { autoClose: false, position: "bottom-center" }
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
            {inputSearch && menuItem.filter(item => item.name.toLowerCase().includes(inputSearch.toLowerCase())).map((item, index) => {
                return (
                <div key={index} className="list-table-format">
                            <img
                                src={`../../../public/menuitem_${item._id}.png`}
                                alt={item.name || "Menu Item"}
                                onLoad={() => handleImageLoad(item._id)}
                                onError={() => handleImageError(item._id)}
                            />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{item.description}</p>
                            <p>${item.price}</p>
                            <div className="action-column">
                                <div className="cursor">
                                    <div>
                                        <BsFillPencilFill
                                            onClick={() => {
                                                setShowEditForm(!showEditForm);
                                                let preData = {
                                                    menuItemId: item._id,
                                                    name: item.name,
                                                    description: item.description,
                                                    calories: item.calories,
                                                    category: item.category,
                                                    menuId: item.menuId,
                                                    price: item.price,
                                                };
                                                setData(preData);
                                                setCopiedData(preData);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BsReverseLayoutTextSidebarReverse
                                            onClick={() => {
                                                setShowOtherForm(!showOtherForm);
                                                const menuItemId = item._id;
                                                setCurrentMenuItemId(menuItemId);
                                                const menuItemName = item.name;
                                                setCurrentMenuItemName(menuItemName);
                                                if (showOtherForm) {
                                                    setIngredients([]);
                                                    setReviews([]);
                                                } else {
                                                    fetchIngredients(menuItemId);
                                                }
                                                setShowIngredientsTab(true);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BsXCircle
                                            onClick={async () => {
                                                toast.info((t)=>(
                                                    <div>
                                                        <div>Delete this menu item?</div>
                                                        <button
                                                        onClick={async()=>{
                                                            toast.dismiss(t.id);
                                                                const response = await axios.delete(
                                                                `${url}/api/menuItem/delete?menuItemId=${item._id}&userId=${userId}`,
                                                                { headers: { token } }
                                                                );
                                                                if (response.data.success) {
                                                                fetchMenuItem();
                                                                toast.success(response.data.message);
                                                                } else {
                                                                toast.error(response.data.message);
                                                                }
                                                        }}
                                                        >Yes</button>
                                                        <button onClick={() => toast.dismiss(t.id)}>No</button>
                                                    </div>
                                                ), { autoClose: false, position: "bottom-center" }
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>)
            })}

            {showEditForm && (
                <div className="edit-menuitem-container">
                    <BsXCircle onClick={() => setShowEditForm(!showEditForm)} />
                        <BsArrowClockwise onClick={() => setData(copiedData)}/>
                    <form onSubmit={onSubmitHandler} className="flex-col">
                        <div className="edit-img-upload flex-col">
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
                </div>
            )}

            {showOtherForm && (
                <div className="other-form-container">
                    <h4>{currentMenuItemName}</h4>
                    <BsXCircle className="close-button" onClick={() => setShowOtherForm(!showOtherForm)} />
                    <div className="tab-header">
                        <button
                            className={showIngredientsTab ? "active-tab" : ""}
                            onClick={() => {
                                setShowIngredientsTab(true);
                                fetchIngredients(currentMenuItemId);
                            }}
                        >
                            Potential Allergens
                        </button>
                        <button
                            className={!showIngredientsTab ? "active-tab" : ""}
                            onClick={() => {
                                setShowIngredientsTab(false);
                                fetchReviews(currentMenuItemId);
                            }}
                        >
                            Reviews
                        </button>
                    </div>
                    <div className="tab-content">
                        {showIngredientsTab ? (
                            <div>
                                <h3 style={{ display: "flex", alignItems: "center" }}>Potential Allergens
                                    <button class="social-btn A"><BsFillPencilFill 
                                    onClick={() => {setShowEditIngredientsForm(!showEditIngredientsForm);
                                    fetchIngredientsForm();
                                    setSelectedIngredients(ingredients);
                                    setCopySelectedIngredients(ingredients);
                                    }} /></button>
                                </h3>
                                {ingredients.length > 0 ? (
                                    <ul>
                                        {ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No data</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h3>Reviews</h3>
                                {reviews.length > 0 ? (
                                    <div>
                                        <p>Average Rating: {(() => {
                                            let totalRating = 0;
                                            reviews.forEach(review => {
                                                totalRating += review.rating;
                                            });
                                            const averageRating = totalRating / reviews.length;
                                            return renderRatingStars(averageRating);
                                        })()}</p>
                                        {reviews.map((review, index) => (
                                            <div key={index}>
                                                <p>{index + 1}. {review.content}</p>
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No reviews data</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showEditIngredientsForm && (
                <div className="edit-ingredients-container-title">
                    <BsXCircle onClick={() => setShowEditIngredientsForm(!showEditIngredientsForm)} />
                    <BsArrowClockwise onClick={() => setSelectedIngredients(copySelectedIngredients)}/>
                    <form onSubmit={onSubmitHandlerEditIngredients} className="flex-col">
                        <div className="edit-ingredients flex-col">
                            <h4>{currentMenuItemName}</h4>
                          <p>Potential Allergens</p>
                          <div className="edit-ingredients-container"> 
                            <div className="edit-ingredients-grid">
                              {ingredientsForm.map((ingredientsForm) => (
                                <div key={ingredientsForm.ingredientId} className="edit-ingredient-checkbox">
                                  <input
                                    type="checkbox"
                                    id={ingredientsForm.ingredientId}
                                    checked={selectedIngredients.some(item => item.ingredientId === ingredientsForm.ingredientId)}
                                    onChange={() => onIngredientChange(ingredientsForm.ingredientId, ingredientsForm.name)}
                                  />{ingredientsForm.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="add-btn">
                          EDIT
                        </button>
                    </form>
                </div>
            )}
            
        </div>
    );
};

export default List;