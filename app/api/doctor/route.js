import { conect } from "@/functions/db";
import { User } from "@/scema/user";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const params = new URL(req.url).searchParams;
        const id = params.get("doctorid")
        const hospitalname = params.get("hospitalname")
        const department = params.get("department")

        await conect()
        let dummy_data = await User.findOne({ userid: id, hospitalname: hospitalname })

        if (!dummy_data) {
            return NextResponse.json({ data: "data not available" })
        }
        return NextResponse.json({ data: dummy_data })
    }
    catch (error) {
        console.log(error.message)
    }
}

export async function PATCH(req) {
    try {
        const params = new URL(req.url).searchParams;
        const id = params.get("doctorid")
        const hospitalname = params.get("hospitalname")
        const department = params.get("department")

        let data = await req.json()
        
        await conect()
        let dummy_data = await User.findOne({ userid: id, hospitalname: hospitalname })

        if (!dummy_data) {
            return NextResponse.json({ data: "data not available" })
        }

        console.log(dummy_data.appointments)

        let filter_data = []
        dummy_data.appointments.map((val) => {
            return val._id != data.updatedata ? { ...val,status:data.chang} :{ ...val,status:data.chang}
        })

        dummy_data.appointments.forEach((val) => {
            if(val._id != data.updatedata){
                filter_data.push(val)
            }else{
                filter_data.push({
                    name:val.name,
                    gender:val.gender,
                    date:val.date,
                    mobile:val.mobile,
                    imgurl:val.imgurl,
                    deparetment:val.deparetment,
                    status:data.chang
                })
            }
        });

        

     
        console.log(data.chang)

        let update_data = await User.findOneAndUpdate({ userid: id, hospitalname: hospitalname }, { appointments: filter_data })
        return NextResponse.json({ data: filter_data })

    } catch (error) {
        console.log(error)
    }
}