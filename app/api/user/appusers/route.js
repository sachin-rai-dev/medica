import { conect } from '@/functions/db'
import { User } from '@/scema/user'
import { NextResponse } from 'next/server'


export async function GET(req) {

    await conect()

    let data = await User.find()

    return NextResponse.json({ data })

}

