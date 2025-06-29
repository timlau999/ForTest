// /MyFYP_HD/backend/config/db.js
import { Sequelize } from 'sequelize';
/*
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
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
*/
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

// for local test

/*const sequelize = new Sequelize('fypdb1', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3307,
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
*/

export default sequelize; 
