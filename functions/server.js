"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export const Cookesfunset = async (par, paro) => {
  "use server";

  cookies().set(par, paro);
};

export const Cookesfunget = async (par) => {

  return cookies().get(par)

};


export async function checker() {
  let auths = auth()
  let hospitalname = await Cookesfunget("hospital");
  try {
    let dashboarddata = await fetch(
     `http://localhost:3000/api/user?hospitalname=${hospitalname.value}&id=${auths.userId}`);
    
    let data2 = await dashboarddata.json();
     console.log(data2)
    return data2
  } catch (error) {
    console.log(error.message)
  }
}
