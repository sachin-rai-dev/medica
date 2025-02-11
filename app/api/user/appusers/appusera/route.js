import { conect } from '@/functions/db'
import { App_User } from '@/scema/appuser'
import { NextResponse } from 'next/server'

export async function GET(req) {

    try {

        let urlParams = new URL(req.url).searchParams;
        let email = urlParams.get('email');
        let name = urlParams.get('name');
        

        await conect()

        let created_data = await App_User.findOne({ email:email,name:name })

        console.log(created_data)

        return NextResponse.json({ created_data })

    } catch (error) {

        console.log(error)

        return NextResponse.json({ error })
    }

}