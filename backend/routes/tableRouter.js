import express from 'express';
import { getTable } from '../controllers/tableController.js';
import { addReservation } from '../controllers/tableController.js';
import { updateTableState } from '../controllers/tableController.js';
import { getReservation } from '../controllers/tableController.js';

const tableRouter = express.Router();

tableRouter.get('/getTable', getTable);
tableRouter.post('/addReservation', addReservation);
tableRouter.post('/updateTableState', updateTableState);
tableRouter.get('/getReservation', getReservation);

export default tableRouter;