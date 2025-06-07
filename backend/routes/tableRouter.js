import express from 'express';
import { getTable } from '../controllers/tableController.js';
import { addReservation } from '../controllers/tableController.js';
import { updateTableState } from '../controllers/tableController.js';
import { getReservationA } from '../controllers/tableController.js';
import { getReservationF } from '../controllers/tableController.js';
import { removeReservationF } from '../controllers/tableController.js';

const tableRouter = express.Router();

tableRouter.get('/getTable', getTable);
tableRouter.post('/addReservation', addReservation);
tableRouter.post('/updateTableState', updateTableState);
tableRouter.post('/getReservationA', getReservationA);
tableRouter.post('/getReservationF', getReservationF);
tableRouter.post('/removeReservationF', removeReservationF);

export default tableRouter;