"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cookesfunget } from "@/functions/server";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserProfile, useUser } from "@clerk/nextjs";
import { CreditCard, IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  let router = useRouter();
  let auth = useAuth();
  let { toast } = useToast();
  let [acount, setacount] = useState({});
  let [loder, setloder] = useState(false);
  let [planc, setpalnc] = useState(false);

  useEffect(() => {
    async function getsub() {
      let hospitalname = await Cookesfunget("hospital");

      if (hospitalname === undefined) {
        router.push("/info");
      }
      try {
        console.log(auth.userId, hospitalname.value);
        let dataui = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/subscreption?id=${auth.userId}&hospitalname=${hospitalname.value.replace(" ","_")}`
        );
        let data = await dataui.json();
        
        if (data.data == "data not available") {
          setpalnc(true);
          // toast({
          //   title: (
          //     <h1 className="text-xl font-semibold text-red-600">
          //       sorry server is not working
          //     </h1>
          //   ),
          // });
        } else {
          setacount({
            plan: data.plan,
            status: data.data.status,
            amount: data.data.plan.amount_decimal,
            currency: data.data.plan.currency.toString(),
            expiredate: data.expiredate,
            date: data.date,
            quantity: data.data.quantity,
          });

          setloder(true);

          console.log(acount);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getsub();
  }, [router]);

  return (
    <main className="bg-black text-slate-100 p-5">
      {planc ?

       <div>
          <Card className="border-2 border-slate-100 shadow-[0px_5px_0px] shadow-slate-100 bg-black text-slate-100 p-6">
          <CardHeader>
                <CardTitle className="text-center text-2xl items-end">
                  <h1>You Have No Plane</h1>
                </CardTitle>
                <CardContent></CardContent>
                <CardFooter className={"flex justify-center"}>
                  <Button className="bg-white text-black text-base font-medium p-5 rounded-lg" onClick={()=>{router.push("/payment")}}>parches Plane</Button>
                </CardFooter>
              </CardHeader>
            </Card>
          </div>

          :
        
      loder ? (
          <Card className="border-2 border-slate-100 shadow-[0px_5px_0px] shadow-slate-100 bg-black text-slate-100 p-6">
            <CardHeader>
              <CardTitle>
                <div className="border-b-2 p-2 border-slate-100  text-3xl font-bold text-center">
                  <i>Subscription Details</i>
                </div>
                <div className="flex justify-between p-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-lg flex gap-1 p-1">Plan <CreditCard> </CreditCard> </span>
                    <h1 className="text-2xl">{acount.plan}</h1>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg">Status</h1>
                    <h1
                      className={`text-2xl ${
                        acount.status == "active"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {acount.status}
                    </h1>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-y-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Amount</h1>
                <h1 className={`text-2xl `}>
                  {acount.amount + acount.currency}
                </h1>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Purchase date</h1>
                <h1 className={`text-2xl `}>{acount.date}</h1>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Expiredate date</h1>
                <h1 className={`text-2xl `}>{acount.expiredate}</h1>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-lg">quantity</h1>
                <h1 className={`text-2xl`}>{acount.quantity}</h1>
              </div>
            </CardContent>
            <CardFooter>
              {acount.status !== "active" || acount.plan == "free" ? (
                <Button className="bg-white text-black text-base font-medium p-5 rounded-lg" onClick={()=>{router.push("/payment")}}>parches Plane</Button>
              ) : (
                ""
              )}
             
            </CardFooter>
          </Card>
        
      ) : (
        <div>
          <Skeleton className={"h-80 w-full m-5 bg-slate-100"}></Skeleton>
        </div>
      )
    }
    </main>
  );
}

export default page;
