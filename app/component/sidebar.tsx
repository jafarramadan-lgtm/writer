"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
export default function SidebarComponent() {
  const [userData, setUserData] = useState<{ name: string; role: string,image:string }>({
    name: "",
    role: "",
    image: "",
  });
  useEffect(() => {
    const fetchWriterName = async () => {
      try {
        const response = await fetch("https://back-writer.onrender.com/name", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUserData(data);
        localStorage.setItem("profileImage",data.image)
      } catch (e) {
        console.error("Error fetching writer name:", e);
      }
    };
    fetchWriterName();
  }, []);
  const handleLogout = async () => {
    try {
      const response = await fetch("https://back-writer.onrender.com/logout", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      localStorage.removeItem("profileImage");
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  return (
    <div className="flex md:space-x-4 space-x-1.5 md:gap-10  items-center  md:mr-10">
      <Link
        href={"/login"}
        onClick={handleLogout}
        className="  text-white font-bold  hover:text-blue-500"
      >
        <LogoutTwoToneIcon sx={{ fontSize: 30 }} />
      </Link>
      <Link
        href={`/${userData.role}/alert`}
        className="  text-white font-bold  hover:text-blue-500"
      >
        <NotificationsNoneIcon sx={{ fontSize: 30 }} />
      </Link>
      <Link
        href={`/${userData.role}/settings`}
        className=" border-blue-600 p-2 rounded-2xl flex gap-2 items-center justify-center  border-2 hover:text-blue-700"
      >
        {userData.name} ال
        {userData.role === "reader"
          ? "قارئ"
          : userData.role === "writer"
            ? "كاتب"
            : ""}
        <Avatar alt={userData.name} src={userData.image||""} />
      </Link>
    </div>
  );
}
