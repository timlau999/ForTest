import tablesModel from '../models/tablesModel.js';
import reservationModel from '../models/reservationModel.js';
import { response } from 'express';

const getTable = async (req, res) => {
    try {
        const getTables = await tablesModel.findAll();
        res.json({ success: true, data: getTables });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const getReservation = async (req, res) => {
    try {
        const getReservation = await reservationModel.findAll();
        res.json({ success: true, data: getReservation });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const addReservation = async (req, res) => {
    const {userId, tableId} = req.body;
    try {
        const existingReservation = await tablesModel.findOne({
            where: {tableId: tableId, tablestates: 'reserved'},
        });
            if (existingReservation) {
                return res.json({ success: false, message: 'Table is already reserved' });
            }
            else{
                const newReservation = await reservationModel.create({
                userId: userId,
                tableId: tableId,
                });
                res.json({ success: true, data: newReservation });
            }
        }catch (error) {
        console.error('Error adding reservation:', error);
        res.json({ success: false, message: 'Server error' });
    }
} 


const updateTableState = async (req, res) => {
    const { tableId, state } = req.body;
    try {
        const updatedTable = await tablesModel.update(
            { tablestates: state },
            { where: { tableId: tableId } }
        );
        res.json({ success: true, data: updatedTable });
    } catch (error) {
        console.error('Error updating table state:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

export {getTable, addReservation, updateTableState, getReservation};