"use client"

import { Button } from "@/components/ui/button";
import { Bell, CircleUser, ClipboardPlus, Home, Hospital, LineChart, Mail, Package2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";





export default function dashboardLayout({ children }) {
    let [routes, setrouts] = useState("")

    let route = usePathname()

    useEffect(() => {
        setrouts(route)
    })

    return (

        <main className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r zinc-800 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6 text-white" />
                            <span className="text-white">Acme Inc</span>
                        </Link>
                        <Button
                            variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard" ? "bg-muted" : "text-white"}`}
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/Orders"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Orders" ? "bg-muted" : "text-white"}`}
                            >
                                <ClipboardPlus className="h-4 w-4"/>
                                pissants

                            </Link>
                            <Link
                                href="/dashboard/Complain"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Complain" ? "bg-muted" : "text-white"}`}
                            >
                                <Mail className="h-4 w-4" />
                                Complain
                            </Link>
                            <Link
                                href="/dashboard/Customers"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Customers" ? "bg-muted" : "text-white"}`}
                            >
                                <Users className="h-4 w-4" />
                                Customers
                            </Link>
                            <Link
                                href="/dashboard/Analytics"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Analytics" ? "bg-muted" : "text-white"}`}
                            >
                                <LineChart className="h-4 w-4" />
                                Analytics
                            </Link>

                            <Link
                                href="/dashboard/Departments"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Departments" ? "bg-muted" : "text-white"}`}
                            >
                                <Hospital className="h-4 w-4" />
                                Departments
                            </Link>

                            <Link
                                href="/dashboard/Profile"
                                className={`flex items-center gap-3 rounded-lg  px-3 py-2 text-primary transition-all hover:text-gray-300 ${routes == "/dashboard/Profile" ? "bg-muted" : "text-white"}`}
                            >
                                <CircleUser className="h-4 w-4" />
                                Profile
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>



            <div className="overflow-scroll h-screen" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {children}
            </div>
        </main>

    )
};