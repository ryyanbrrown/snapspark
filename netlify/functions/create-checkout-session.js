console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        if (!event.body || event.body.trim() === "") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No JSON body provided" }),
            };
        }
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
            success_url: 'https://snapspark.netlify.app/success', // Should match your deployed URL
            cancel_url: 'https://snapspark.netlify.app/cancel',   // Should match your deployed URL
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