'use client';

import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import { useSearchParams } from 'next/navigation';

const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    "enable-funding": "venmo",
    currency: "USD",
    intent: "capture",
    // "data-client-token": "AVhWd9GpWHc_HQpT5eZAwLxf-wg7KrfqBjoFLYmBQOCMRljaYBJ-j7G0W06aa4rMEE56ajsIh7e4gNoR",
};

const Paypal = () => {
    const searchParams = useSearchParams();
    const params = searchParams.get('amount');
    const amount = params && parseFloat(params)

    async function _onApprove(data: OnApproveData, actions: OnApproveActions) {
        let order = await actions.order?.capture();
        console.log(order);
        // @ts-ignore
        window.ReactNativeWebView &&
            // @ts-ignore
            window.ReactNativeWebView.postMessage(JSON.stringify(order));
        return order;
    }

    function _createOrder(data: CreateOrderData, actions: CreateOrderActions, amount: string) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                    },
                },
            ],
        });
    }

    function _onError(err: Record<string, unknown>) {
        let errObj = {
            err: err,
            status: "FAILED",
        };
        // @ts-ignore
        window.ReactNativeWebView &&
            // @ts-ignore
            window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
        console.log(err);
    }
    if (!amount) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h1 style={{
                    color: 'white'
                }}>Oops this page is not here</h1>
            </div>
        )
    } else {
        console.log({ amount })
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
                        createOrder={(data, actions) => _createOrder(data, actions, amount.toFixed(2))}
                        // @ts-ignore
                        onApprove={_onApprove}
                        onError={(err) => _onError(err)}
                        style={{ layout: "vertical" }}
                    />
                </PayPalScriptProvider>
            </div>
        )
    }
}

export default Paypal