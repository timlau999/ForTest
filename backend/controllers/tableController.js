import tablesModel from '../models/tablesModel.js';
import reservationModel from '../models/reservationModel.js';

const getTable = async (req, res) => {
    try {
        const getTables = await tablesModel.findAll();
        res.json({ success: true, data: getTables });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

export {getTable};