"use server"
import { User } from '@/scema/user';
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {

  try {
    const { email, paymentMethodId, priceId, plans } = await req.json();

    // Create a new customer
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    // Get the current date
    const currentDate = new Date();

    // Set the number of days to add (e.g., 30 days for expiration)
    const daysToAdd = 30;

    // Create the expiration date by adding days
    const expirationDate = new Date(currentDate);
    expirationDate.setDate(currentDate.getDate() + daysToAdd);

    let date = currentDate.toDateString();
    let expiredatecreate = expirationDate.toDateString();  

    if (subscription.status == "active") {
      let update = await User.findOneAndUpdate({ userid: auth().userId }, { subcreption: plans, expiredate: expiredatecreate, date: date, subcreptionID: subscription.id, customerID: customer.id })
    }

    return NextResponse.json({ status: subscription.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
  }
}
