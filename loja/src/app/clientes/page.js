"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Header from "@/components/header";
import DataTable from "@/components/datatable";
import useAuth from "@/lib/auth";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const router = useRouter();
const { token, userName } = useAuth();
  
  if (!token || !userName) {
    return null;
  }
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await api.get("/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  const handleDeleteClick = (cliente) => {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteSelecionado) return;
    try {
      await api.delete(`/clientes/${clienteSelecionado.codigo}`);
      setClientes(clientes.filter((c) => c.codigo !== clienteSelecionado.codigo));
      setModalOpen(false);
      setClienteSelecionado(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "nome", label: "Nome" },
    { key: "fantasia", label: "Fantasia", render: (c) => c.fantasia || "N/A" },
    { key: "documento", label: "Documento" },
    { key: "endereco", label: "Endereço" },
  ];

  return (
    <div className="p-6  w-full min-w-min min-h-min">
      <Header title="📋 Clientes" buttonLabel="+ Criar Cliente" onButtonClick={() => router.push("/clientes/novo")} backurl={'dashboard'} />

      {loading ? <p className="text-gray-500 mt-6 text-center">Carregando...</p> : 
        <DataTable columns={columns} data={clientes} onEdit={(c) => router.push(`/clientes/editar/${c.codigo}`)} onDelete={handleDeleteClick} />
      }

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o cliente <strong>{clienteSelecionado?.nome}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
