"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function RefreshToken() {
  const router = useRouter();
  const refreshToken = async () => {
    try {
      const response = await fetch("https://back-writer.onrender.com/refreshtoken", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }
      
    } catch (e) {
      console.error("Error refreshing token:", e);
      router.push("/login");
    }
  };
  useEffect(() => {
    setInterval(refreshToken, 3300000);

  }, []);
  return null;
}
