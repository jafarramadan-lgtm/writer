"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { pink } from "@mui/material/colors";

export default function Reader() {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [writers, setWriters] = useState<
    { username: string; profilePicture: string; _id: string }[]
  >([]);
  const [folowers, setFolwers] = useState<string[]>([]);
  const [stories, setStories] = useState<
    { title: string; _id: string; idWriter: string; Image: string,description:string }[]
  >([]);
  useEffect(() => {
    try {
      const fun = async function fetchData() {
        const response = await fetch(
          "https://back-writer.onrender.com/reader/getTopStories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        setWriters(data.writers);
        setStories(data.stories);
        setFolwers(data.folowers);
      };
      fun();
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);
  const handleFollow = async (idWriter: string) => {
    try {
      const res = await fetch(
        "https://back-writer.onrender.com/reader/follow/" + idWriter,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (res.ok) {
        if (data.action === "follow") {
          setFolwers((prev) => [...prev, idWriter]);
        } else {
          setFolwers((prev) => prev.filter((id) => id !== idWriter));
        }
      } else {
        setMessage(data.message || "حدث خطأ. حاول مرة أخرى.");
        setSeverity("error");
        setShowAlert(true);
      }
    } catch (e) {
      setMessage("حدث خطأ. حاول مرة أخرى.");
      setSeverity("error");
      setShowAlert(true);
    }
  };
  return (
    <div className="flex h-full w-full     flex-col text-white items-center justify-start gap-5 font-sans ">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch(
              `https://back-writer.onrender.com/reader/searchStory?writer=${search}`,
              {
                credentials: "include",
              },
            );
            const data = await res.json();
            if (res.ok) {
              setStories(data.stories);
              setWriters(data.writers);
              setFolwers(data.folowers);
              setShowAlert(true);

              if (data.stories.length === 0 && data.writers.length === 0) {
                setMessage("لم يتم العثور على نتائج. حاول مرة أخرى.");
                setSeverity("error");
              } else {
                setMessage("تم العثور على النتائج!");
                setSeverity("success");
              }
              setTimeout(() => {
                setShowAlert(false);
              }, 2000);
            } else {
              setMessage("لم يتم العثور على نتائج. حاول مرة أخرى.");
              setShowAlert(true);
              setSeverity("error");
            }
          } catch (e) {
            setMessage("لم يتم العثور على نتائج. حاول مرة أخرى.");
            setShowAlert(true);
            setSeverity("error");
          }
        }}
      >
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
        <TextField
          id="filled-basic"
          label={<SearchIcon />}
          color={"success"}
          focused
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ input: { color: "white " } }}
          placeholder="........ابحث عن كاتبك"
        />
      </form>
      <div className=" flex w-full  flex-wrap gap-2 justify-center items-center">
        {writers?.map(
          (writer: {
            username: string;
            profilePicture: string;
            _id: string;
          }) => (
            <div key={writer._id} className="flex flex-col items-center  gap-2">
              <div className="flex  justify-between gap-3 items-center">
                {" "}
                <Avatar
                  alt={writer.username}
                  src={writer.profilePicture}
                  sx={{ width: 56, height: 56 }}
                />
                {folowers.includes(writer._id) ? (
                  <PersonRemoveOutlinedIcon
                    onClick={() => handleFollow(writer._id)}
                    className={
                      "text-pink-700 cursor-pointer hover:text-pink-400"
                    }
                  />
                ) : (
                  <AddCircleOutlinedIcon
                    onClick={() => handleFollow(writer._id)}
                    className="text-green-700 cursor-pointer hover:text-green-400"
                  />
                )}
              </div>{" "}
              <p>{writer.username}</p>
              <div className="flex flex-wrap gap-6 justify-center items-center  mb-30">
                {stories
                  .filter((story) => story.idWriter === writer._id)
                  .map((story) => (
                    <div
                      key={story._id}
            className="w-64 bg-gray-700 rounded-lg overflow-hidden"
                    >

                          <Image
                          src={story.Image || "/back.png"}
                          alt="غلاف القصة"
                                    width={256}
                                    height={160}
                                    className="w-full h-40 object-cover"
                                  />

                                  <div className="p-4">
                      {story.title}
              <p className="text-gray-400 text-sm mt-2">{story.description}</p>
              <a
                href={`/reader/story/${story._id}`}
                className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                اقرأ الآن
              </a>
            </div>
                      
                    </div>
                  ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
