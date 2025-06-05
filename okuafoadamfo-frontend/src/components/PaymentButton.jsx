import React from 'react';

const PaymentButton = () => {
    const handlePayment = () => {
        // Logic to initiate payment process
        console.log("Payment process initiated");
        // Here you would typically integrate with a payment gateway
    };

    return (
        <button onClick={handlePayment} className="payment-button">
            Pay to Integrate API
        </button>
    );
};

export default PaymentButton;