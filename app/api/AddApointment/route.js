import { conect } from "@/functions/db"
import { User } from "@/scema/user"
import { NextResponse } from "next/server"

export async function PATCH(req) {

    let data = await req.json()

    try {
        await conect()

        let adata = await User.findOne({ _id: data._id })

           console.log(data._id)

        let Apo = await User.findOneAndUpdate({ _id: data._id }, { appointments: [...adata.appointments, data.appointment] ,pissants:[...adata.appointments, data.appointment]})

        return NextResponse.json({ your_appointment: Apo })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err.message })
    }
}