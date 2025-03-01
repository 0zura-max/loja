"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Header({ title, buttonLabel, onButtonClick, backurl }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <div className="bg-gray-800 text-white p-6 shadow-lg rounded-lg flex flex-col items-center gap-4 md:flex-row md:justify-between">
      
      <h1 className="text-3xl font-bold text-center">{title}</h1>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => router.push(backurl)}
          className="bg-gray-600 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-700 transition shadow-md"
        >
          ←
        </button>
        <button
          onClick={handleLogout}
          className=" bg-red-500 px-6 py-2 text-lg rounded-lg font-semibold hover:bg-red-600 transition shadow-md"
        >
          Sair
        </button>
        {buttonLabel && (
          <button
            onClick={onButtonClick}
            className="bg-green-500 px-6 py-2 text-lg rounded-lg font-semibold hover:bg-green-600 transition shadow-md"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      
    </div>
  );
}
