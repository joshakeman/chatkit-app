import React, { Fragment } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
const stripeBtn = (props) => {
  const publishableKey = "pk_test_VkzyTq4kOLBjTGK6gYYeLkO3";
   
  const onToken = token => {
    const body = {
      amount: 999,
      token: token
  };
  axios
      .post("https://delphe-backend.herokuapp.com/payment", body)
      .then(response => {
        console.log(response);
        // alert("Payment Success");
        props.authorize()
      })
      .catch(error => {
        console.log("Payment Error: ", error);
        alert("Payment Error");
      });
  };
  return (
    <StripeCheckout
      label="Pay with Stripe" //Component button text
      name="Delphe" //Modal Header
      description="Start your 1 hour expert session"
      panelLabel="Confirm payment" //Submit button in modal
      amount={999} //Amount in cents $9.99
      token={onToken}
      stripeKey={publishableKey}
      // image="https://www.vidhub.co" //Pop-in header image
      billingAddress={false}
    />
  );
};
export default stripeBtn;