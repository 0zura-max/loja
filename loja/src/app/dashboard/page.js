"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/lib/auth";

export default function DashboardPage() {
  const { token, userName } = useAuth();
  const router = useRouter();
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (!token || !userName) {
      return; 
    }

    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [token, userName]);

  if (!token || !userName) {
    return null;
  }

  return (
    <div className={`h-screen flex ${isVertical ? "flex-col" : "flex-row"} relative`}>
      <div
        className="flex-1 flex items-center justify-center cursor-pointer relative transition"
        onClick={() => router.push("/clientes")}
        style={{
          backgroundImage: "url('/Clientes.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-50 transition"></div>

        <div className="relative z-10 bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 pointer-events-none">
          <span className="text-gray-800 text-2xl font-bold">Ver Clientes</span>
          <span className="text-gray-600 text-2xl font-bold">➝</span>
        </div>
      </div>

      <div
        className={`bg-white absolute ${isVertical ? "w-full h-[5px] top-1/2 left-0 -translate-y-1/2" : "h-full w-[5px] left-1/2 top-0 -translate-x-1/2"}`}
      ></div>

      <div
        className="flex-1 flex items-center justify-center cursor-pointer relative transition"
        onClick={() => router.push("/produtos")}
        style={{
          backgroundImage: "url('/Produtos.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-50 transition"></div>

        <div className="relative z-10 bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 pointer-events-none">
          <span className="text-gray-800 text-2xl font-bold">Ver Produtos</span>
          <span className="text-gray-600 text-2xl font-bold">➝</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-2xl border-[2px] border-gray-300">
          <p className="text-gray-800 text-2xl font-bold tracking-wide text-center">
            Olá {userName}, o que você deseja ver?
          </p>
        </div>
      </div>
    </div>
  );
}