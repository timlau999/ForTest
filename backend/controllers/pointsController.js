// ForTest/backend/controllers/pointsController.js
import CustomerPoints from '../models/customerPointsModel.js';
import CustomerPointsUsage from '../models/customerPointsUsageModel.js';
import Order from '../models/orderModel.js';
import sequelize from '../config/db.js';

const getUserPoints = async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const pointsData = await CustomerPoints.findOne({
            where: { customerId }
        });
        if (pointsData) {
            res.json({ success: true, points: pointsData.points });
        } else {
            res.json({ success: false, message: 'No points data found for this customer' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error fetching points data' });
    }
};

const usePoints = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { customerId, pointsToUse, orderId } = req.body;
        const pointsData = await CustomerPoints.findOne({
            where: { customerId },
            transaction: t
        });
        if (!pointsData) {
            throw new Error('No points data found for this customer');
        }
        if (pointsData.points < pointsToUse) {
            throw new Error('Insufficient points');
        }

        const newPoints = pointsData.points - pointsToUse;
        await pointsData.update({ points: newPoints }, { transaction: t });

        await CustomerPointsUsage.create({
            orderId,
            pointsId: pointsData.id, // 假设模型中有 id 字段代表主键
            usageDate: new Date()
        }, { transaction: t });

        const order = await Order.findOne({
            where: { orderId },
            transaction: t
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const newTotalAmount = order.amount - (pointsToUse / 10); // 注意这里使用的是 amount 字段，因为 Order 模型中定义的是 amount
        await order.update({ amount: newTotalAmount }, { transaction: t });

        await t.commit();
        res.json({ success: true, message: 'Points used successfully' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { getUserPoints, usePoints };