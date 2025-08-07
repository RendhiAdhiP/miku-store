'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: 'CASCADE'
      })

      Order.belongsTo(models.Produk, {
        foreignKey: "produkId",
        onDelete: 'CASCADE'
      })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    produkId: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    total_bayar: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};