const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      price: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
    }, {
      sequelize: connection
    });
  }

  static associate(models) {
    this.belongsTo(models.Brand, { foreignKey: 'id_brand', as: 'brand' });
  }
}

module.exports = Product;