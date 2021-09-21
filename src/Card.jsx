import { withRouter } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Card = () => {
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit");

    if (!stripe || !elements) {
      console.log("Stripe.js aun no se ha cargado!");
      return;
    }

    const { error: backendError, clientSecret } = await fetch(
      "http://localhost:5001/api/v1/checkout/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodType: "card",
          currency: "eur",
        }),
      }
    ).then((res) => res.json());

    if (backendError) {
      console.log(backendError.message);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Jhon Dow",
          },
        },
      });

    if (stripeError) {
      console.log(stripeError.message);
      return;
    }

    console.log(`Pago ${paymentIntent.status}: ${paymentIntent.id}`);
  };
  return (
    <>
      <h1>Card</h1>

      <div>
        <h4>
          Try a{" "}
          <a
            href="https://stripe.com/docs/testing#cards"
            target="_blank"
            rel="noopener noreferrer"
          >
            test card
          </a>
          :
        </h4>
        <div>
          <code>4242424242424242</code> (Visa)
        </div>
        <div>
          <code>5555555555554444</code> (Mastercard)
        </div>
        <div>
          <code>4000002500003155</code> (Requires{" "}
          <a
            href="https://www.youtube.com/watch?v=2kc-FjU2-mY"
            target="_blank"
            rel="noopener noreferrer"
          >
            3DSecure
          </a>
          )
        </div>
      </div>

      <form id="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="card">Card</label>
        <CardElement id="card" />

        <button type="submit">Pay</button>
      </form>

      <p>
        {" "}
        <a href="https://youtu.be/IhvtIbfDZJI" target="_blank">
          Watch a demo walkthrough
        </a>{" "}
      </p>
    </>
  );
};

export default Card;
