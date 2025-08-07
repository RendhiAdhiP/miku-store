'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Produk.hasMany(models.Order, {
        foreignKey: "produkId",
        onDelete: 'CASCADE'
      })
    }
  }
  Produk.init({
    nama_produk: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Produk',
  });
  return Produk;
};