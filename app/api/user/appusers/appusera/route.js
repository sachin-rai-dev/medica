import { conect } from '@/functions/db'
import { App_User } from '@/scema/appuser'
import { NextResponse } from 'next/server'

export async function GET(req) {

    try {

        let urlParams = new URL(req.url).searchParams;
        let email = urlParams.get('email');
        let name = urlParams.get('name');


        await conect()

        let created_data = await App_User.findOne({ email: email, name: name })

        console.log(created_data)

        return NextResponse.json({ created_data })

    } catch (error) {

        console.log(error)

        return NextResponse.json({ error })
    }

}

export async function POST(req) {

    try {


        let urlParams = new URL(req.url).searchParams;
        let email = urlParams.get('email');


        await conect()

        let data = await req.json()

        let find_user = await App_User.findOne({ email: email })

        if (find_user) {

            let update_data = await App_User.findOneAndUpdate({ email: email, name: name }, { book_appointment: [...data.book_appointment] })
            return NextResponse.json({ message: "book appointment success fully" ,error:false})
        }
        else {
            return NextResponse.json({ message: "user not found" ,error:true})
        }


    } catch (error) {

        console.log(error)
        return NextResponse.json({message:error.message, error:true })
    }
}