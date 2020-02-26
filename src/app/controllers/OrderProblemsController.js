import Order from '../models/Order';
import OrderProblems from '../models/OrderProblems';
import DeliveryMan from '../models/DeliveryMan';
import CancellationMail from '../jobs/CancellationMail';

class OrderProblemsController {
  async index(req, res) {
    const orders = await OrderProblems.findAll({
      where: {
        order_id: req.params.id,
      },
      attributes: ['id', 'description'],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const { id, description } = await OrderProblems.create({
      description: req.body.description,
      order_id: req.params.id,
    });

    return res.json({ id, description });
  }

  async delete(req, res) {
    const problem = await OrderProblems.findByPk(req.params.id);

    const order = await Order.findByPk(problem.order_id, {
      include: [
        {
          model: DeliveryMan,
          as: 'delivery',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order has already canceled' });
    }

    const updatedOrder = await order.update({ canceled_at: new Date() });

    CancellationMail.handle({
      name: order.delivery.name,
      email: order.delivery.email,
      product: order.product,
      problem: problem.description,
    });

    return res.json(updatedOrder);
  }
}

export default new OrderProblemsController();
