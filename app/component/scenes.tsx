"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Alert from "@mui/material/Alert";

export default function Scenes({
  setShowAlert,
  scenes,
  setScenes,
  setStory,
}: {
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  scenes: { [name: string]: string; _id: string }[];
  setScenes: React.Dispatch<
    React.SetStateAction<{ [name: string]: string; _id: string }[]>
  >;
  setStory: React.Dispatch<
    React.SetStateAction<{ [name: string]: string | boolean }>
  >;
}) {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAler] = useState(false);
  const params = useParams();
  const [isEndingStory, setIsEndingStory] = useState(false);
  const [coverStory, setCoverStory] = useState("");
  useEffect(() => {
    const fetchfinised = async () => {
      try {
        const response = await fetch(
          `https://back-writer.onrender.com/writer/finishedStoryget/${params.id}`,
          { credentials: "include" },
        );
        if (response.ok) {
          const result = await response.json();
          setIsEndingStory(result.finished);
          setCoverStory(result.cover);
        }
      } catch (error) {
        setShowAlert(true);
        setMessage("حدث خطأ أثناء جلب بيانات القصة. حاول مرة أخرى.");
        setSeverity("error");
      }
    };
    fetchfinised();
  }, []);
  return (
    <div className="w-3/12 h-full flex items-center flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-l from-[#392f20]  to-[#ed9a16] p-4 transition-colors duration-300 ">
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
      <div className="flex cursor-pointer items-center gap-2 ">
        <input
          required
          type="file"
          accept="image/*"
          id="cover-upload"
          className="hidden"
          onChange={async (e) => {
            if (!e.target.files || e.target.files.length === 0) {
              console.log("No file selected");
              return;
            }
            const formData = new FormData();
            formData.append("image", e.target.files[0]);
            setCoverStory(URL.createObjectURL(e.target.files[0]));
            const res = await fetch(
              "https://back-writer.onrender.com/writer/CoverImage/" + params.id,
              {
                method: "POST",
                credentials: "include",
                body: formData,
              },
            );
            const data = await res.json();
            setCoverStory(data.Imageurl);
          }}
        />
        <label htmlFor="cover-upload" className="cursor-pointer">
          <Image
            alt="غلاف القصة"
            src={coverStory || "/back.png"}
            width={150}
            height={150}
            className="rounded-2xl border-2 border-gray-400"
          />
        </label>
      </div>

      {scenes?.map((scene) => (
        <Link
          href={
            !isEndingStory
              ? `/writer/story/${params.id}/${scene._id}`
              : `/writer/story/${params.id}/`
          }
          key={scene._id}
          className="p-4 w-full    text-center bg-white/20 font-bold        text-black rounded-2xl m-2 hover:bg-white/50 transition-colors duration-300"
        >
          <p className="text-wrap wrap-break-word">{scene.title}</p>
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const res = await fetch(
                `https://back-writer.onrender.com/writer/deleteScene/${scene._id}`,
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
                setScenes(data.scenes);
                setSeverity("success");
                setMessage("Scene deleted successfully");
                setShowAler(true);
                setTimeout(() => {
                  setShowAler(false);
                }, 2000);
              } else {
                setShowAler(true);
                setMessage("Error deleting scene");
                setSeverity("error");
                console.error("Error deleting scene", data.message);
              }
            }}
            className="bg-red-500    text-md p-2 rounded-2xl m-2 transition-colors duration-300 hover:bg-red-800    "
          >
            Delete
          </button>
        </Link>
      ))}
      <Link
        href={`/writer/story/${params.id}`}
        className="bg-green-300 p-4 rounded-2xl m-2 transition-colors duration-300 hover:bg-green-500 font-bold text-black"
      >
        + New Scene
      </Link>

      <button
        className={`${isEndingStory ? "bg-yellow-300 hover:bg-yellow-500" : "bg-green-300 hover:bg-green-500"} p-4 rounded-2xl m-2 transition-colors duration-300 font-bold text-black`}
        onClick={async () => {
          setShowAlert(false);
          const res = await fetch(
            `https://back-writer.onrender.com/writer/finishedStory/${params.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            },
          );
          const data = await res.json();
          if (res.status === 200) {
            setIsEndingStory(data.story.finished);
            setShowAler(false);
            setStory(data.story);
            setSeverity("success");
            setMessage("تم تحديث حالة القصة");
            setShowAler(true);
            setTimeout(() => {
              setShowAler(false);
            }, 2000);
          } else {
            setShowAler(true);
            setMessage("حدث خطا");
            setSeverity("error");
          }
        }}
      >
        {isEndingStory
          ? "القصة منهية انقر للسماح بالتعديل"
          : " انقر لانهاء القصة "}
      </button>
    </div>
  );
}
