// /MyFYP_HD/backend/config/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('fyp-db', 'admin1', 'FYPdb2025', {
  host: 'hhh-fyp2025.mysql.database.azure.com',
  dialect: 'mysql',
  timezone: '+08:00',
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
