"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = () => {
  let router=useRouter()
  let auth=useAuth().isLoaded

  useEffect(() => {
    if (auth === false) {
      router.push("/info");
    }
  });

  let {toast}=useToast()

  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  let [plan, setplan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(plan);
    setLoading(true);

    let plans="free";
    switch (plan) {
      case "price_1Q92qA1PkHDkxKBdy5p2xtb6":
        plans="free"
        break;
      case "price_1Q8i6u1PkHDkxKBdq97wu0yB":
        plans="basic"
        break;
      case "price_1Q8i8y1PkHDkxKBdaczoHWYG":
        plans="standard"
        break;
      case "price_1Q8i9R1PkHDkxKBdXvjozIiz":
        plans="pro"
        break;
    }

    const cardElement = elements.getElement(CardElement);

    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email,
      },
    });

    if (paymentMethodReq.error) {
      setError(paymentMethodReq.error.message);
      setLoading(false);
      return;
    }

    const { paymentMethod } = paymentMethodReq;

    const res = await fetch("/api/payment-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        paymentMethodId: paymentMethod.id,
        priceId: plan,
        plans
      }),
    });

    const subscription = await res.json();

    setLoading(false);

    if (subscription.error) {
      setError(subscription.error);
    } else {
      if(subscription.status === "active"){
        toast({
          title:"payment successful",
        });
        router.push("/")
      }
    }
  };

  return (
    <div className="bg-white h-screen w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" m-auto flex flex-col gap-10 border border-black  p-4 rounded-lg w-1/3"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          className=" h-10 rounded-sm p-2 font-semibold outline outline-black text-xl"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <CardElement />
        <label className="flex flex-col gap-3 font-medium">
          Choose your plan
          <span className="flex gap-2">
            <label>
              <input
                type="radio"
                name="subscription"
                value="price_1Q92qA1PkHDkxKBdy5p2xtb6"
                required
                onChange={(e) => setplan(e.target.value)}
              />{" "}
              free
            </label>
            <label>
              <input
                type="radio"
                name="subscription"
                value="price_1Q8i6u1PkHDkxKBdq97wu0yB"
                required
                onChange={(e) => setplan(e.target.value)}
              />{" "}
              Basic
            </label>
            <label>
              <input
                type="radio"
                name="subscription"
                value="price_1Q8i8y1PkHDkxKBdaczoHWYG"
                required
                onChange={(e) => setplan(e.target.value)}
              />{" "}
              Standard
            </label>
            <label>
              <input
                type="radio"
                name="subscription"
                value="price_1Q8i9R1PkHDkxKBdXvjozIiz"
                required
                onChange={(e) => setplan(e.target.value)}
              />{" "}
              Pro
            </label>
          </span>
        </label>
        <button
          disabled={!stripe || loading}
          className="bg-black text-white font-bold text-base hover:bg-white hover:text-black hover:outline-1 hover:outline-black p-2 rounded-lg"
        >
          {loading ? "Processing..." : "purches"}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

const StripeSubscription = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeSubscription;
