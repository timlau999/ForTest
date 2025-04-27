import MenuItem from '../models/menuItemModel.js';

const listMenuItems = async (req, res) => {
    try {
        // 明确指定需要查询的字段，确保包含 menuItemId
        const menuItems = await MenuItem.findAll({ attributes: ['menuItemId', 'menuID', 'name', 'description', 'price', 'category'] });
        const formattedMenuItems = menuItems.map(item => ({
            _id: item.menuItemId.toString(), // 转为字符串（避免类型问题）
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            image: `food_${item.menuItemId}.png`, // 确保 image 路径正确
            category: item.category
        }));
        res.json({ success: true, data: formattedMenuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { listMenuItems };