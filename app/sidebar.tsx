import Image from "next/image";
import SidebarComponent from "./component/sidebar";

export default function Sidebar() {
  return (
    <div className="flex    w-full h-2/12 text-white mt-5  md:p-4  items-center md:justify-between  font-sans ">
      <div className="flex md:space-x-4 md:ml-10  gap-0 items-center ">
        <h1 className="md:text-4xl text-2xl text-center text-wrap w-fit font-bold mb-2 p-0  m-0 text-yellow-400  ">
          الروائي التفاعلي
        </h1>
        <Image
          src="/logo.png"
          alt="Login Image"
          width={100}
          height={100}
          className=" rounded-full "
        />
      </div>
      <SidebarComponent />
    </div>
  );
}
