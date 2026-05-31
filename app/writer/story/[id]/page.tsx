"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Scenes from "../../../component/scenes";
import Alert from "@mui/material/Alert";

interface NextScene {
  title: string;
}
interface dataInterface {
  title: string;
  content: string;
  isEnd: boolean;
  nextScenes: NextScene[];
  idstory: string;
}
export default function PageOfStory() {
    const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [Scene, setScenes] = useState<
    { [name: string]: string; _id: string }[]
  >([]);
  const [story, setStory] = useState<{ [name: string]: string | boolean }>({});
  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(
          `https://back-writer.onrender.com/writer/getScenes/${params.id}`,
          { credentials: "include" },
        );
        if (response.ok) {
          const result = await response.json();
          setScenes(result.scenes);
          setStory(result.story);
        }
      } catch (error) {
        console.error("Error fetching scenes:", error);
      }
    };
    fetchScenes();
  }, []);

  const params = useParams();
  const [data, setData] = useState<dataInterface>({
    title: "",
    content: "",
    isEnd: false,
    nextScenes: [],
    idstory: String(params.id),
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (story.finished) {
      setMessage("القصة منتهية حررها لاضافة مشهد جديد")
      setShowAlert(true)
      setSeverity("error")
      return;
    } else {
      try {
        const response = await fetch(
          "https://back-writer.onrender.com/writer/CreateScene",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          },
        );
        if (response.ok) {
          const result = await response.json();
          setData({
            title: "",
            content: "",
            isEnd: false,
            nextScenes: [],
            idstory: String(params.id),
          });
          setScenes(result.scenes);
        } else {
          console.error("Failed to create scene");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [arrayforchoise, setarrayforchoise] = useState<{ title: "" }[]>([
    { title: "" },
  ]);
  const arrayforchoiseMap = arrayforchoise.map((item, index) => {
    return (
      <div
        key={index}
        className=" flex gap-4 w-full text-sm flex-col md:flex-row-reverse items-center justify-center md:p-4 p-3 bg-gray-400 rounded-2xl "
      > 
        <p>الخيار {index + 1}</p> <label>اسم المشهد التالي</label>
        <input
          name="nameScene"
          value={data.nextScenes[index]?.title || ""}
          onChange={(e) => {
            const newNextScenes = [...data.nextScenes];
            newNextScenes[index] = {
              ...(typeof newNextScenes[index] === "object" &&
              newNextScenes[index] !== null
                ? newNextScenes[index]
                : { title: "" }),
              title: e.target.value,
            };
            setData({ ...data, nextScenes: newNextScenes });
          }}
          placeholder="اسم المشهد التالي"
          className="text-black bg-white text-center rounded-2xl text-md"
        />
      </div>
    );
  });
  return (
    <div className="w-full h-full flex  flex-row  bg-gray-200 ">
     <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-l  h-full overflow-auto from-[#412e10] to-[#f0c47d]    w-9/12 flex flex-col items-end p-3 gap-5"
      > {showAlert && (
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
        <section className="flex gap-2 hover:bg-white/15  bg-white/5 rounded-2xl p-2 backdrop:blur-md transition-all duration-300 border border-white/10">
          <input
            name="nameScene"
            placeholder="اسم المشهد"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className=" shadow-2xl text-center rounded-2xl text-lg"
          />
          <label>اسم المشهد</label>
        </section>
        <textarea
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          name="contentScene"
          placeholder="محتوى المشهد"
          className="     hover:bg-white/15 bg-white/5  rounded-2xl text-lg w-full max-h-80 p-4  -none text-right align-top backdrop:blur-md transition-all duration-300"
        />{" "}
        <div className="flex items-center gap-2 ">
          <label htmlFor="isEnd">هل هذا المشهد نهاية القصة؟</label>

          <input
            type="checkbox"
            id="isEnd"
            name="isEnd"
            checked={data.isEnd}
            onChange={(e) => setData({ ...data, isEnd: e.target.checked })}
          />
        </div>
      
        {data.isEnd ? (
          <p className="text-red-500 text-lg">هذا المشهد نهاية القصة</p>
        ) : (
          <section className="flex backdrop:blur-md transition-all duration-300 flex-col items-end w-full hover:bg-white/15 bg-white/5  rounded-2xl  gap-2 p-5">
            <p>خيارات </p>
            <div className=" w-full gap-2 bg-amber-200 grid  sm:grid-cols-3 p-2 lg:grid-cols-2  gird-cols-3 ">
              {" "}
              {arrayforchoiseMap}
            </div>
            <select
              name="choiseToDelete"
              onChange={(e) => {
                if (
                  e.target.value === "اختر المشهد الذ تريد حذفه" ||
                  arrayforchoise.length === 1
                )
                  return;
                const index = parseInt(e.target.value);
                setarrayforchoise(
                  arrayforchoise.filter((item, i) => i !== index),
                );
              }}
              className="text-black bg-white text-center rounded-2xl text-lg w-full h-10"
            >
              <option>اختر المشهد الذ تريد حذفه</option>
              {arrayforchoise.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    الخيار {index + 1}
                  </option>
                );
              })}
            </select>{" "}
            <button
              onClick={() => {
                if (arrayforchoise.length > 2) return;
                setarrayforchoise([...arrayforchoise, { title: "" }]);
              }}
              className="bg-gradient-to-l from-[#36a7c9] to-[#2d4f7f] w-full h-10 rounded-md text-white"
              type="button"
            >
              اضافة خيار جديد
            </button>
          </section>
        )}
        <button
          type="submit"
          className="w-4/12 p-4 bg-gradient-to-l from-[#36a7c9] to-[#2d4f7f] rounded-2xl hover:bg-blue-300 transition-colors delay-75 text-bold cursor-pointer"
        >
          انشاء المشهد
        </button>
      </form>
      <Scenes setShowAlert={setShowAlert} scenes={Scene} setScenes={setScenes} setStory={setStory} />
    </div>
  );
}
