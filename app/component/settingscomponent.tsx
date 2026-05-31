"use client";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
export default function SettingsComponent() {
  const [dataEditePassword, setDataEditePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [editeName, setEditeName] = useState({
    newName: "",
    password: "",
  });
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  return (
    <div className="w-full h-11/12   flex flex-col flex-1  gap-2  text-white font-sans ">
      {showAlert && (
        <Alert
          variant="filled"
          severity={alertSeverity}
          className="w-fit"
          onClose={() => {
            setShowAlert(false);
          }}
        >
          {alertMessage}
        </Alert>
      )}
      <h1 className="text-2xl font-bold">Settings </h1>
      <div className="w-full h-10/12    flex flex-col md:flex-row mb-70  justify-center items-center md:items-start md:justify-start gap-2 p-4 ">
        <form className=" m-4  w-fit  gap-3   flex flex-col  ">
          <p className="relative ">Edit Image</p>
          <div className="relative   ">
            <div className="       ">
              <Avatar
                sx={{ width: 64, height: 64 }}
                src={localStorage.getItem("profileImage") || ""}
              />
            </div>
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
                const res = await fetch(
                  "https://back-writer.onrender.com/settings/uploadImage",
                  {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                  },
                );
                const data = await res.json();

                localStorage.setItem("profileImage", data.Imageurl);
              }}
            />

            <label htmlFor="cover-upload">
              <span
                className="absolute top-8 left-9  bg-opacity-50 rounded-full p-1 hover:bg-opacity-80 transition cursor-pointer"
                title="تعديل صورة الغلاف"
              >
                <EditIcon className="text-red-600 " />
              </span>
            </label>
          </div>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch(
              "https://back-writer.onrender.com/settings/changePassword",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(dataEditePassword),
              },
            );
            const data = await response.json();
            if (response.ok) {
              setAlertMessage("تم تعديل كلمة المرور بنجاح!");
              setAlertSeverity("success");
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
              }, 2000);
              setDataEditePassword({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            } else {
              setAlertMessage(
                data.message ||
                  "حدث خطأ أثناء تعديل كلمة المرور. حاول مرة أخرى.",
              );
              setAlertSeverity("error");
              setShowAlert(true);
            }
          }}
          className="w-full h-full flex flex-col items-start justify-start gap-2 "
        >
          <p>Edit Password</p>
          <input
            required
            minLength={6}
            maxLength={20}
            type="password"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder="Old Password"
            value={dataEditePassword.oldPassword}
            onChange={(e) =>
              setDataEditePassword({
                ...dataEditePassword,
                oldPassword: e.target.value,
              })
            }
          />
          <input
            required
            minLength={6}
            maxLength={20}
            type="password"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder="  New Password"
            value={dataEditePassword.newPassword}
            onChange={(e) =>
              setDataEditePassword({
                ...dataEditePassword,
                newPassword: e.target.value,
              })
            }
          />
          <input
            required
            minLength={6}
            maxLength={20}
            type="password"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder="Confirm New Password"
            value={dataEditePassword.confirmNewPassword}
            onChange={(e) =>
              setDataEditePassword({
                ...dataEditePassword,
                confirmNewPassword: e.target.value,
              })
            }
          />
          <button className="w-full p-2 rounded-md bg-red-500 text-white font-bold cursor-pointer">
            Edit Password
          </button>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch(
              "https://back-writer.onrender.com/settings/editeName",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(editeName),
              },
            );
            const data = await response.json();
            if (response.ok) {
              setAlertMessage("تم تعديل الاسم بنجاح!");
              setAlertSeverity("success");
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
              }, 2000);
              setEditeName({ newName: "", password: "" });
            } else {
              setAlertMessage(
                data.message || "حدث خطأ أثناء تعديل الاسم. حاول مرة أخرى.",
              );
              setAlertSeverity("error");
              setShowAlert(true);
            }
          }}
          className="w-full h-full flex flex-col items-start justify-start gap-2 "
        >
          <p>Edit Name</p>
          <input
            value={editeName.newName}
            onChange={(e) => {
              setEditeName({ ...editeName, newName: e.target.value });
            }}
            type="text"
            required
            minLength={3}
            maxLength={20}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder=" New Name"
          />
          <input
            value={editeName.password}
            onChange={(e) => {
              setEditeName({ ...editeName, password: e.target.value });
            }}
            required
            minLength={6}
            maxLength={20}
            type="password"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder=" Password"
          />

          <button
            type="submit"
            className="w-full p-2 rounded-md bg-red-500 text-white font-bold cursor-pointer"
          >
            Edit Name
          </button>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch(
              "https://back-writer.onrender.com/settings/deleteAccount",
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ password: passwordForDelete }),
              },
            );
            const data = await response.json();
            if (response.ok) {
              setShowAlert(true);
              setAlertMessage("تم حذف الحساب بنجاح!");
              setAlertSeverity("success");
              setTimeout(() => {
                setShowAlert(false);
              }, 2000);
              setPasswordForDelete("");
            } else {
              setShowAlert(true);
              setAlertMessage(
                "حدث خطأ أثناء حذف الحساب. تأكد من صحة كلمة المرور وحاول مرة أخرى.",
              );
              setAlertSeverity("error");
            }
          }}
          className="w-full h-full flex flex-col items-start justify-start gap-2 "
        >
          <p>Delete Account</p>
          <input
            value={passwordForDelete}
            onChange={(e) => {
              setPasswordForDelete(e.target.value);
            }}
            required
            minLength={6}
            maxLength={20}
            type="password"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
            placeholder=" Password"
          />
          <button className="w-full p-2 rounded-md bg-red-500 text-white font-bold cursor-pointer">
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}
