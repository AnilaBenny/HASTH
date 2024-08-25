import Razorpay from "razorpay";
import PayPal from "@paypal/checkout-server-sdk";
import { Request, Response } from "express";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PrKKwJKak3nsLbf28dJe2rOHBYP07QlA267aq5anAaRutaXq5W9jWtf4LK8wzhz6zr3I2b0vW2mNfTFYg2H3lhq00Li1GnTIf');
export default()=>{
  
     const createOrder = async (req: Request, res: Response) => {
      if(req.body.paymentMethod==='Razorpay'){
        const razorpayInstance = new Razorpay({
          key_id: 'rzp_test_2sQVid1X3uLewM',
          key_secret: '9O1FvD9eQj4ZmHMAP4ygy0fO',
        });
      
        try {
          const { amount, currency, receipt } = req.body;
      
          const options = {
            amount: amount * 100, 
            currency: currency,
            receipt: receipt,
          };
      
          const order = await razorpayInstance.orders.create(options);
          res.json(order);
        } catch (error) {
          res.status(500).json({ error: error });
        }}
        else if(req.body.paymentMethod==='PayPal'){
     
      
      const clientId = 'AZaAdOu9K91RGsPoKX1O6SKANymTXoPu7pTTjpcTkKJGAuyn8t1ou8hLwwhW9OpZxA5uXNzTm0SYGOUF';
      const clientSecret = 'EG-U-ZJC1ra6BYoWju8spbtVpfktsDr1_QHbcA5VaJjepjvqn-CzuCGzn98shVrDB9RnAS1JL_SsTyOK';
  
      const environment = new PayPal.core.SandboxEnvironment(clientId, clientSecret);
      const client = new PayPal.core.PayPalHttpClient(environment);
  
      const request = new PayPal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: '100',
          }
        }],
      });
  
      try {
        const order = await client.execute(request);
        res.json(order.result);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else if (req.body.paymentMethod === 'Stripe') {
      const { amount, currency, paymentMethodId } = req.body;
    
      try {
        if (!amount || !currency || !paymentMethodId) {
          return res.status(400).json({ error: 'Missing required parameters' });
        }
    
        const amountInCents = Math.round(parseFloat(amount));
    
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: currency.toLowerCase(),
          payment_method: paymentMethodId,
          confirm: true,
        });
    
        return res.json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        });
      } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        return res.status(500).json({
          error: 'An error occurred while processing your payment',
          details: error.message
        });
      }
    }
}
return createOrder
}



