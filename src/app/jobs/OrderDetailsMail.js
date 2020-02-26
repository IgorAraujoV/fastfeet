import Mail from '../../lib/Mail';

class OrderDetailsMail {
  get key() {
    return 'OrderDetailsMail';
  }

  async handle(data) {
    await Mail.sendMail({
      to: `${data.name} <${data.email}>`,
      subject: 'Nova entrega',
      template: 'orderDetails',
      context: {
        deliveryMan: `${data.name}`,
        product: `${data.product}`,
      },
    });
  }
}

export default new OrderDetailsMail();
