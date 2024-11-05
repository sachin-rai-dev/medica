"use client";
import { useEffect, useState } from "react";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Radialchart } from "@/components/Radial Chart - Text";
import Recenappoint from "@/components/recenappoint";
import { Cookesfunget } from "@/functions/server";
import Linechart from "@/components/Line-chart";

function Dashboard() {
  const auth = useAuth();
  const router = useRouter();
  const [data2, setData2] = useState({});
  const [chartdata, setChartData] = useState([
    { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
  ]);
  const [pissantsData, setpissantsData] = useState([
    { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
  ]);

  if (!auth.isSignedIn) {
    router.push("/");
  }

  useEffect(() => {
    async function datageter() {
      let person = await Cookesfunget("person");
      
      if (person == undefined) {
        person = { value: undefined };
      }
      switch (person.value) {
        case undefined:
          router.push("/info");
          break;
        case "doctor":
          router.push("/yoyo");
          break;
        default:
          let datacks = async () => {
            let hospital = await Cookesfunget("hospital");
               if (hospital == undefined) {
                router.push("/info")
               }

            try {
              let dashboarddata = await fetch(
                `http://localhost:3000/api/user?hospitalname=${hospital.value}&id=${auth.userId}`
              );

              let data2 = await dashboarddata.json();
              return data2;
            } catch (error) {
              console.log(error.message);
            }
          };

          let datack=await datacks();
          console.log(datack);
          if (datack.data) {
            setData2(datack.data);
          }

          let date = new Date().getDate();
          let month = new Date().getMonth()+1; // getMonth() is zero-based

          let appointments = datack.data.appointments.filter((val) => {
            return (
              val.date.split("/")[0] == date && val.date.split("/")[1] == month
            );
          });

          if (appointments.length === 0) {
            setChartData([
              { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
            ]);
          } else {
            setChartData([
              {
                browser: "safari",
                visitors: appointments.length,
                fill: "var(--color-safari)",
              },
            ]);
          }
          if (datack.data.pissants.length == 0) {
            setpissantsData([
              { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
            ]);
          } else {
            setpissantsData([
              {
                browser: "safari",
                visitors: datack.data.pissants.length,
                fill: "var(--color-safari)",
              },
            ]);
          }
      }
    }
    datageter();
  }, [router]);

  const normaldata = [
    {
      titel: "Today appointment",
      appointment: "appointment",
      footer: "Showing total appointment",
    },
  ];

  const appointmentslist1 = [
    {
      name: "reena rai",
      date: "20/9/2024",
      gender: "female",
      department: "ENT",
    },
  ];

  const LinechartConfig = {
    Appointments: {
      label: "Appointments",
      color: "red",
    },
    dataKey: "Appointments",
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center justify-end gap-4 border-b bg-black px-4 lg:h-[60px] lg:px-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="p-5 grid gap-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <Radialchart chartData={chartdata} normaldata={normaldata} />
            <Radialchart
              chartData={
                data2.pissants
                  ? [
                      {
                        browser: "safari",
                        visitors: data2.pissants.length,
                        fill: "var(--color-safari)",
                      },
                    ]
                  : [
                      {
                        browser: "safari",
                        visitors: 0,
                        fill: "var(--color-safari)",
                      },
                    ]
              }
              normaldata={[
                {
                  titel: "Total pissants",
                  appointment: "pissants",
                  footer: "Showing total pissants",
                },
              ]}
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-5 ">
          <Recenappoint appointmentslist={appointmentslist1} />
          <Linechart chartConfig={LinechartConfig} data={data2} department="All Appointments"></Linechart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
