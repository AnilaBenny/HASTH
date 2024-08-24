import Razorpay from "razorpay";
import { Request, Response } from "express";
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
        }
    if(req.body.paymentMethod==='PayPal'){

    }
    }
    return createOrder
}
}



