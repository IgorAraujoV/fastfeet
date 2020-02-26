import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import File from '../app/models/File';
import DeliveryMan from '../app/models/DeliveryMan';
import Order from '../app/models/Order';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import OrderProblems from '../app/models/OrderProblems';

const models = [User, Recipient, File, DeliveryMan, Order, OrderProblems];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // eslint-disable-next-line array-callback-return
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
