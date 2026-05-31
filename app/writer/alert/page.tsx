"use client";
import { useEffect, useState } from "react";
export default function Alert() {
  const [alert, setAlert] = useState<{ [name: string]: string }[]>([]);
  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const response = await fetch("https://back-writer.onrender.com/writer/getAlert", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
         setAlert(data.alerts);
         
      } catch (err) {
        console.error("Error fetching alert:", err);
      }
    };
     fetchAlert();
     const markAsRead = async () => {
      try {
        await fetch("https://back-writer.onrender.com/writer/readAlert", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      } catch (err) {
        console.log(err);
      }
    };
    return ()=>{
           markAsRead();

    }
  }, []);
   
  const datamap = alert.map((item, index) => {
    return (
      <div
        key={index}
        className={`${!item.isRead ? "bg-red-500" : "bg-green-500"} p-4 rounded-md w-full`}
      >
        <p className="text-lg text-center">{item.body}</p>
      </div>
    );
  });
  return (
    <div className="flex h-full w-full p-4 overflow-auto  flex-col  text-white items-center justify-start gap-2  font-sans ">
      {datamap.length > 0 ? (
        datamap
      ) : (
        <p className="text-lg">لا توجد تنبيهات حالياً.</p>
      )}
    </div>
  );
}
