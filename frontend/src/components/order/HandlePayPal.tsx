import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from '../../Axiosconfig/Axiosconfig';

const HandlePayPal = ({ cart }) => {
  const [message, setMessage] = useState("");

  const initialOptions = {
    "client-id": "AZaAdOu9K91RGsPoKX1O6SKANymTXoPu7pTTjpcTkKJGAuyn8t1ou8hLwwhW9OpZxA5uXNzTm0SYGOUF",
    "enable-funding": "venmo",
    "disable-funding": "",
    currency: "USD",
    components: "buttons",
    "data-page-type": "product-details",
    "data-sdk-integration-source": "developer-studio",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const response = await axiosInstance.post("/api/auth/order/createOnlineOrder", { paymentMethod: 'PayPal', cart });
            console.log(response,'....paypal');
            
            if (response.status && response.data && response.data.id) {
              return response.data.id;
            } else {
              const errorDetail = response.data?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${response.data.debug_id})`
                : JSON.stringify(response.data);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
            throw error;
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await axiosInstance.post(`/api/auth/order`, { cart, paymentMethod: 'PayPal' });
            const orderData = response.data;

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              return actions.restart();
            } else if (errorDetail) {
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else {
              const transaction = orderData.purchase_units[0].payments.captures[0];
              setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`);
              console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
            }
          } catch (error) {
            console.error(error);
            setMessage(`Sorry, your transaction could not be processed...${error}`);
          }
        }}
      />
      {message && <div>{message}</div>}
    </PayPalScriptProvider>
  );
};

export default HandlePayPal;
