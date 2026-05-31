"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

export default function Form() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setShowAlert(true);
      setMessage("كلمتا المرور غير متطابقتين.");
      setSeverity("error");
      return;
    }
    const response = await fetch("https://back-writer.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();

      setShowAlert(true);
      setMessage("تم التسجيل بنجاح!");
      setSeverity("success");
      setTimeout(() => {
        setShowAlert(false);
        if (data.role === "writer") router.push("/writer");
        else if (data.role === "reader") router.push("/reader");
        else alert("حدث خطأ في تحديد الدور. حاول تسجيل الدخول مرة أخرى.");
      }, 2000);
    } else {
      setShowAlert(true);
      setMessage("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
      setSeverity("error");
    
    }
  };
  return (
    <form
      className="flex flex-col text-white items-center"
      onSubmit={handleSubmit}
    >
      {" "}
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
      <hr className="w-full  m-4 text-purple-400 " />
      <input
        type="text"
        required
        minLength={3}
        maxLength={20}
        placeholder="اسم المستخدم"
        className="mb-4 p-2 border rounded"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="email"
        required
        minLength={5}
        maxLength={50}
        placeholder="البريد الإلكتروني"
        className="mb-4 p-2 border rounded"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        required
        minLength={6}
        maxLength={20}
        placeholder="كلمة المرور"
        className="mb-4 p-2 border rounded"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="password"
        required
        minLength={6}
        maxLength={20}
        placeholder="كلمة المرور مرة أخرى"
        className="mb-4 p-2 border rounded"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />
      <select
        required
        name="role"
        className="mb-4 p-2 bg-black border rounded"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="">اختر دورك</option>
        <option value="reader">قارئ</option>
        <option value="writer">كاتب</option>
      </select>
      <button
        type="submit"
        className="bg-yellow-400 text-black font-bold cursor-pointer px-4 py-2 rounded hover:bg-yellow-500 transition-colors duration-300"
      >
        تسجيل
      </button>
    </form>
  );
}
