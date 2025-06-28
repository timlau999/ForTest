import tablesModel from '../models/tablesModel.js';
import reservationModel from '../models/reservationModel.js';
import { response } from 'express';
import {Op, fn, col, where} from 'sequelize';

const getTable = async (req, res) => {
    try {
        const response = await tablesModel.findAll();
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const getReservationA = async (req, res) => {
    const {inputuserId, selectedDate} = req.body;

    try {
        const conditions = {
            [Op.or]: []
        };
        if (inputuserId) {
            conditions[Op.or].push({ userId : inputuserId});
        }
        if (selectedDate) {
            conditions[Op.or].push(
                where(fn('DATE', col('timeslot')), selectedDate)
            );
        }
        if (conditions[Op.or].length === 0) {
            return res.json({ success: false, message: 'Please provide userId or selectedDate.' });
        }

        const response = await reservationModel.findAll({
            where: conditions,
            order: [['timeslot', 'ASC']]
        });

        if (response.length > 0){
            return res.json({ success: true, data: response, message: "Done" });
        }else{
            console.log(conditions);
            if(selectedDate){
                console.log("selectedDate: " + selectedDate);
                console.log("today: " + `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`);
                if(selectedDate == `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`){
                    return res.json({ success: false, message: "No reservation on today" });
                }else{
                    return res.json({ success: false, message: "No reservation on this day" });
                }
            }else{
                return res.json({ success: false, message: "No reservation of this user" });
            }
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const getReservationF = async (req, res) => {
    const {userId, tableId} = req.body;
    try {
            const conditions = {
                [Op.or]: []
            };
            if(userId){
                conditions[Op.or].push({ userId : userId, reservationStatus: 'pending' });
            }
            if(tableId){
                conditions[Op.or].push({ tableId : tableId, timeslot : where(fn('DATE', col('timeslot')), new Date().toLocaleDateString()) });
            }
            if (conditions[Op.or].length === 0) {
            return res.json({ success: false, message: 'Please provide userId or tableId.' });
            }

        const response = await reservationModel.findAll({
            where: conditions
        });
        if (response){
            res.json({ success: true, data: response });
            //console.log(response)
        }else{
            res.json({ success: false, data: response });
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const addReservation = async (req, res) => {
    const {userId, tableId, timeslot} = req.body;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();

    try {
        
        const alreadyReserved = await reservationModel.findOne({
            where: {
                userId: userId,
                reservationStatus: 'pending',
            },
        });

        if (alreadyReserved) {
            return res.json({ success: false, message: 'You already have a pending reservation' });
        }else{
            const existingReservation = await reservationModel.findOne({
            where: {
                tableId: tableId,
                reservationStatus: 'pending', 
                timeslot: `${currentYear}-${currentMonth}-${currentDate} ${timeslot}:00:00`, 
            },
            });
            if (existingReservation) {
            return res.json({ success: false, message: 'Table is already reserved' });
            }else{

                const checktablestates = await tablesModel.findOne({
                    where: {
                        tableId: tableId,
                        tablestates : "available"
                    }
                });
                if (!checktablestates){
                    return res.json({ success: false, message: 'Table is not available' });
                }else{
                    const response = await reservationModel.create({
                        userId: userId,
                        tableId: tableId,
                        timeslot: `${currentYear}-${currentMonth}-${currentDate} ${timeslot}:00:00`,
                    });

                    const io = req.app.get('io');
                    io.emit('reservation_created', response )

                    res.json({ success: true, data: response });
                }
            }
        }

        }catch (error) {
        console.error('Error adding reservation:', error);
        res.json({ success: false, message: 'Server error' });
    }
} 


const updateTableState = async (req, res) => {
    const { tableId, state } = req.body;
    try {
        const response = await tablesModel.update(
            { tablestates: state },
            { where: { tableId: tableId } }
        );
        if (response == 1){
            const io = req.app.get('io');
            io.emit('TableState_updated', response );
            res.json({ success: true, data: response });
        }
    } catch (error) {
        console.error('Error updating table state:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

const updateReservation = async (req, res) =>{
    const {userId, reservationStatus, reservationId} = req.body;
    try{
        const conditions = {
            [Op.or]: []
        };
        if (reservationId) {
            conditions[Op.or].push({ reservationId : reservationId});
        }
        if (userId) {
            conditions[Op.or].push({userId: userId, reservationStatus: 'pending',});
        }
        if (conditions[Op.or].length === 0) {
            return res.json({ success: false, message: 'Please provide information.' });
        }

        const response = await reservationModel.update(
            {reservationStatus: reservationStatus},
            {
                where:conditions
            }
        ); 
        if (response == 1){
            const io = req.app.get('io');
            io.emit('reservation_updated', response )

            res.json({ success: true, data: response });
        }else{
            res.json({ success: false, message: "You have no reservation to cancel" });
        }
    }
    catch (error) {
        console.error('Error cancel reservation:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

export {getTable, addReservation, updateTableState, getReservationA, getReservationF, updateReservation};