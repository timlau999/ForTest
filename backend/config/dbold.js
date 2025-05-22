// /MyFYP_HD/backend/config/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('fyp-db', 'systemgp24', 'Active@caseRA1', {
  host: 'itp4915m22gp24.mysql.database.azure.com',
  dialect: 'mysql'
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize; 
