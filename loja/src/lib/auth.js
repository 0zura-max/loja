"use client"; 
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function useAuth(redirectIfUnauthenticated = true) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userName = Cookies.get("user_name");

    if (redirectIfUnauthenticated && (!token || !userName)) {
      router.push("/");
    }
  }, [router, redirectIfUnauthenticated]);

  return {
    token: Cookies.get("token"),
    userName: Cookies.get("user_name"),
  };
}