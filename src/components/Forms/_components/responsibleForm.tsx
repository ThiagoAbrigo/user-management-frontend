import InputGroup from "@/components/FormElements/InputGroup";
import ErrorMessage from "@/components/FormElements/errormessage";
import { userService } from "@/services/users";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: any;
  disabled: boolean;
}

export const ResponsibleForm = ({ formData, setFormData, handleChange, errors, disabled }: Props) => {
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (formData.responsibleDni?.length === 10 && !disabled) {
      buscarResponsable(formData.responsibleDni);
    }
  }, [formData.responsibleDni]);
  const buscarResponsable = async (dni: string) => {
    try {
      setSearching(true);
      const res = await userService.getResponsibleByDni(dni);
      if (res && res.data) {
        setFormData((prev: any) => ({
          ...prev,
          responsibleName: res.data.name,
          responsiblePhone: res.data.phone,
        }));
      }
    } catch (error) {
      console.log("Es un responsable nuevo o error de red");
    } finally {
      setSearching(false);
    }
  };
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: numericValue
    }));
  };
  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative mb-8 mt-10 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <div className="relative bg-white px-4 dark:bg-gray-900">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Solo para menores de edad
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-[#1e293b]/30">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FiUsers size={18} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Datos del Responsable {disabled && "(No requerido)"}
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <InputGroup
              label="Cédula del Responsable"
              name="responsibleDni"
              type="text"
              value={formData.responsibleDni}
              handleChange={handleNumericChange}
              placeholder={disabled ? "Solo menores" : "110XXXXXXX"}
              disabled={disabled}
            />
            {searching && <p className="text-xs text-blue-500 mt-1">Buscando...</p>}
            {!disabled && <ErrorMessage message={errors.responsibleDni} />}
          </div>
          <div>
            <InputGroup
              label="Nombre del Responsable"
              name="responsibleName"
              type="text"
              value={formData.responsibleName}
              handleChange={handleChange}
              placeholder={disabled ? "Solo menores" : "Ej. Carlos Pérez"}
              disabled={disabled}
            />
            {!disabled && <ErrorMessage message={errors.responsibleName} />}
          </div>
          <div>
            <InputGroup
              label="Teléfono del Responsable"
              name="responsiblePhone"
              type="text"
              value={formData.responsiblePhone}
              handleChange={handleNumericChange}
              placeholder={disabled ? "Solo menores" : "+593 999 000 000"}
              disabled={disabled}
            />
            {!disabled && <ErrorMessage message={errors.responsiblePhone} />}
          </div>
        </div>
      </div>
    </div>
  );
};