"use client";

import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cookesfunget } from "@/functions/server";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const auth = useAuth();
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  let [loder, setloeder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function datacks() {
      const hospital = await Cookesfunget("hospital");
      if (!hospital) {
        router.push("/info");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/user?hospitalname=${hospital.value.replace(" ","_")}&id=${auth.userId}`
        );
        const data2 = await response.json();
        if (data2.data) {
          setDepartments(data2.data.departments);
          setData(data2.data.pissants);
          setloeder(true)
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (auth.isLoaded) {
      datacks();
    }
  }, [router]);

  const LinechartConfig = {
    Appointments: {
      label: "Appointments",
      color: "red",
    },
    dataKey: "Appointments",
  };

  const data2 = [{ date: "28/9/2024" }];

  return (
    <div>
      <header className="flex h-14 items-center justify-end gap-4 border-b bg-black px-4 lg:h-[60px] lg:px-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="m-5 grid gap-5">
        {loder ? (
          <div className="grid grid-cols-1">
            <Linechart
              chartConfig={LinechartConfig}
              data={data}
              departments={"All_Departments"}
            />
          </div>
        ) : (
          <div>
            <Skeleton className={"h-80 w-full bg-white"}></Skeleton>
          </div>
        )}
        <div className="grid grid-cols-2 gap-5">
          {departments.map((val, index) => (
            <div key={index}>
              <Linechart
                chartConfig={LinechartConfig}
                data={data}
                departments={val}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;

function Linechart({ chartConfig, data, departments }) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [appointmentsData, setAppointmentsData] = useState(
    monthNames.map((month) => ({ month, Appointments: 0 }))
  );
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    if (data && departments) {
      const updatedAppointments = monthNames.map((month) => ({
        month,
        Appointments: 0,
      }));

      data.forEach((val) => {
        if (departments !== "All_Departments") {
          if (
            val.deparetment === departments &&
            parseInt(val.date.split("/")[2], 10) === currentYear
          ) {
            let Index = parseInt(val.date.split("/")[1]) - 1;
            console.log(Index, "yes this is index");
            updatedAppointments[Index].Appointments += 1;
          }
        } else {
          if (parseInt(val.date.split("/")[2], 10) === currentYear) {
            let Index = parseInt(val.date.split("/")[1]) - 1;
            console.log(Index, "yes this is index");
            updatedAppointments[Index].Appointments += 1;
          }
        }
      });
      setAppointmentsData(updatedAppointments);
    }
  }, [data, departments]);

  return (
    <Card className="shadow-[0px_5px_0px] shadow-emerald-600">
      <CardHeader>
        <CardTitle>{departments}</CardTitle>
        <CardDescription>January - December {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={appointmentsData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="Appointments"
              type="natural"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start text-sm py-1">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
