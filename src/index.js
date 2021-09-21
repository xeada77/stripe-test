import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

document.addEventListener("DOMContentLoaded", async () => {
  const { publicKey } = await fetch(
    "http://localhost:5001/api/v1/config/"
  ).then((r) => r.json());
  console.log(publicKey);
  const stripePromise = loadStripe(publicKey);

  ReactDOM.render(
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
