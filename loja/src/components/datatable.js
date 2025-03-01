"use client";
import { useEffect, useState } from "react";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: "codigo", direction: "asc" });
  const [searchField, setSearchField] = useState(columns[0]?.key || "");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  
  useEffect(() => {
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCpf = (cpf) => {
    if (!cpf) return "";
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return sortConfig.direction === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });
  };

  const filteredData = data.filter((item) => {
    const value = item[searchField]?.toString().toLowerCase() || "";
    return value.includes(searchValue.toLowerCase());
  });

  const sortedData = getSortedData(filteredData);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6 p-4">
  <div className="mb-4">
    <select
      value={searchField}
      onChange={(e) => setSearchField(e.target.value)}
      className="border p-2 rounded-md w-full md:w-auto"
    >
      {columns.map((col) => (
        <option key={col.key} value={col.key}>{col.label}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-wrap gap-4 mb-4">
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Digite para buscar..."
      className="border p-2 rounded-md flex-1 min-w-[200px]"
    />

    <select
      value={itemsPerPage}
      onChange={(e) => setItemsPerPage(Number(e.target.value))}
      className="border p-2 rounded-md"
    >
      <option value={10}>10 registros</option>
      <option value={20}>20 registros</option>
      <option value={30}>30 registros</option>
    </select>
  </div>

  {isMobile && (
    <div className="flex flex-wrap gap-2 mb-4">
      {columns.map((col) => (
        <button
          key={col.key}
          onClick={() => handleSort(col.key)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          {col.label} {sortConfig.key === col.key && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
        </button>
      ))}
    </div>
  )}

  {paginatedData.length === 0 ? (
    <p className="text-gray-600 text-center p-4">Nenhum registro encontrado.</p>
  ) : (
    <>
      <div className="block md:hidden">
        {paginatedData.map((item) => (
          <div key={item.codigo} className="border p-4 mb-2 rounded bg-gray-100">
            {columns.map((col) => (
              <p key={col.key}><strong>{col.label}:</strong> {col.key === "documento" ? formatCpf(item[col.key]) : item[col.key]}</p>
            ))}
            <div className="flex justify-between mt-2">
              <button onClick={() => onEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded">✏️ Editar</button>
              <button onClick={() => onDelete(item)} className="bg-red-500 text-white px-3 py-1 rounded">🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <table className="hidden md:table w-full border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)} className="p-4 text-left cursor-pointer hover:bg-gray-700">
                {col.label} {sortConfig.key === col.key && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
              </th>
            ))}
            <th className="p-4 text-center">Editar</th>
            <th className="p-4 text-center">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={item.codigo} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              {columns.map((col) => (
                <td key={col.key} className="p-4">{col.key === "documento" ? formatCpf(item[col.key]) : item[col.key]}</td>
              ))}
              <td className="p-4 text-center">
                <button onClick={() => onEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded">✏️ Editar</button>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => onDelete(item)} className="bg-red-500 text-white px-3 py-1 rounded">🗑️ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}

  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
    >
      ← Anterior
    </button>
    <span>Página {currentPage} de {totalPages}</span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
    >
      Próxima →
    </button>
  </div>
</div>

  );
}