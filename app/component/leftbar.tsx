"use client";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function LeftbarWriter({ role }: { role: string }) {
  const path = usePathname();
  const [notAlertRead, setNotAlertRead] = useState<number>(0);
  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const response = await fetch(
          "https://back-writer.onrender.com/writer/getAlertsnum",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        setNotAlertRead(data.alertsnum);
      } catch (e) {
        console.log(e);
      }
    };
    role === "writer" ? fetchAlert() : null;
  }, []);
  return (
    <div
      className="flex max-h-fit w-full  min-h-fit md:bottom-auto  bottom-0 m-5 bg-gray-600 md:bg-transparent  md:mt-0 mt-0 mb-0 pr-6 pb-0 md:w-3/12 py-2 md:py-2 z-50 
     justify-around md:relative fixed left-44 rounded-t-4xl md:left-auto -translate-x-1/2 md:translate-x-0  
      overflow-hidden min-w-40 text-white"
    >
      <div className="w-full h-full  md:bg-gray-600 opacity-60 z-0 absolute md:top-0 left-0 rounded-2xl"></div>
      <div className="grid md:grid-cols-1 gap-10   grid-cols-5 w-11/12 relative z-10  items-center md:p-3 justify-center h-full      ">
        <Link
          href={`/${role}`}
          className={`md:w-11/12 m-2 p-3 w-fit  rounded-2xl  hover:text-blue-600 font-bold md:text-2xl hover:bg-purple-950 transition-all delay-100  flex md:flex-row flex-col-reverse items-center justify-around ${path === `/${role}` ? "bg-purple-950 text-blue-600" : ""}`}
        >
          الرئيسية
          <HomeOutlinedIcon />
        </Link>
        <Link
          href={`/${role}/alert`}
          onClick={() => setNotAlertRead(0)}
          className={`md:w-11/12 m-2 p-3 w-fit rounded-2xl hover:text-blue-600 font-bold md:text-2xl hover:bg-purple-950 transition-all delay-100 flex md:flex-row flex-col-reverse items-center justify-around ${path === `/${role}/alert` ? "bg-purple-950 text-blue-600" : ""}`}
        >
          الاشعارات
          <NotificationsOutlinedIcon />
          {notAlertRead > 0 && (
            <sup className="  bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notAlertRead}
            </sup>
          )}
        </Link>
        <Link
          href={`/${role}/mylibrary`}
          className={`md:w-11/12 m-2 p-3 w-fit rounded-2xl hover:text-blue-600 font-bold md:text-2xl hover:bg-purple-950 transition-all delay-100 flex items-center  md:flex-row flex-col-reverse justify-around ${path === `/${role}/mylibrary` ? "bg-purple-950 text-blue-600" : ""}`}
        >
          مكتبتي <AutoStoriesOutlinedIcon />
        </Link>
        <Link
          href={`/${role}/settings`}
          className={`md:w-11/12 m-2 p-3 w-fit rounded-2xl hover:text-blue-600 font-bold md:text-2xl hover:bg-purple-950 transition-all delay-100 flex md:flex-row flex-col-reverse items-center justify-around ${path === `/${role}/settings` ? "bg-purple-950 text-blue-600" : ""}`}
        >
          الاعدادات
          <SettingsOutlinedIcon />
        </Link>
        <Link
          href={`/${role}/follwers`}
          className={`md:w-11/12 m-2 p-3 w-fit rounded-2xl hover:text-blue-600 font-bold md:text-2xl hover:bg-purple-950 transition-all delay-100 flex md:flex-row flex-col-reverse items-center justify-around ${path === `/${role}/follwers` ? "bg-purple-950 text-blue-600" : ""}`}
        >
          المتابعين
          <PersonAddOutlinedIcon />
        </Link>
      </div>
    </div>
  );
}
