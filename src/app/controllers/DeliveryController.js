import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

const MAX_ORDERS_PER_DAY = 5;

class DeliveryController {
  async store(req, res) {
    const order = await Order.findByPk(req.params.id);

    const countOrders = await Order.count({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (countOrders > MAX_ORDERS_PER_DAY)
      return res
        .status(400)
        .json({ error: 'You can only start 5 deliveries per day' });

    if (!order) return res.status(404).json({ error: 'Not found order' });

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'The order was canceled' });
    }

    if (order.end_date !== null) {
      return res
        .status(400)
        .json({ error: 'You can only start delivery not finished' });
    }

    if (order.start_date !== null) {
      return res
        .status(400)
        .json({ error: 'The order has already out for delivery' });
    }

    const startHourAvailable = 8;
    const endHourAvailable = 18;

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (
      !(currentHour >= startHourAvailable && currentHour < endHourAvailable)
    ) {
      return res
        .status(400)
        .json({ error: 'You can only start delivery between 8 and 18h' });
    }

    const newOrder = await order.update({
      start_date: new Date(),
    });

    return res.json(newOrder);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ error: 'Not found order' });

    if (order.start_date === null) {
      return res
        .status(400)
        .json({ error: 'Order has not yet come out for delivery' });
    }

    if (order.end_date !== null) {
      return res.status(400).json({ error: 'Order already finished' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const finishedOrder = await order.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.json(finishedOrder);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        end_date: null,
        canceled_at: null,
        deliveryman_id: req.params.id,
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: DeliveryMan,
          as: 'delivery',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new DeliveryController();
