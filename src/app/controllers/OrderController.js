import OrderDetailsMail from '../jobs/OrderDetailsMail';
import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';
import OrderProblems from '../models/OrderProblems';

class OrderController {
  async store(req, res) {
    const { product, deliveryman_id, recipient_id } = req.body;

    const delivery = await DeliveryMan.findByPk(deliveryman_id);

    const order = await Order.create({ product, deliveryman_id, recipient_id });

    if (!order) {
      return res.status(400).json({ error: 'Error creating order' });
    }

    OrderDetailsMail.handle({
      name: delivery.name,
      email: delivery.email,
      product,
    });

    return res.json(order);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: OrderProblems,
          as: 'problems',
          attributes: ['id', 'description'],
        },
      ],
    });

    const filteredOrders = orders.filter(order => {
      return Array.isArray(order.problems) && order.problems.length;
    });

    return res.json(filteredOrders);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ error: 'Not found order' });

    await order.destroy();

    return res.status(201).json({ Message: 'Deleted sucessfully' });
  }
}

export default new OrderController();
