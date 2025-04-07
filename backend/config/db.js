import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('food_order_system', 'root', 'P@ssw0rd', {
  host: '192.168.0.177',
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
