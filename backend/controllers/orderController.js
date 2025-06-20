// ForTest/backend/controllers/orderController.js
import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import Customer from '../models/customerModel.js';
import MenuItem from '../models/menuItemModel.js';
import Payment from '../models/paymentModel.js';
import CustomerPoints from '../models/customerPointsModel.js';
import CustomerPointsUsage from '../models/customerPointsUsageModel.js';
import Review from '../models/reviewModel.js';

const placeOrder = async (req, res) => {
    try {
        const { customerId, items, amount, pointsToUse, paymentMethodId } = req.body;

        const customer = await Customer.findOne({ where: { customerId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }

        const lastOrder = await Order.findOne({
            where: { customerId },
            attributes: ['orderId'],
            order: [['orderId', 'DESC']]
        });

        let nextSequence = 1;
        if (lastOrder) {
            const lastOrderId = lastOrder.orderId;
            console.log('lastOrderId:', lastOrderId, 'type:', typeof lastOrderId);

            const lastOrderIdStr = String(lastOrderId);
            const lastSequence = parseInt(lastOrderIdStr.slice(-5), 10);
            nextSequence = lastSequence + 1;

            if (nextSequence > 99999) {
                return res.json({ success: false, message: 'Order sequence limit reached for this customer' });
            }
        }

        const sequenceStr = nextSequence.toString().padStart(5, '0');
        const orderId = `${customerId}${sequenceStr}`;
        console.log('Generated orderId:', orderId, 'type:', typeof orderId);

        const newOrder = await Order.create({
            orderId,
            customerId,
            orderDate: new Date(),
            orderStatus: 'MenuItem Processing',
            totalAmount: amount,
            paymentStatus: 'Pending'
        });

        console.log('New order created:', newOrder.toJSON());

        for (const item of items) {
            const orderItemId = `${orderId}${item.menuItemId}`;

            await OrderItem.create({
                orderItemId,
                orderId,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });
        }

        if (paymentMethodId!== 1) { 
            await newOrder.update({ paymentStatus: 'Paid' });
            await Payment.create({
                paymentId: orderId, 
                orderId,
                paymentMethodId,
                paymentDate: new Date()
            });
        }

        if (pointsToUse > 0) {
            let pointsRecord = await CustomerPoints.findOne({
                where: { customerId }
            });

            if (!pointsRecord) {
                pointsRecord = await CustomerPoints.create({
                    customerId,
                    points: 0
                });
            }

            if (pointsRecord.points < pointsToUse) {
                return res.json({ success: false, message: 'Insufficient points' });
            }

            // Get the last usage record for the pointsId
            const lastUsage = await CustomerPointsUsage.findOne({
                where: { pointsId: pointsRecord.pointsId },
                attributes: ['usageId'],
                order: [['usageId', 'DESC']]
            });

            let usageSequence = 1;
            if (lastUsage) {
                const lastUsageId = lastUsage.usageId;
                const lastUsageSequence = parseInt(lastUsageId.toString().slice(String(pointsRecord.pointsId).length), 10);
                usageSequence = lastUsageSequence + 1;
            }

            const usageId = `${pointsRecord.pointsId}${usageSequence}`;

            await CustomerPointsUsage.create({
                usageId,
                orderId,
                pointsId: pointsRecord.pointsId,
                usageDate: new Date(),
                usedPoints: pointsToUse
            });

            pointsRecord.points -= pointsToUse;
            await pointsRecord.save();
        }

        const newPoints = Math.floor(amount / 10);
        let pointsRecord = await CustomerPoints.findOne({
            where: { customerId }
        });

        if (!pointsRecord) {
            pointsRecord = await CustomerPoints.create({
                customerId,
                points: newPoints
            });
        } else {
            pointsRecord.points += newPoints;
            await pointsRecord.save();
        }

        res.json({ success: true, message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error('Error in placeOrder:', error);
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
                },
                {
                    model: CustomerPointsUsage,
                    attributes: ['usedPoints']
                }
            ]
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
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
                },
                {
                    model: CustomerPointsUsage,
                    attributes: ['usedPoints']
                }
            ]
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching all orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.query;
        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        await order.update({ orderStatus: status });
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error updating order status' });
    }
};

const addReview = async (req, res) => {
    try {
        const { customerId, orderId, menuItemId, content, rating } = req.body;

        const order = await Order.findOne({
            where: { 
                orderId,
                customerId
            }
        });
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found or does not belong to this customer' });
        }

        if (order.orderStatus !== 'Order Completed') {
            return res.status(400).json({ success: false, message: 'Cannot review incomplete order' });
        }

        const orderItem = await OrderItem.findOne({
            where: {
                orderId,
                menuItemId
            }
        });
        
        if (!orderItem) {
            return res.status(404).json({ success: false, message: 'Order item not found' });
        }

        const existingReview = await Review.findOne({
            where: {
                customerId,
                orderId,
                menuItemId
            }
        });
        
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this item' });
        }
        
        const newReview = await Review.create({
            customerId,
            orderId,
            menuItemId,
            content,
            rating
        });
        
        res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Error in addReview:', error);
        res.status(500).json({ success: false, message: 'Error adding review' });
    }
};


export { placeOrder, getOrdersByCustomerId, getAllOrders, updateOrderStatus, addReview };