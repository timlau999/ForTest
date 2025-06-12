import express from 'express';
import { getTable } from '../controllers/tableController.js';
import { addReservation } from '../controllers/tableController.js';
import { updateTableState } from '../controllers/tableController.js';
import { getReservationA } from '../controllers/tableController.js';
import { getReservationF } from '../controllers/tableController.js';
import { updateReservation } from '../controllers/tableController.js';

const tableRouter = express.Router();

tableRouter.get('/getTable', getTable);
tableRouter.post('/addReservation', addReservation);
tableRouter.post('/updateTableState', updateTableState);
tableRouter.post('/getReservationA', getReservationA);
tableRouter.post('/getReservationF', getReservationF);
tableRouter.post('/updateReservation', updateReservation);

export default tableRouter;