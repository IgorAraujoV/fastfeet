import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    const deliveryMan = await DeliveryMan.create(req.body);

    if (!deliveryMan)
      return res.status(400).json({ error: 'Error creating delivery man' });

    const { id, name, email } = deliveryMan;
    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const deliveryMans = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryMans);
  }

  async update(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan)
      return res
        .status(404)
        .json({ error: 'Not found delivery man with this id' });

    const { name, email } = req.body;
    if (name && name === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    if (email && email === '') {
      return res.status(400).json({ error: 'Email cannot be empty' });
    }

    const delivery = await deliveryMan.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res) {
    const delivery = await DeliveryMan.findByPk(req.params.id);

    if (!delivery)
      return res.status(404).json({ error: 'Not found delivery man' });

    await delivery.destroy();

    return res.status(201).json({ Message: 'Deleted sucessfully' });
  }
}

export default new DeliveryManController();
