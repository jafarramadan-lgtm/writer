"use client";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

import Link from "next/link";
export default function Writer() {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);

  const route = useRouter();
  const [data, setData] = useState({
    userstories: null,
    liveSessions: null,
    readingEvaluation: null,
    stories: [],
  });
  useEffect(() => {
    const res = async function fetchData() {
      const response = await fetch(
        "https://back-writer.onrender.com/writer/homePageWriter",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();
      setData(data);
    };
    res();
  }, []);
  const [createDiv, setCreateDiv] = useState("none");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    keywords: "",
    isPublic: false,
    useAI: false,
  });
  return (
    <div className="flex h-full w-full p-4     font-bold flex-col text-white relative items-center justify-start   gap-2  font-sans ">
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
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const response = await fetch(
            "https://back-writer.onrender.com/writer/createStory",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(formData),
            },
          );

          if (response.ok) {
            setShowAlert(true);
            setMessage("تم انشاء الرواية بنجاح!");
            setSeverity("success");
            const d = await response.json();
            setData(d.data);
            setFormData({
              title: "",
              description: "",
              category: "",
              keywords: "",
              isPublic: false,
              useAI: false,
            });
            setCreateDiv("none");
            setTimeout(() => {
              route.push(`/writer/story/${d.data.storyId}`);
              setShowAlert(false);
            }, 2000);
          } else {
            setShowAlert(true);
            setMessage("حدث خطأ أثناء انشاء الرواية. حاول مرة أخرى.");
            setSeverity("error");
          
          }
        }}
        className={`${createDiv === "none" ? "hidden" : " flex flex-col p-4  justify-center items-center  absolute top-0 left-0 h-full w-full rounded-2xl bg-black  z-20 opacity-70"}`}
      >
        <div className="flex justify-center items-center">
          {" "}
          <input
            className="text-center m-3 p-4 border-2 font-bold text-xl rounded-2xl bg-purple-900  shadow-2xl "
            maxLength={30}
            minLength={4}
            name="title"
            required
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="اسم الرواية"
          />
          <label>اسم الرواية</label>
        </div>
        <div className="flex justify-center items-center">
          <input
            type="text"
            required
            name="description"
            placeholder="وصف الرواية"
            className="text-center m-3 p-4 border-2 font-bold text-xl  rounded-2xl bg-purple-900 shadow-2xl "
            maxLength={200}
            minLength={10}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <label>وصف الرواية</label>
        </div>
        <div className="flex justify-center items-center">
          {" "}
          <select
            className="text-center m-3 p-4 border-2 font-bold text-xl  bg-purple-900  shadow-2xl "
            name="category"
            required
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">اختر التصنيف</option>
            <option value="fantasy">خيال</option>
            <option value="romance">رومانسية</option>
            <option value="mystery">غموض</option>
            <option value="science-fiction">خيال علمي</option>
            <option value="horror">رعب</option>
            <option value="historical">تاريخي</option>
            <option value="adventure">مغامرة</option>
            <option value="thriller">إثارة</option>
            <option value="other">أخرى</option>
          </select>
          <label>التصنيف</label>
        </div>
        <div className="flex justify-center items-center">
          {" "}
          <input
            type="text"
            name="keywords"
            required
            placeholder="كلمات مفتاحية"
            value={formData.keywords}
            onChange={(e) =>
              setFormData({ ...formData, keywords: e.target.value })
            }
            className="text-center m-3 p-4 border-2 font-bold text-xl  rounded-2xl bg-purple-900  shadow-2xl "
            maxLength={100}
            minLength={5}
          />
          <label>كلمات مفتاحية</label>
        </div>
        <div className="flex justify-center items-center">
          <input
            name="useAI"
            checked={formData.useAI}
            onChange={(e) =>
              setFormData({ ...formData, useAI: e.target.checked })
            }
            type="checkbox"
            className="text-center m-3 p-4 border-2 font-bold text-xl  rounded-2xl bg-blue-400  shadow-2xl "
            id="useAI"
          />
          <label htmlFor="useAI">هل تريد مساعدة من الذكاء الاصطناعي ؟</label>
        </div>
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            className="text-center m-3 p-4 border-2 font-bold text-xl  rounded-2xl bg-blue-400  shadow-2xl "
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
          />
          <label htmlFor="isPublic">هل تريد جعل الرواية عامة ؟</label>
        </div>
        <button
          className="border-2 mb-4 border-purple-900 shadow-indigo-700 shadow-2xl cursor-pointer hover:bg-purple-700 transition-all delay-75 rounded-2xl text-center bg-purple-800 text-2xl text-white w-1/2 h-fit  p-2"
          type="submit"
        >
          انشاء
        </button>

        <button
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              category: "",
              keywords: "",
              isPublic: false,
              useAI: false,
            });
            setCreateDiv("none");
          }}
          type="button"
          className="border-2 w-1/2 border-purple-900 shadow-indigo-700 shadow-2xl cursor-pointer hover:bg-purple-700 transition-all delay-75 rounded-2xl text-center bg-purple-800 text-2xl text-white  h-fit  p-2"
        >
          الغاء
        </button>
      </form>
      <section
        className={`w-full relative z-10 h-fit gap-5 flex  md:flex-col md:flex-row items-center justify-around ${createDiv !== "none" ? "blur-2xl" : ""}`}
      >
        <div className="flex h-50 bg-[url(/card1.png)] gap-3 w-80 rounded-2xl text-2xl flex-col items-center justify-start p-4">
          القصص المنشورة
          <h2 className="mt-3">{data.userstories}</h2>
        </div>
        <div className="flex h-50 bg-[url(/card1.png)] gap-3 w-80 rounded-2xl text-2xl flex-col items-center justify-start p-4">
          الجلسات الحية
          <h2 className="mt-3">{data.liveSessions}</h2>
        </div>
        <div className="flex h-50 bg-[url(/card1.png)] gap-3 w-80 rounded-2xl text-2xl flex-col items-center justify-start p-4">
          تقييم القراءة
          <h2 className="mt-3">{data.readingEvaluation}</h2>
        </div>
      </section>{" "}
      <button
        onClick={() => {
          setCreateDiv("block");
        }}
        className={` ${createDiv !== "none" ? "blur-2xl" : ""} border-2 relative z=10 border-purple-900 shadow-indigo-700 shadow-2xl cursor-pointer hover:bg-purple-700 transition-all delay-75 rounded-2xl text-center bg-purple-600 text-2xl text-white w-10/12 h-fit  p-2`}
      >
        انشاء غرفة جديدة +
      </button>
      {data.stories?.length > 0 ? (
        <section className="w-full  h-7/12 gap-5 flex flex-wrap overflow-auto  items-center justify-center">
          {data.stories.map(
            (story: {
              _id: string;
              title: string;
              description: string;
              totalRatings: number;
              averageRating: number;
            }) => (
              <Link
                href={`/writer/story/${story._id}`}
                key={story._id}
                className="flex h-50 bg-[url(/card1.png)] gap-3 w-80 rounded-2xl text-2xl flex-col items-center justify-start p-4"
              >
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <p>
                  عدد التقييمات {story.totalRatings} <AccessibilityNewIcon />
                </p>
                <p>
                  متوسط التقييمات {story.averageRating}{" "}
                  <HotelClassIcon className="text-yellow-300 " />
                </p>
              </Link>
            ),
          )}
        </section>
      ) : (
        ""
      )}
    </div>
  );
}
