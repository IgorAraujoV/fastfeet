import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'deliveryman',
      }
    );
  }

  static associate(models) {
    return this.belongsTo(models.File, {
      as: 'avatar',
      foreignKey: 'avatar_id',
    });
  }
}

export default DeliveryMan;
