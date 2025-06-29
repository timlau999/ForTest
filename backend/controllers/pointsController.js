// restaurant_b02/backend/controllers/pointsController.js
import CustomerPoints from '../models/customerPointsModel.js';
import Customer from '../models/customerModel.js';

export const getCustomerPoints = async (req, res) => {
    try {
        const { customerId } = req.params;
        const points = await CustomerPoints.findOne({
            where: { customerId }
        });
        
        if (!points) {
            return res.status(404).json({ success: false, message: 'Points not found' });
        }
        
        res.status(200).json({ success: true, points: points.points });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const usePoints = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { pointsToUse } = req.body;
        
        const pointsRecord = await CustomerPoints.findOne({
            where: { customerId }
        });
        
        if (!pointsRecord) {
            return res.status(404).json({ success: false, message: 'Points not found' });
        }
        
        if (pointsRecord.points < pointsToUse) {
            return res.status(400).json({ success: false, message: 'Insufficient points' });
        }

        pointsRecord.points -= pointsToUse;
        await pointsRecord.save();
        
        res.status(200).json({ success: true, points: pointsRecord.points, pointsId: pointsRecord.pointsId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getPointsA = async (req, res) => {
    try {
        const { userId } = req.body;
        const response = await Customer.findOne({
            where: { userId: userId }
        });
        const responseB = await CustomerPoints.findOne({
            where: { customerId: response.customerId }
        });
        if (!responseB) {
            return res.json({ success: false });
        }
        res.json({ success: true, points: responseB.points });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
};