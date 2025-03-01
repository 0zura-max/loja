"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Header from "@/components/header";
import DataTable from "@/components/datatable";
import useAuth from "@/lib/auth";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const router = useRouter();

  const { token, userName } = useAuth();
    if (!token || !userName) {
      return null;
    }

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await api.get("/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  const handleDeleteClick = (produto) => {
    setProdutoSelecionado(produto);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!produtoSelecionado) return;
    try {
      await api.delete(`/produtos/${produtoSelecionado.codigo}`);
      setProdutos(produtos.filter((p) => p.codigo !== produtoSelecionado.codigo));
      setModalOpen(false);
      setProdutoSelecionado(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "descricao", label: "Descrição" },
    { key: "codigoBarras", label: "Código de Barras" },
    { key: "valorVenda", label: "Valor de Venda", render: (p) => `R$ ${p.valorVenda.toFixed(2)}` },
    { key: "pesoBruto", label: "Peso Bruto", render: (p) => `${p.pesoBruto.toFixed(2)} kg` },
    { key: "pesoLiquido", label: "Peso Líquido", render: (p) => `${p.pesoLiquido.toFixed(2)} kg` },
  ];

  return (
    <div className=" p-6 w-full min-w-min min-h-min">
      <Header title="📦 Produtos" buttonLabel="+ Criar Produto" onButtonClick={() => router.push("/produtos/novo")} backurl={'dashboard'}/>

      {loading ? <p className="text-gray-500 mt-6 text-center">Carregando...</p> : 
        <DataTable columns={columns} data={produtos} onEdit={(p) => router.push(`/produtos/editar/${p.codigo}`)} onDelete={handleDeleteClick} />
      }

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Confirmar Exclusão</h2>
            <p className="mt-2">Tem certeza que deseja excluir o produto "{produtoSelecionado?.descricao}"?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}