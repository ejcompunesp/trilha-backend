const { Model, DataTypes } = require('sequelize');
const CategoriesEnum = require('../config/categories');

class Product extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      price: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      image_uri: DataTypes.STRING,
      discount: DataTypes.FLOAT,
      category: DataTypes.ENUM(Object.values(CategoriesEnum)),
      created_at: DataTypes.DATE
    }, {
      sequelize: connection
    });
  }

  static associate(models) {
    this.belongsTo(models.Brand, { foreignKey: 'id_brand', as: 'brand' });
  }
}

module.exports = Product;