"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cookesfunget } from "@/functions/server";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  let router = useRouter();
  let [pdata, setpdata] = useState([]);
  let date = new Date();
  let newdate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  let [dataf, setdataf] = useState(false);

  useEffect(() => {
    async function doctor() {
      let hospital = await Cookesfunget("hospital");
      let doctorid = await Cookesfunget("doctor");
      let department = await Cookesfunget("department");

      if (!hospital || !doctorid || !department) {
        router.push("/info");
        return;
      }

      try {
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/doctor?doctorid=${
            doctorid.value
          }&hospitalname=${hospital.value.replace(" ", "_")}&department=${
            department.value
          }`
        );

        let data = await res.json();

        console.log(newdate);

        let filter_date = data.data.appointments.filter((val) => {
          return val.date == newdate && val.deparetment == department.value;
        });

        console.log(filter_date);
        setpdata(filter_date);
      } catch (error) {
        console.log(error);
      }
    }

    doctor();
  }, [router, dataf]);

  let present = async (val) => {
    let hospital = await Cookesfunget("hospital");
    let doctorid = await Cookesfunget("doctor");
    let department = await Cookesfunget("department");
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/doctor?doctorid=${
          doctorid.value
        }&hospitalname=${hospital.value.replace(" ", "_")}&department=${
          department.value
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updatedata: val,
            chang: "present",
          }),
        }
      );
      setdataf(!dataf);
    } catch (error) {
      console.log(error);
    }
  };

  let absent = async (val) => {
    let hospital = await Cookesfunget("hospital");
    let doctorid = await Cookesfunget("doctor");
    let department = await Cookesfunget("department");
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/doctor?doctorid=${
          doctorid.value
        }&hospitalname=${hospital.value.replace(" ", "_")}&department=${
          department.value
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updatedata: val,
            chang: "absent",
          }),
        }
      );

      setdataf(!dataf);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Table>
        <TableCaption>A list of your today all appointments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">peasant</TableHead>
            <TableHead className="text-right">absent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pdata.map((data, i) => (
            <TableRow key={i} className="text-slate-100">
              <TableCell className="font-medium">
                <Image src={data.imgurl} alt="no img" />
              </TableCell>
              <TableCell className="font-medium">{data.name}</TableCell>
              <TableCell>{data.gender}</TableCell>
              <TableCell
                className={`${
                  data.status == "peasant" ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.status}
              </TableCell>
              <TableCell>
                <Button
                  className="bg-green-500"
                  onClick={() => {
                    present(data._id);
                  }}
                >
                  peasant
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    absent(data._id);
                  }}
                >
                  absent
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default page;
