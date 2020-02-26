import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.OrderProblems, {
      as: 'problems',
      foreignKey: 'order_id',
    });
    this.belongsTo(models.Recipient, {
      as: 'recipient',
      foreignKey: 'recipient_id',
    });
    this.belongsTo(models.DeliveryMan, {
      as: 'delivery',
      foreignKey: 'deliveryman_id',
    });
    this.belongsTo(models.File, {
      as: 'signature',
      foreignKey: 'signature_id',
    });
  }
}

export default Order;
