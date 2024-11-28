"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Cookesfunget } from "@/functions/server";

function Pages() {
  let auth = useAuth();
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentDataFor, setAppointmentDataFor] = useState({});
  let [reset, setreset] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let checker = async () => {
        var hospital = await Cookesfunget("hospital");

        try {
          let dashboarddata = await fetch(
            `${
              process.env.NEXT_PUBLIC_API
            }/api/user?hospitalname=${hospital.value.replace(" ", "_")}&id=${
              auth.userId
            }`
          );

          let data2 = await dashboarddata.json();
          console.log(data2);
          return data2;
        } catch (error) {
          console.log(error.message);
        }
      };

      let data2 = await checker();

      setAppointmentData(data2.data.departments);
      setAppointmentDataFor(data2);
    }
    fetchData();
  }, [reset]);

  return (
    <div>
      <header className="flex h-14 items-center justify-end gap-4 border-b bg-black px-4 lg:h-[60px] lg:px-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="p-5">
        <div>
          <Dialogin
            data={appointmentDataFor}
            btntitel={"Add"}
            title={"Add department"}
            description={"This action use for creating a new department"}
            datafecher={() => {
              setreset(!reset);
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          {appointmentData.map((val, i) => {
            return (
              <Cardin
                title={val}
                cardobj={appointmentDataFor}
                key={i}
                datafecher={() => {
                  setreset(!reset);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Dialogin({ data, btntitel, title, description, datafecher }) {
  let { toast } = useToast();

  let [departmentname, setdepartmentname] = useState("");
  let [id, setid] = useState("");
  let [email, setemail] = useState("");
  let [hospitalname, sethospitalname] = useState("");
  let [filter, setfilter] = useState([]);
  let [lode, setlode] = useState(true);
  let [alldata, setalldata] = useState({});
  let [numberofdepartment, setnumberofdepartment] = useState(0);

  useEffect(() => {
    if (data.data) {
      setfilter(data.data.departments);
      setid(data.data.userid);
      setemail(data.data.useremail);
      sethospitalname(data.data.hospitalname.replace(" ", "_"));
      setalldata(data.data);

      let { subcreption } = alldata;
      switch (subcreption) {
        case "free":
          setnumberofdepartment(3);
          break;
        case "basic":
          setnumberofdepartment(6);
          break;
        case "standard":
          setnumberofdepartment(16);
          break;
        case "pro":
          setnumberofdepartment(26);
          break;
      }
    }
  }, [data]);

  const handel_data = async () => {
    setlode(false);
     console.log(1)
    if (departmentname == "") {
      toast({
        title: "input not valid",
        description: "pleas fill the input",
      });
      setlode(true);
      return;
    }
    console.log(2)
    if (filter.length < numberofdepartment) {
      if (filter.includes(departmentname)) {
        toast({
          title: (
            <h1 className="text-xl font-bold ">department is already exist</h1>
          ),
        });
        setlode(true);
        return;
      }
      console.log(3)
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/departmentadd?id=${id}&email=${email}&hospitalname=${hospitalname}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ departments: [...filter, departmentname] }),
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: (
          <h1 className="text-xl font-medium ">your plan is {subcreption}</h1>
        ),
        description: (
          <h2 className="text-base font-normal">
            you can only create {numberofdepartment} departments
          </h2>
        ),
      });
      setlode(true);
    }

    setlode(true);
    datafecher();
  };

  const delete_data = async () => {
    setlode(false);

    if (departmentname == "") {
      toast({
        title: "input not valid",
        description: "pleas fill the input",
      });
      setlode(true);
      return;
    }

    if (!filter.includes(departmentname)) {
      toast({
        title: (
          <h1 className="text-xl font-bold text-red-800">
            Department Name Is Not Exist
          </h1>
        ),
      });
      setlode(true);
      return;
    }

    let new_fiter_data = filter.filter((val) => {
      return val !== departmentname.toUpperCase();
    });

    let delete_appointments = alldata.appointments.filter((val) => {
      return val.deparetment !== departmentname.toUpperCase();
    });

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/departmentadd?id=${id}&email=${email}&hospitalname=${hospitalname}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ departments: new_fiter_data }),
        }
      );

      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/departmentadd?id=${id}&email=${email}&hospitalname=${hospitalname}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointments: delete_appointments }),
        }
      );
      datafecher();
    } catch (error) {
      console.log(error);
    }

    setlode(true);
  };

  return (
    <div className="flex items-center justify-end gap-6 p-5">
      <Dialog>
        <DialogTrigger>
          <Button className=" py-5 px-8 text-black bg-slate-50 hover:bg-black hover:text-slate-50 hover:border hover:border-white">
            {lode ? (
              <h1 className="text-lg font-medium">{btntitel}</h1>
            ) : (
              "processing..."
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-start flex-col space-x-2 gap-5 p-6">
            <div className="flex flex-col gap-2 px-3">
              <label className=" flex flex-col gap-2 font-medium">
                department name
                <input
                  type="text"
                  className="outline outline-black  focus-visible:border-2 border-black  rounded-md h-8 w-full"
                  onChange={(e) => {
                    let value = e.target.value;
                    setdepartmentname(value.toUpperCase());
                    console.log(departmentname);
                  }}
                  value={departmentname}
                ></input>
              </label>
            </div>
            <Button
              onClick={() => {
                if (btntitel == "Add") {
                  handel_data();
                }
                if (btntitel == "Delate") {
                  delete_data();
                }
              }}
              size="sm"
              className="px-3 text-white "
            >
              {lode ? (
                <h1 className="text-lg font-medium">{btntitel}</h1>
              ) : (
                "processing..."
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Cardin({ title, cardobj, datafecher }) {
  let date = new Date();

  let [calculate_appointment, set_calculate_appointment] = useState([]);
  let [pissants, setpissants] = useState([]);
  let [totalappointment, settotalappointment] = useState(0);

  let date_now = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  console.log(date_now);
  useEffect(() => {
    function appointment_calculator() {
      let appointments = cardobj.data.appointments;

      let filter_appointmentsall = appointments.filter((val) => {
        return val.deparetment == title;
      });

      settotalappointment(filter_appointmentsall.length);

      let filter_appointments = appointments.filter((val) => {
        return val.date == date_now && val.deparetment == title;
      });
      set_calculate_appointment(filter_appointments);
    }

    function pissants_calculator() {
      let pissants = cardobj.data.pissants;

      let filter_pissants = pissants.filter((val) => {
        return val.deparetment === title;
      });
      setpissants(filter_pissants);
    }

    appointment_calculator();
    pissants_calculator();
  }, [cardobj]);

  return (
    <div>
      <Card className="bg-black outline-2 text-slate-50 shadow-[0px_5px_0px_white]">
        <CardHeader>
          <CardTitle className="font-bold text-xl flex justify-between">
            <span>{title}</span>{" "}
            <span>
              {date.getDate() +
                "." +
                date.getMonth() +
                "." +
                date.getFullYear()}
            </span>{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col ">
          <div className="grid grid-cols-3 gap-5">
            <div>
              <p className="text-slate-50 font-semibold">Total patints</p>
              <h1 className="text-slate-50 font-bold text-lg">
                {pissants.length}
              </h1>
            </div>
            <div>
              <p className="text-slate-50 font-semibold">Today Appointments</p>
              <h1 className="text-slate-50 font-bold text-lg">
                {calculate_appointment.length}
              </h1>
            </div>
            <div>
              <p className="text-slate-50 font-semibold">Total Appointments</p>
              <h1 className="text-slate-50 font-bold text-lg">
                {totalappointment}
              </h1>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialogin
            data={cardobj}
            btntitel={"Delate"}
            title={"delete department"}
            description={"This action use for deleting a department"}
            datafecher={datafecher}
          ></Dialogin>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Pages;
