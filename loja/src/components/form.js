"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Form({ title, fields, values, onChange, onSubmit }) {
  const router = useRouter();

  const hasCpfField = fields.some((field) => field.name === "documento");

  const formatCpf = (cpf) => {
    if (!cpf) return "";
    let value = cpf.replace(/\D/g, "");

    if (value.length > 3) value = value.slice(0, 3) + "." + value.slice(3);
    if (value.length > 7) value = value.slice(0, 7) + "." + value.slice(7);
    if (value.length > 11) value = value.slice(0, 11) + "-" + value.slice(11, 13);

    return value;
  };

  const isValidCpf = (cpf) => {
    const cleaned = cpf.replace(/\D/g, ""); 
    if (cleaned.length !== 11) return false;
  
    if (/^(\d)\1+$/.test(cleaned)) return false;
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10) firstCheck = 0;
    if (firstCheck !== parseInt(cleaned[9])) return false;
  
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10) secondCheck = 0;
    if (secondCheck !== parseInt(cleaned[10])) return false;
  
    return true;
  };
  

  useEffect(() => {
    if (hasCpfField && values.documento) {
      onChange({ target: { name: "documento", value: formatCpf(values.documento) } });
    }
  }, [values.documento]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = fields.filter((field) => field.required && !values[field.name]);
    if (emptyFields.length > 0) {
      toast.error(`Preencha todos os campos obrigatórios!`);
      return;
    }

    if (hasCpfField && !isValidCpf(values.documento)) {
      toast.error("CPF inválido! ");
      return;
    }

    const invalidNumericFields = fields.filter(
      (field) => field.type === "number" && values[field.name] === "0"
    );

    if (invalidNumericFields.length > 0) {
      toast.error("O valor 0 não é válido.");
      return;
    }

    const codigoBarrasField = fields.find((field) => field.name === "codigoBarras");
    if (codigoBarrasField) {
      const codigoBarras = values.codigoBarras?.replace(/\D/g, "");
      if (!codigoBarras || codigoBarras.length !== 13) {
        toast.error("O Código de Barras deve ter exatamente 13 números.");
        return;
      }
    }

    onSubmit(e);
  };
  const handleInputChange = (field, e, onChange) => {
    let value = e.target.value;

    if (field.format === "integer") {
      value = value.replace(/\D/g, "");
    } 
    else if (field.format === "decimal") {
      value = value.replace(/[^0-9.,]/g, "");
      value = value.replace(",", ".");

      if (value.startsWith(".")) value = "0" + value;

      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].slice(0, 2);
      }

      if (parts[0].length > 10) {
        value = parts[0].slice(0, 10) + (parts[1] ? "." + parts[1] : "");
      }
    }

    if (field.name === "codigoBarras") {
      value = value.replace(/\D/g, "").slice(0, 13);
    }

    onChange({ target: { name: field.name, value } });
  };



  return (
    <div className="min-h-min h-screen bg-gray-200 w-screen flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 h-full w-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-2xl shadow-xl flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 mb-1">{field.label}</label>

              <input
                type="text"
                inputMode={field.format === "integer" || field.format === "decimal" ? "numeric" : undefined}
                name={field.name}
                value={values[field.name] || ""}
                onChange={(e) => handleInputChange(field, e, onChange)}
                maxLength={field.name === "codigoBarras" ? 13 : 255}
                required={field.required}
                disabled={field.disabled}
                className="w-full p-3 border rounded-lg bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
              />


            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={() => router.push(hasCpfField ? "/clientes" : "/produtos")}
              className="w-full bg-red-500 text-white font-semibold p-3 rounded-lg hover:bg-red-600 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
