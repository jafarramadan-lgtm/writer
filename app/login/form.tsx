"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

export default function Form() {
  const route = useRouter();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://back-writer.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
       setMessage("تم تسجيل الدخول بنجاح!");
      setSeverity("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        if (data.role === "writer") route.push("/writer");
        else if (data.role === "reader") route.push("/reader");
      }, 2000);
    } else {
      setMessage("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
      setSeverity("error");
      setShowAlert(true);
    
    }
  };
  return (
    <form
      className="flex flex-col items-center    p-6     "
      onSubmit={handleSubmit}
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
      <hr className="w-full  m-4 text-purple-400 " />

      <input
        type="email"
        required
        placeholder="البريد الإلكتروني"
        className="mb-4 p-2 border rounded"
        minLength={5}
        maxLength={50}
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
      <button
        type="submit"
        className="bg-yellow-400 text-black font-bold cursor-pointer px-4 py-2 rounded hover:bg-yellow-500 transition-colors duration-300"
      >
        تسجيل الدخول
      </button>
    </form>
  );
}
