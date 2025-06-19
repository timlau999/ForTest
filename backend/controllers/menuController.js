import Menu from '../models/menuModel.js';

export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json({ success: true, data: menus });
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching menus",
      error: error.message 
    });
  }
};
