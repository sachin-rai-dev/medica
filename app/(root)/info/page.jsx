"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { Cookesfunset } from "@/functions/server";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Information() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [person, setPerson] = useState("");
  const [id, setId] = useState("");
  const [department, setDepartment] = useState("");
  const [hospital, setHospital] = useState("");
  const [valid, setValid] = useState(false);


    if(!auth.isSignedIn){
      router.push("/");
     }

  const handleInputChange1 = (event) => setPerson(event.target.value);
  const handleInputChange2 = (event) => setId(event.target.value);
  const handleInputChange3 = (event) => setDepartment(event.target.value.toUpperCase());
  const handleInputChange4 = (event) => setHospital(event.target.value);

  async function fetchUser() {
    if (person === "admin") {
      setId(auth.userId);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/user?id=${id}&hospitalname=${hospital.replace(" ","_")}`
      );
      const data2 = await response.json();

      if (data2.data == "data not avalaval") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: person === "admin"
            ? "If you have not purchased a plan and registered, please register and purchase a plan."
            : "There was a problem, please enter valid inputs.",
          action: person === "admin" && (
            <ToastAction altText="purchase plane">
              <Link href="/regester">Purchase Plan</Link>
            </ToastAction>
          ),
        });
      } else {
        await Cookesfunset("person", person);
        await Cookesfunset("hospital", hospital);

        if (person === "admin") {
          router.push("/dashboard");
        } else if (person === "doctor") {
          await Cookesfunset("doctor",`${id}`);
          await Cookesfunset("department",department);
          await Cookesfunset(" ",department)
          if (data2.data.departments.includes(department)) {
            router.push("/doctor");
          }else{
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "department not exist"
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  const seterPerson = () => {
    if (
      (person === "doctor" && id && department && hospital) ||
      (person === "admin" && hospital)
    ) {
      fetchUser();
    } else {
      setValid(true);
    }
  };

  return (
    <main className="flex flex-col md:flex-row items-center justify-center bg-white text-black h-screen">
      {person === "admin" && (
        <div className="m-auto">
          <Card className="bg-black text-white w-2/4 m-auto p-5">
            <CardHeader>
              <CardTitle>
                <h1>Medical</h1>
              </CardTitle>
              <CardDescription>
                <p className="font-medium">
                  If you have not registered and purchased a plan, please register and purchase a plan.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="bg-white text-black hover:bg-black hover:text-white hover:outline outline-white">
                <Link href="/regester">Purchase Plan</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <div className="flex flex-col gap-7 m-auto w-2/5">
        <select
          onChange={handleInputChange1}
          className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
        </select>
        {person === "doctor" && (
          <>
            <label className="flex flex-col gap-3 font-medium">
              ID
              <input
                type="text"
                onChange={handleInputChange2}
                value={id}
                className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
                placeholder="This ID is provided by admin"
              />
            </label>
            <label className="flex flex-col gap-3 font-medium">
              Department Name
              <input
                type="text"
                onChange={handleInputChange3}
                value={department}
                className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
              />
            </label>
          </>
        )}
        {(person === "doctor" || person === "admin") && (
          <label className="flex flex-col gap-3 font-medium">
            Hospital Name
            <input
              type="text"
              onChange={handleInputChange4}
              value={hospital}
              className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
            />
          </label>
        )}
        {valid && (
          <p className="text-red-600 text-lg font-semibold">
            Please enter valid inputs
          </p>
        )}
        <Button
          className="bg-white outline outline-black text-black hover:text-white hover:bg-black w-72"
          onClick={seterPerson}
        >
          Submit
        </Button>
      </div>
    </main>
  );
}

export default Information;
