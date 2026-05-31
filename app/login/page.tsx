import Image from "next/image";
import Form from "./form";
import Link from "next/link";
export default function Login() {
  return (
    <div className="flex bg-[url(/back.png)] flex-col flex-1 items-center justify-start  font-sans ">
      <Image
        src="/logo.png"
        alt="Login Image"
        width={150}
        height={150}
        className=" rounded-full mt-10"
      />

      <h1 className="text-4xl font-bold mb-2 text-yellow-400  ">
        تسجيل الدخول
      </h1>
      <Form />
      <Link
        href="/register"
        className="text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300 mt-4"
      >
        لا تملك حساب؟ تسجيل جديد
      </Link>
    </div>
  );
}
