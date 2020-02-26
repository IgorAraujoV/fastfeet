import Sequelize, { Model } from 'sequelize';

class OrderProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      as: 'order',
      foreignKey: 'order_id',
    });
  }
}

export default OrderProblems;
