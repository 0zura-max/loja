"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
  
    const endpoint = isRegister
      ? "https://localhost:7203/api/usuarios/criar"
      : "https://localhost:7203/api/usuarios/login";
  
    const payload = { nome, senha };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const responseText = await response.text(); 
  
      let data;
      try {
        data = JSON.parse(responseText); 
      } catch {
        data = { message: responseText };
      }
  
      if (!response.ok) {
        setMessage(data.message || "Erro ao processar a solicitação.");
        setIsLoading(false);
        return;
      }
  
      if (isRegister) {
        setMessage(data.message || "Usuário cadastrado com sucesso! Faça login.");
        setIsRegister(false);
      } else {
        Cookies.set("token", data.token, { expires: 1 });
        Cookies.set("user_name", nome, { expires: 1 });
        await router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      setMessage("Erro ao conectar ao servidor. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full h-full bg-gray-900 text-white flex flex-col justify-center items-center px-10">
        <h2 className="text-3xl font-bold mb-6">
          {isRegister ? "Cadastro" : "Bem-vindo de volta!"}
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-300 text-left mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-left mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-semibold p-3 rounded hover:bg-yellow-600 transition disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? "Aguarde..." : isRegister ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 ${message.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="mt-4 text-gray-400 text-sm">
          {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"} {" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsRegister(!isRegister);
              setMessage(""); 
            }}
            className="text-yellow-400 hover:underline"
          >
            {isRegister ? "Faça login" : "Cadastre-se"}
          </a>
        </p>
      </div>

      <div className="hidden md:block md:w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: "url('/background_login.jpg')" }}></div>
    </div>
  );
}