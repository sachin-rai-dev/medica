import { conect } from "@/functions/db"
import { User } from "@/scema/user"
import { NextResponse } from "next/server"

export async function POST(req) {
   
    const params = new URL(req.url).searchParams;

    const id = params.get("id")
    const hospitalname = params.get("hospitalname")
    const email=params.get("email")

    console.log(id,hospitalname,email)

    let data = await req.json()
   

    try {
        await conect()

        let finddommyuserdata = await User.findOne({ userid: id, useremail: email, hospitalname: hospitalname })

        if (!finddommyuserdata) {
            
            return NextResponse.json({ error: "request is not valid" })
        }

        let post = await User.findOneAndUpdate({ userid: id, useremail: email, hospitalname: hospitalname },data)

        return NextResponse.json(post)

    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: "request is not valid" })
    }

}