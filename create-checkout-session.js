const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        const { price, product } = JSON.parse(event.body);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: product },
                    unit_amount: parseInt(price),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://snapspark.netlify.app/success', // Update with your deployed success page URL
            cancel_url: 'https://snapspark.netlify.app/cancel',   // Update with your deployed cancel page URL
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};