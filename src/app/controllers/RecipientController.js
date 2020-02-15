import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip,
    } = await Recipient.create(req.body);

    return res.json({ name, street, number, complement, state, city, zip });
  }
}

export default new RecipientController();
