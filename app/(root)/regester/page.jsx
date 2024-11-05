"use client";

import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Register() {
  let router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { userId } = useAuth();

  let auth = useAuth().isLoaded;

  useEffect(() => {
    if (auth == false) {
      router.push("/");
    }
  });

  async function callingpost(data) {
    try {
      let setdate = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let getdate = await setdate.json();

      if (getdate.error == "request is not valid") {
        toast({
          variant: "destructive",
          title: "data is not valid",
          description: "you data is not valid pleas try agin",
        });
      }
      if (getdate._id) {
        router.push("/payment");
        toast({
          title: "registered successfully",
        });
      }

      return getdate;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "registered error",
        description: "pleas try agin",
      });
    }
  }

  function userposter(e) {
    e.preventDefault();

    // Get the current date
    const currentDate = new Date();

    // Set the number of days to add (e.g., 30 days for expiration)
    const daysToAdd = 30;

    // Create the expiration date by adding days
    const expirationDate = new Date(currentDate);
    expirationDate.setDate(currentDate.getDate() + daysToAdd);

    let date = currentDate.toDateString();
    let expiredate = expirationDate.toDateString();

    const post = {
      username: e.target.name.value,
      userid: userId,
      useremail: user.emailAddresses[0].emailAddress,
      hospitalname: e.target.hospital.value,
      add: e.target.add.value,
      expiredate: expiredate,
      reviw: [],
      departments: [],
      transitions: [],
      appointments: [],
      rating: 0,
      date: date,
    };

    callingpost(post);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
      <h1 className="font-bold text-left text-2xl p-2">Register</h1>
      <form
        onSubmit={userposter}
        className="flex flex-col gap-3 border border-1 rounded-lg border-black p-4"
      >
        <label className="flex flex-col gap-3 font-medium">
          Your name
          <input
            type="text"
            name="name"
            required
            className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
          />
        </label>
        <label className="flex flex-col gap-3 font-medium">
          Hospital name
          <input
            type="text"
            name="hospital"
            required
            className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
          />
        </label>
        <label className="flex flex-col gap-3 font-medium">
          Hospital address
          <input
            type="text"
            name="add"
            required
            className="outline outline-black rounded-lg h-10 w-72 text-black font-semibold p-2"
          />
        </label>

        <input
          type="submit"
          value="Submit"
          className="border-2 border-black py-2 w-full rounded-lg text-lg font-bold hover:text-white hover:bg-black"
        />
      </form>
    </div>
  );
}

export default Register;
