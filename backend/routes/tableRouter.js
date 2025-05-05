import express from 'express';
import { getTable } from '../controllers/tableController.js';

const tableRouter = express.Router();

tableRouter.get('/getTable', getTable);


export default tableRouter;