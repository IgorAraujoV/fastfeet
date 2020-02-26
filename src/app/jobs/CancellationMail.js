import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle(data) {
    await Mail.sendMail({
      to: `${data.name} <${data.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        deliveryMan: `${data.name}`,
        problem: `${data.problem}`,
        product: `${data.product}`,
      },
    });
  }
}

export default new CancellationMail();
