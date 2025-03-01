"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Form from "@/components/form";
import { toast } from "react-hot-toast";
import useAuth from "@/lib/auth"; 

export default function ProdutoForm({ produtoId }) {
  const router = useRouter();
  const isEditing = Boolean(produtoId);

  const { token, userName } = useAuth();
if (!token || !userName) {
  return null;
}
  const [produto, setProduto] = useState(() =>
    isEditing
      ? { codigo: "", descricao: "", codigoBarras: "", valorVenda: "", pesoBruto: "", pesoLiquido: "" }
      : { descricao: "", codigoBarras: "", valorVenda: "", pesoBruto: "", pesoLiquido: "" }
  );

  useEffect(() => {
   
    if (isEditing) {
      api
        .get(`/produtos/${produtoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => setProduto(response.data))
        .catch(() => toast.error("Erro ao buscar produto"));
    }
  }, [produtoId, isEditing, token, userName]);

  const handleChange = (e) => {
    let { name, value, type } = e.target;

    if (type === "number") {
      value = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9{0,2}]).*$/, "$1");
    }

    setProduto({ ...produto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...produto, usuarioNome: userName }; 
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing) {
        await api.put(`/produtos/${produtoId}`, payload, config);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await api.post("/produtos", payload, config);
        toast.success("Produto cadastrado com sucesso!");
      }

      router.push("/produtos");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        toast.error(`Dados inválidos. ${data}`);
      } else {
        console.error("Erro ao salvar produto:", error);
        toast.error("Erro ao salvar produto. Tente novamente.");
      }
    }
  };

  const fields = [
    ...(isEditing
      ? [{ name: "codigo", label: "Código", required: true, format: "integer", disabled: true }]
      : []),
    { name: "descricao", label: "Descrição", required: true },
    { name: "codigoBarras", label: "Código de Barras", required: true, format: "integer" },
    { name: "valorVenda", label: "Valor de Venda", required: true, format: "decimal" },
    { name: "pesoBruto", label: "Peso Bruto (kg)", required: true, format: "decimal" },
    { name: "pesoLiquido", label: "Peso Líquido (kg)", required: true, format: "decimal" },
  ];

  

  return (
    <Form
      title={isEditing ? "✏️ Editar Produto" : "🆕 Criar Produto"}
      fields={fields}
      values={produto}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}