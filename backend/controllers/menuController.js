import Menu from '../models/menuModel.js';

export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json({ success: true, data: menus });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching menus" });
  }
};
