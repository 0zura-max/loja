"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Form from "@/components/form";
import { toast } from "react-hot-toast";
import useAuth from "@/lib/auth"; 

export default function ClienteForm({ clienteId }) {
  const router = useRouter();
  const isEditing = Boolean(clienteId);

  const { token, userName } = useAuth();
  
  if (!token || !userName) {
    return null;
  }

  const [cliente, setCliente] = useState(() =>
    isEditing
      ? { codigo: "", nome: "", fantasia: "", documento: "", endereco: "" }
      : { nome: "", fantasia: "", documento: "", endereco: "" }
  );

  useEffect(() => {


    if (isEditing) {
      api
        .get(`/clientes/${clienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setCliente(response.data))
        .catch(() => toast.error("Erro ao buscar cliente"));
    }
  }, [clienteId, isEditing, token, userName]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const cleanedCpf = cliente.documento.replace(/\D/g, "");

      const payload = { ...cliente, documento: cleanedCpf, usuarioNome: userName };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing) {
        await api.put(`/clientes/${clienteId}`, payload, config);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await api.post("/clientes", payload, config);
        toast.success("Cliente cadastrado com sucesso!");
      }

      router.push("/clientes");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        toast.error(`Dados inválidos.${data}`);
      } else {
        console.error("Erro ao salvar cliente:", error);
        toast.error("Erro ao salvar cliente. Tente novamente.");
      }
      
    }
  };

  const fields = [
    ...(isEditing
      ? [{ name: "codigo", label: "Código", required: true, type: "number", disabled: true }]
      : []),
    { name: "nome", label: "Nome", required: true },
    { name: "fantasia", label: "Nome Fantasia", required: true },
    { name: "documento", label: "Documento (CPF)", required: true },
    { name: "endereco", label: "Endereço", required: true },
  ];


  return (
    <>
      <Form
        title={isEditing ? "✏️ Editar Cliente" : "🆕 Criar Cliente"}
        fields={fields}
        values={cliente}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}