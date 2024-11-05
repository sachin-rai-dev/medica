import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function Recenappoint({ appointmentslist }) {
  let time = new Date().getDate();
  let time2 = new Date().getMonth();

  let filtervals = appointmentslist.filter((val) => {
    return val.date.split("/")[0] == time && val.date.split("/")[1] == time2;
  });

  return (
    <div>
      <Card x-chunk="dashboard-01-chunk-5" className="shadow-[0px_5px_0px_green] shadow-emerald-600">
        <CardHeader>
          <CardTitle>Recent appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-8 overflow-scroll h-64 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filtervals.map((val, i) => {
              return (
                <div className="flex items-center gap-4 border-t-2 " key={i}>
                 
                    <div className="h-5 bg-slate-600 w-5 rounded-full"></div>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {val.name}
                      </p>
                      
                    </div>
                    <p className="text-sm text-black font-medium">{val.department}</p>
                    <div className="ml-auto font-medium">{val.date}</div>
                  
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Recenappoint;
