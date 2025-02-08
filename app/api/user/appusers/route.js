import { conect } from '@/functions/db'
import { User } from '@/scema/user'
import { NextResponse } from 'next/server'
import { App_User } from '@/scema/appuser'


export async function GET(req) {

    await conect()

    let data = await User.find()

    return NextResponse.json({ data })

}

export async function POST(req) {

    try {

        let data = await req.json()

        console.log(data)

        await conect()

        let created_data = await App_User.create(data)

        console.log(created_data)

        return NextResponse.json({ created_data })

    } catch (error) {

        return NextResponse.json({ error })
    }

}

