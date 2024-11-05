"use client";

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
import { useState, useEffect } from "react";

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

export default function Linechart({ chartConfig, data ,department}) {
  const [appointmentsData, setAppointmentsData] = useState(
    monthNames.map((month) => ({ month, Appointments: 0 }))
  );
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    if (data.appointments) {
      const updatedAppointments = appointmentsData.map((item) => ({
        ...item,
        Appointments: 0,
      }));

      let date=new Date().getMonth()+1;
      let dateday=new Date().getDate();
      
      data.appointments.forEach((val) => {
        if (parseInt(val.date.split("/")[0]) >= dateday && parseInt(val.date.split("/")[1]) >= date && parseInt(val.date.split("/")[2]) >= currentYear) {
          const monthIndex = parseInt(val.date.split("/")[1], 10) - 1;
          updatedAppointments[monthIndex].Appointments += 1;
      }
      });

      setAppointmentsData(updatedAppointments);
    }
  }, [data]);

  

  return (
    <Card className="shadow-[0px_5px_0px] shadow-emerald-600">
      <CardHeader>
        <CardTitle>{department}</CardTitle>
        <CardDescription>January - December {currentYear}</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={appointmentsData}
            margin={{
              left: 12,
              right: 12,
            }}
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
