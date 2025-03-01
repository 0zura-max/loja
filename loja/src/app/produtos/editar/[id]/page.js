"use client";
import ProdutoForm from "@/components/produto-form";
import { useParams } from "next/navigation";

export default function EditarProduto() {
  const { id } = useParams();
  return <ProdutoForm produtoId={id} />;
}
