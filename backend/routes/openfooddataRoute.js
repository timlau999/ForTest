import express from 'express';
import { getOpenFoodData} from '../controllers/openfooddataController.js';
import { getOpenFoodDetail } from '../controllers/openfooddataController.js';

const openfooddataRouter = express.Router();

openfooddataRouter.post('/getOpenFoodData', getOpenFoodData);
openfooddataRouter.post('/getOpenFoodDetail', getOpenFoodDetail);

export default openfooddataRouter;

