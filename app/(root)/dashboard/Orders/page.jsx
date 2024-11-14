"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useToast } from "@/hooks/use-toast";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TableDemo() {
  const [data2, setData2] = useState([]);
  let [loder, setloder] = useState(false);
  let [restart,setrestart]=useState(true)
  const auth = useAuth();
  const router = useRouter();
  let { toast } = useToast();

  useEffect(() => {
    async function datageter() {
      let person = await Cookesfunget("person");

      if (!person) {
        router.push("/info");
        return;
      }

      switch (person.value) {
        case undefined:
          router.push("/info");
          break;
        case "doctor":
          router.push("/yoyo");
          break;
        default:
          let hospital = await Cookesfunget("hospital");

          if (!hospital) {
            router.push("/info");
            return;
          }

          
          try {
            let dashboarddata = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/user?hospitalname=${hospital.value.replace(" ","_")}&id=${auth.userId}`
            );
            let data = await dashboarddata.json();
            if (data.data) {
              setData2(data.data.pissants);
              setloder(true);
              console.log(data.data.pissants)
            }
          } catch (error) {
            console.log(error.message);
          }
      }
    }
    datageter();
  }, [router,restart]);

  let delete_passant = async (id) => {
    let filterdata = data2.filter((val) => {
      return val._id !== id;
    });

    try {
      let hospital = await Cookesfunget("hospital");
      let response = await fetch(
        `http://localhost:3000/api/user`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid:auth.userId,
            hospitalname:hospital.value.replace(" ","_"),
            updatedata:{ pissants: filterdata }
          }),
        }
       
      );
      let resjson = await response.json()
       console.log(resjson)
      if(resjson.data == "request is not valid") {
        toast({ title: "pissants not deleted", description: "sorry fail to deleting data ",type: "error", autoClose: true,style: { background: 'red', color: 'white' } });
      }
      else{
        toast({ title: "pissants deleted", description: "This is a success message!",type: "success", autoClose: true,style: { background: 'green', color: 'white' }});
        setrestart(!restart)
      }
    } catch (error) {
      console.log(error.message);
      toast({ title: "pissants not deleted", description: "sorry fail to deleting data ",type: "error", autoClose: true,style: { background: 'red', color: 'white' } });
    }
  };

  return (
    <div>
      <header className="flex h-14 items-center justify-end gap-4 border-b bg-black px-4 lg:h-[60px] lg:px-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {loder ? (
        <Table className="text-gray-100">
          <TableCaption>A list of your all patients</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"> </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="text-right">Appointment Date</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data2.map((val, i) => (
              <TableRow key={i} className="font-medium">
                <TableCell>
                  <Image
                    src={val.imgurl}
                    alt={`no image`}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="font-medium">{val.name}</TableCell>
                <TableCell>{val.deparetment}</TableCell>
                <TableCell>{val.mobile}</TableCell>
                <TableCell className="text-right">{val.date}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      delete_passant(val._id);
                    }}
                    className="bg-red-600"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow></TableRow>
          </TableFooter>
        </Table>
      ) : (
        <div>
          <Skeleton
            className={"h-14 w-full rounded-sm m-2 bg-slate-50"}
          ></Skeleton>
          <Skeleton
            className={"h-14 w-full rounded-sm m-2 bg-slate-50"}
          ></Skeleton>
          <Skeleton
            className={"h-14 w-full rounded-sm m-2 bg-slate-50"}
          ></Skeleton>
          <Skeleton
            className={"h-14 w-full rounded-sm m-2 bg-slate-50"}
          ></Skeleton>
        </div>
      )}
    </div>
  );
}
