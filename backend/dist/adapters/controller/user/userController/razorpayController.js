"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default('sk_test_51PrKKwJKak3nsLbf28dJe2rOHBYP07QlA267aq5anAaRutaXq5W9jWtf4LK8wzhz6zr3I2b0vW2mNfTFYg2H3lhq00Li1GnTIf');
exports.default = () => {
    const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.paymentMethod === 'Razorpay') {
            const razorpayInstance = new razorpay_1.default({
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
                const order = yield razorpayInstance.orders.create(options);
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        }
        else if (req.body.paymentMethod === 'PayPal') {
            const clientId = 'AZaAdOu9K91RGsPoKX1O6SKANymTXoPu7pTTjpcTkKJGAuyn8t1ou8hLwwhW9OpZxA5uXNzTm0SYGOUF';
            const clientSecret = 'EG-U-ZJC1ra6BYoWju8spbtVpfktsDr1_QHbcA5VaJjepjvqn-CzuCGzn98shVrDB9RnAS1JL_SsTyOK';
            const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(clientId, clientSecret);
            const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
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
                const order = yield client.execute(request);
                res.json(order.result);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        }
        else if (req.body.paymentMethod === 'Stripe') {
            const { amount, currency, paymentMethodId, paymentMethod } = req.body;
            try {
                if (!amount || !currency || !paymentMethodId) {
                    return res.status(400).json({ error: 'Missing required parameters' });
                }
                const amountInCents = Math.round(parseFloat(amount) * 100);
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: amountInCents,
                    currency: currency.toLowerCase(),
                    payment_method: paymentMethodId,
                    confirm: true,
                    return_url: 'http://localhost:5173/checkout'
                });
                return res.json({
                    clientSecret: paymentIntent.client_secret,
                    paymentIntent: paymentIntent
                });
            }
            catch (error) {
                console.error('Error creating PaymentIntent:', error);
                return res.status(500).json({
                    error: 'An error occurred while processing your payment',
                    details: error
                });
            }
        }
    });
    return createOrder;
};
