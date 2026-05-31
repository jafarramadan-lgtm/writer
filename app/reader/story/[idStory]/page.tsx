"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import HoverRating from "../../../component/Raiting";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import Alert from "@mui/material/Alert";

import Image from "next/image";
export default function Story() {
  const [myScene, setMyscene] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [story, setStory] = useState<{ [name: string]: string }>({});
  const [scene, setScene] = useState<{
    title: string;
    content: string;
    choices: { id: string; title: string }[];
    id: string;
  }>({ title: "", content: "", choices: [], id: "" });
  const [favourite, setFavourite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const params = useParams();
  useEffect(() => {
    const fetchStory = async () => {
      const res = await fetch(
        `https://back-writer.onrender.com/reader/getStory/${params.idStory}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setStory(data.story);
      setScene(data.scene);
      setMyscene([...myScene, data.scene._id]);
      setRating(data.rating);
      setFavourite(data.favourite);
    };
    fetchStory();
  }, []);

  return (
    <div className="flex h-full w-full     flex-col text-white items-center justify-start gap-5 font-sans ">
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
      <div className="flex h-fit w-full  md:flex-row lg:flex-row flex-col  text-white items-center md:items-start justify-center gap-5 font-sans ">
        <Image
          alt="غلاف القصة"
          src={story.Image || "/back.png"}
          width={300}
          height={300}
        />
        <section className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <p className="text-gray-400">{story.category}</p>
          <p className="text-gray-400">{story.description}</p>
          <p className="text-gray-400">بقلم: {story.nameWriter}</p>
          <p>
            {" "}
            <HotelClassIcon className="text-yellow-300 m-3" />
            متوسط التقييمات {story.averageRating}
          </p>
          <button
            onClick={() => {
              setIsPlaying(true);
            }}
            className={`${!isPlaying ? "bg-purple-600 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"} text-white font-bold py-2 px-4 rounded transition-colors delay-200`}
          >
            ابدأ القراءة
          </button>
          <button
            onClick={async () => {
              const res = await fetch(
                `https://back-writer.onrender.com/reader/appendToFavourite/${params.idStory}`,
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
                setFavourite(!favourite);
                setShowAlert(true);
                setMessage(data.message);
                setSeverity("success");
                setTimeout(() => {
                  setShowAlert(false);
                }, 2000);
              } else {
                setShowAlert(true);
                setSeverity("error");
                setMessage("حدث خطأ. حاول مرة أخرى.");
              }
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            {favourite ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
          </button>
          <a
            onClick={async () => {
              try {
                fetch(
                  `https://back-writer.onrender.com/reader/getstoryAll/${params.idStory}`,
                  {
                    method: "GET",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                )
                  .then((res) => res.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${story.title}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  });
              } catch (error) {
                console.error("Error exporting path:", error);
              }
            }}
            className="text-blue-500 cursor-pointer hover:text-blue-700"
          >
            تصدير القصة كاملة
          </a>
          <HoverRating rating={rating} setRating={setRating} />
        </section>
      </div>
      {isPlaying ? (
        <div className="w-full flex flex-col gap-2 pb-7 items-end">
          <p className="w-8/12 text-3xl font-bold text-end"> : مشاهد القصة</p>
          <div className="w-full h-70 overflow-auto flex flex-col justify-start gap-3 items-end p-4  bg-white/50">
            <h1>{scene.title}</h1>
            <h2 className="overflow-auto text-wrap font-bold text-black text-2xl">
              {scene.content}
            </h2>
            {scene.choices.length === 0 && (
              <div>
                <p className="w-full text-center font-bold text-black">
                  نهاية القصة. شكراً للقراءة!
                </p>
                <button
                  onClick={async () => {
                    try {
                      fetch(`https://back-writer.onrender.com/reader/getMyStory`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ myScene }),
                      })
                        .then((res) => res.blob())
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${story.title}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        });
                    } catch (error) {
                      console.error("Error exporting path:", error);
                    }
                  }}
                  className="text-red-500 w-full text-center   font-bold text-xl hover:text-red-700"
                >
                  تصدير مساري الخاص
                </button>
              </div>
            )}
          </div>{" "}
          <div className="w-full  flex  justify-center gap-3 items-center p-4 pb-30 md:pb-4 ">
            {scene.choices.map((e: { id: string; title: string }) => (
              <button
                key={e.id}
                onClick={async () => {
                  const res = await fetch(
                    `https://back-writer.onrender.com/reader/getScene/${e.id}`,
                    {
                      method: "GET",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    },
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setScene(data.scene);
                    setMyscene([...myScene, data.scene._id]);
                  } else {
                    setShowAlert(true);
                    setMessage("حدث خطأ. حاول مرة أخرى.");
                    setSeverity("error");
                  }
                }}
                className=" text-white font-bold py-2 px-4 rounded"
              >
                {e.title}
              </button>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
