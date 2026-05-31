"use client";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";

import Link from "next/link";
export default function MyLibrary() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://back-writer.onrender.com/writer/getAllStories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const d = await response.json();

      setData(d.stories);
    };
    fetchData();
  }, []);
  return (
    <div className="w-full flex flex-col items-center justify-start gap-5 p-4  h-full">
      {showAlert && (
        <Alert
          variant="filled"
          severity={severity}
          className="w-fit"
          onClose={() => {
            setShowAlert(false);
          }}
        >
          {message}
        </Alert>
      )}
      <section className="w-full  h-full overflow-auto p-4 gap-5  flex flex-wrap items-center justify-start">
        {data?.length > 0
          ? data.map((story: { [name: string]: string }) => (
              <div key={story._id}>
                <Link
                  href={`/writer/story/${story._id}`}
                  className="flex h-50 bg-[url(/card1.png)] gap-3 w-80 rounded-2xl text-2xl flex-col items-center justify-start p-4"
                >
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const res = await fetch(
                        `https://back-writer.onrender.com/writer/deleteStory/${story._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        },
                      );
                      const data = await res.json();
                      if (res.status === 200) {
                        setData(data.stories);
                        setMessage("Story deleted successfully");
                        setSeverity("success");
                        setTimeout(() => {
                          setShowAlert(false);
                        }, 2000);
                        setShowAlert(true);
                      } else {
                        setMessage("Error deleting story");
                        setSeverity("error");
                        setShowAlert(true);
                      }
                    }}
                    className="bg-red-500  text-md p-2 rounded-2xl m-2 transition-colors duration-300 hover:bg-red-800    "
                  >
                    Delete
                  </button>{" "}
                </Link>
              </div>
            ))
          : ""}
      </section>
    </div>
  );
}
