"use client";
import Scenes from "../../../../component/scenes";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Alert from "@mui/material/Alert";

export default function PageOfScene() {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [dataScene, setdataScene] = useState<{
    title: string;
    content: string;
    choices: { title: string; content: string }[];
  }>({
    title: "",
    content: "",
    choices: [],
  });
  const [scenes, setScenes] = useState<
    { [name: string]: string; _id: string }[]
  >([]);
  const [story, setStory] = useState<{ [name: string]: string | boolean }>({});
  useEffect(() => {
    const fetchScenes = async () => {
      const res = await fetch(
        `https://back-writer.onrender.com/writer/getScenes/${params.id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setScenes(data.scenes);
      const s = data.scenes.find(
        (scene: { _id: string }) => scene._id === params.scene,
      );
      if (s) {
        setdataScene({
          title: s?.title,
          content: s?.content,
          choices: s?.choices,
        });
      }
    };

    fetchScenes();
  }, []);
  const params = useParams();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`https://back-writer.onrender.com/writer/updateScene`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idScene: params.scene,
        title: dataScene.title,
        content: dataScene.content,
        idStory: params.id,
        choices: dataScene.choices,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setShowAlert(true);
      setMessage(data.message);
      setSeverity("success");
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      setdataScene({
        title: data.scene.title,
        content: data.scene.content,
        choices: data.scene.choices,
      });
      setScenes(data.scenes);
    } else {
      setShowAlert(true);
      setMessage(data.message);
      setSeverity("error");
    }
  };

  return (
    <div className="w-full h-full  flex ">
      <form className="bg-[#0f172a] w-9/12 p-5 " onSubmit={onSubmit}>
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
        )}{" "}
        <input
          type="text"
          className="w-full border-2 h-10 rounded-2xl p-4"
          placeholder="اسم المشهد"
          value={dataScene.title}
          onChange={(e) =>
            setdataScene({ ...dataScene, title: e.target.value })
          }
        />
        <textarea
          className="w-full  max-h-80 border-2 rounded-2xl p-4 mt-4"
          value={dataScene.content}
          placeholder="محتوى المشهد"
          onChange={(e) =>
            setdataScene({ ...dataScene, content: e.target.value })
          }
        />
        <div>
          <p>المشهد التالي</p>
          {dataScene?.choices?.map((scene, index) => (
            <div key={index} className="flex gap-4 items-center">
              <p>الخيار {index + 1}</p>
              <input
                type="text"
                className="w-full border-2 h-10 rounded-2xl p-4"
                placeholder="اسم المشهد التالي"
                value={scene?.title || ""}
                onChange={(e) => {
                  const newChoices = [...dataScene.choices];
                  newChoices[index] = {
                    ...newChoices[index],
                    title: e.target.value,
                  };
                  setdataScene({ ...dataScene, choices: newChoices });
                }}
              />
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-2xl"
                onClick={() => {
                  const newChoices = [...dataScene.choices];
                  newChoices.splice(index, 1);
                  setdataScene({ ...dataScene, choices: newChoices });
                }}
              >
                حذف
              </button>
            </div>
          ))}

          {dataScene?.choices?.length < 3 && (
            <div>
              {" "}
              <p>اضافة مشهد جديد</p>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-2xl"
                onClick={() => {
                  const newChoices = [...dataScene.choices];
                  newChoices.push({ title: "", content: "" });
                  setdataScene({ ...dataScene, choices: newChoices });
                }}
              >
                اضافة مشهد
              </button>
            </div>
          )}
        </div>
        <button className="bg-gradient-to-l   from-[#412e10] to-[#f0c47d] hover:from-[#392f20]  hover:to-[#ed9a16] p-4 transition-colors duration-300 rounded-2xl mt-4">
          Save
        </button>
      </form>
      <Scenes
        scenes={scenes}
        setShowAlert={setShowAlert}
        setScenes={setScenes}
        setStory={setStory}
      />
    </div>
  );
}
