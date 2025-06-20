import MenuItem from '../models/menuItemModel.js';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import fs from 'fs';

// add menuItem items
const addMenuItem = async (req, res) => {
  //let image_filename = `${req.file.filename}`;
  try {
    let userData = await Admin.findOne({ where: { userId: req.body.userId } });
    if (userData) {
      await MenuItem.create({
        menuID: req.body.menuID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        calories: req.body.calories,
        category: req.body.category,
        //image: image_filename
      });
      res.json({ success: true, message: "MenuItem Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all menuItems
const listMenuItem = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.json({ success: true, data: menuItems });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove menuItem item
const removeMenuItem = async (req, res) => {
  try {
    let userData = await User.findOne({ where: { id: req.body.userId } });
    if (userData && userData.role === "admin") {
      const menuItem = await MenuItem.findOne({ where: { id: req.body.id } });
      fs.unlink(`uploads/${menuItem.image}`, () => {});
      await menuItem.destroy();
      res.json({ success: true, message: "MenuItem Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({ attributes: ['menuItemId', 'menuID', 'name', 'description', 'price', 'category', 'calories'] });
        const formattedMenuItems = menuItems.map(item => ({
            _id: item.menuItemId.toString(), 
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            image: `menuItem_${item.menuItemId}.png`,
            category: item.category,
            calories: item.calories,
        }));
        res.json({ success: true, data: formattedMenuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const editMenuItem = async (req, res) => {
  try {
    let userData = await Admin.findOne({ where: { userId: req.body.userId } });
    if (userData) {
      const menuItem = await MenuItem.findOne({ where: { menuItemId: req.body.menuItemId } });
      if (menuItem) {
        const response = await MenuItem.update(
          {
            menuID: req.body.menuId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            calories: req.body.calories,
            category: req.body.category,
            //image: `${req.file.filename}`
          },
          { where: { menuItemId: req.body.menuItemId } }
        );
        res.json({ success: true, message: "MenuItem Updated" });
      } else {
        res.json({ success: false, message: "MenuItem not found" });
      }
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addMenuItem, listMenuItem, listMenuItems, removeMenuItem, editMenuItem };
    
