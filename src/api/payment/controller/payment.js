const stripe = require("stripe")("sk_test_51MmF5HEZbX6Zpxv9cu17vK5ZbcYrLIWRB9F1beqlT5vYTzIxjJSN5vsTugGzAX4YOxYvfb2qluByAeAf1MTsWPoS00nvBF8VEJ");
const YOUR_DOMAIN = 'http://localhost:1337';
module.exports = {
  createPaymentIntent: async (ctx) => {
    const { amount, currency } = ctx.request.body;
    
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency, 
      automatic_payment_methods: {enabled: true}
      // Set other PaymentIntent options, e.g., description, etc.
    });
    
    
    // Return the PaymentIntent client secret to the client
    ctx.send({ client_secret: paymentIntent.client_secret, transactionId: paymentIntent.id });
  },

  retrievePaymentIntent: async (ctx) => {
    console.log("entre aqui");
    const { paymentIntentId } = ctx.params;
    console.log("this is "+ paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(paymentIntent)
    ctx.send(paymentIntent);
  },

  async createSubscription(ctx) {
    const { customerId, paymentMethodId, priceId } = ctx.request.body;

    // Create/update customer in Stripe
    const customer = await stripe.customers.update(customerId, {
      payment_method: paymentMethodId,
    });

    // Create/update subscription in Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription details to your database
    // ... (you can use Strapi's built-in models to store the subscription data)
    
    // Return subscription details to the frontend
    return subscription;
  },

  async createUser(ctx){
    const {email, name , description} = ctx.request.body;

    const customer = await stripe.customers.create({
      email: email,
      name: name,
      description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
    });

    return customer
  }
};