"use client"

import { checker } from '@/functions/server'
import React, { useEffect } from 'react'

function Pages() {

    useEffect(()=>{
        console.log("data1")
        async function data() {
            let data2= await checker();
            console.log(data2)
        }

        data()

        console.log("data3")

    },[])

  return (
    <div>page</div>
  )
}

export default Pages