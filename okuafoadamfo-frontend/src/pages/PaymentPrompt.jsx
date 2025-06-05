import React from 'react';
import PaymentButton from '../components/PaymentButton';

const PaymentPrompt = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Payment Required</h1>
            <p>To integrate our API, a payment is required. Please click the button below to proceed with the payment.</p>
            <PaymentButton />
        </div>
    );
};

export default PaymentPrompt;