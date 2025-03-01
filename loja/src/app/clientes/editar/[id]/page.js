
"use client";
import ClienteForm from "@/components/cliente-form";
import { useParams } from "next/navigation";

export default function EditarProduto() {
  const { id } = useParams();
  return (
  <div className="">
    <ClienteForm clienteId={id} />
  </div>)
  
}

