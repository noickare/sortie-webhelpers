'use client';

import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import styles from './page.module.css'

const initialOptions = {
  "client-id": "AVhWd9GpWHc_HQpT5eZAwLxf-wg7KrfqBjoFLYmBQOCMRljaYBJ-j7G0W06aa4rMEE56ajsIh7e4gNoR",
  "enable-funding": "venmo",
  currency: "USD",
  intent: "capture",
  // "data-client-token": "AVhWd9GpWHc_HQpT5eZAwLxf-wg7KrfqBjoFLYmBQOCMRljaYBJ-j7G0W06aa4rMEE56ajsIh7e4gNoR",
};

export default function Home() {

  async function _onApprove(data: OnApproveData, actions: OnApproveActions) {
    let order = await actions.order?.capture();
    console.log(order);
    return order;
  }

  function _createOrder(data: CreateOrderData, actions: CreateOrderActions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "1",
          },
        },
      ],
    });
  }

  function _onError(err: Record<string, unknown>) {
    console.log(err);
  }

  return (
      <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    }}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          className="paypal-btn-wrapper"
          createOrder={_createOrder}
          // @ts-ignore
          onApprove={_onApprove}
          onError={(err) => _onError(err)}
          style={{ layout: "vertical" }}
        />
      </PayPalScriptProvider>
    </div>
  )
}
