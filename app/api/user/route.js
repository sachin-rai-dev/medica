import { conect } from "@/functions/db";
import { User } from "@/scema/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const params = new URL(req.url).searchParams;
    const id = params.get("id")
    const hospitalname = params.get("hospitalname")

    await conect();
    let users = await User.findOne({
      userid: id,
      hospitalname: hospitalname
    });
    
    if (!users) {
      users = "data not avalaval"
    };
    console.log(users)
     
    return NextResponse.json({ data: users })

  } catch (error) {
    console.log(error,"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  }
  

}

export async function POST(req) {

  let data = await req.json()
  console.log(data)

  try {
    await conect()

    let finddommyuserdata = await User.findOne({ userid: data.userid, useremail: data.useremail, hospitalname: data.hospitalname })

    if (finddommyuserdata) {
      console.log("user already exist")
      return NextResponse.json({ error: "request is not valid"})
    }

    let post = await User.create(data)

    return NextResponse.json(post)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "request is not valid" })
  }

}


export async function PATCH(req) {

  let data = await req.json()

  try {
    await conect()

    let finddommyuserdata = await User.findOne({ userid: data.userid, hospitalname: data.hospitalname })

    if (!finddommyuserdata) {
      return NextResponse.json({ date: "request is not valid" })
    }
    
    let filter_data=data.updatedata
    let post = await User.findOneAndUpdate({ userid: data.userid, hospitalname: data.hospitalname },filter_data)

    return NextResponse.json({data:post})

  } catch (err) {
    console.log(err.message)
    return NextResponse.json({ data: "request is not valid" })
  }

}



