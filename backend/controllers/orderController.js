// ForTest/backend/controllers/orderController.js
import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import Customer from '../models/customerModel.js';
import MenuItem from '../models/menuItemModel.js';

const placeOrder = async (req, res) => {
    try {
        const { customerId, items, amount, pointsToUse } = req.body;

        const customer = await Customer.findOne({ where: { customerId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }

        const newOrder = await Order.create({
            customerId,
            orderDate: new Date(),
            orderStatus: 'MenuItem Processing',
            totalAmount: amount,
            paymentStatus: 'Pending'
        });

        const orderId = newOrder.get('orderId');
        console.log('New order ID:', orderId);

        for (const item of items) {
            await OrderItem.create({
                orderId,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });
        }

        res.json({ success: true, message: 'Order placed successfully', orderId: newOrder.get('orderId') });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error placing order' });
    }
};

const getOrdersByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await Order.findAll({
            where: { customerId },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['name'] 
                        }
                    ]
                }
            ]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

export { placeOrder, getOrdersByCustomerId };