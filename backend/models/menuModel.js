import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Menu = sequelize.define('Menu', {
  menuId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'menu',
  timestamps: false
});

export default Menu;