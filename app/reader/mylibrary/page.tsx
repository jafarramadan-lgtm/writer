"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function MyLibrary() {
  const [favourites, setFavourites] = useState<
    { title: string; _id: string; Image: string; description: string }[]
  >([]);
  useEffect(() => {
    const fetchFavourites = async () => {
      const res = await fetch(
        "https://back-writer.onrender.com/reader/getFavouriteStories",
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setFavourites(data.favourites);
    };
    fetchFavourites();
  }, []);
  return (
    <div className="flex h-full w-full     flex-col text-white items-center justify-start gap-5 font-sans ">
      <h1 className="text-3xl font-bold">مكتبتي</h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {favourites.map((fav) => (
          <div
            key={fav._id}
            className="w-64 bg-gray-700 rounded-lg overflow-hidden"
          >
            <Image
              src={fav?.Image || "/back.png"}
              alt={fav.title}
              width={256}
              height={160}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              {fav.title}
              <p className="text-gray-400 text-sm mt-2">{fav.description}</p>
              <a
                href={`/reader/story/${fav._id}`}
                className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                اقرأ الآن
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
