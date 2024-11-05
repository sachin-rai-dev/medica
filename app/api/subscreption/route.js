import { conect } from "@/functions/db";
import { User } from "@/scema/user";
import { NextResponse } from "next/server";
import Stripe from 'stripe'

export async function GET(req) {

    const params = new URL(req.url).searchParams;
    const id = params.get("id")
    const hospitalname = params.get("hospitalname")


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


    try {

        await conect()
        
        let find_dummy_user_data = await User.findOne({ userid: id, hospitalname: hospitalname })
        console.log(find_dummy_user_data)
        if (!find_dummy_user_data) {
            return NextResponse.json({ data: "data not available" },)
        }

        const subscription = await stripe.subscriptions.retrieve(find_dummy_user_data.subcreptionID)

        return NextResponse.json({ data: subscription,plan:find_dummy_user_data.subcreption , expiredate:find_dummy_user_data.expiredate ,date:find_dummy_user_data.date})

    } catch (error) {
        console.log(error, "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
        return NextResponse.json({ data: "data not available"})
    }


}