import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex bg-[url(/back.png)] flex-col flex-1 items-center justify-center  font-sans">
      <Image
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        className="mb-4 rounded-full"
      />
      <h1 className="text-4xl font-bold mb-2 text-yellow-400  ">
        الروائي التفاعلي
      </h1>
      <p className="text-3xl text-gray-600 dark:text-gray-400">
        غرف حية الان
      </p>
      <div className="mt-6 flex space-x-4">
        <Link
        href="/register"
        className="text-lg hover:text-blue-600 text-white transition-colors duration-300"
      >
        ابدأ رحلتك
      </Link>
      <Link
        href="/login"
        className="text-lg hover:text-blue-600 text-white transition-colors duration-300"
      >
        تسجيل الدخول
      </Link>
      </div>
    </div>
  );
}
