import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import Customer from '../models/customerModel.js';

const placeOrder = async (req, res) => {
    try {
        const { customerId, items, amount, pointsToUse } = req.body;

        // 检查 customerId 是否存在
        const customer = await Customer.findOne({ where: { customerId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }

        // 创建订单
        const newOrder = await Order.create({
            customerId,
            orderDate: new Date(),
            orderStatus: 'MenuItem Processing',
            totalAmount: amount,
            paymentStatus: 'Pending'
        });

        // 创建订单商品
        for (const item of items) {
            await OrderItem.create({
                orderId: newOrder.orderId,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });
        }

        res.json({ success: true, message: 'Order placed successfully', orderId: newOrder.orderId });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error placing order' });
    }
};

export { placeOrder };