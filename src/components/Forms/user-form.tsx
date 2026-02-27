"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import ErrorMessage from "@/components/FormElements/errormessage";
import { FiCalendar, FiCreditCard, FiMail, FiMapPin, FiUser, FiUsers } from "react-icons/fi";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { userService } from "@/services/users";
import { ResponsibleForm } from "./_components/responsibleForm";
import { EstamentoSelector } from "./_components/estamentoSelector";

export default function UserForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    estamento: "UNIVERSITARIO",
    age: "",
    email: "",
    password: "",
    address: "",
    responsibleName: "",
    responsibleDni: "",
    responsiblePhone: "",
  });

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // const showResponsible =
  //   formData.estamento === "MIEMBRO EXTERNO" &&
  //   Number(formData.age) > 0 &&
  //   Number(formData.age) < 18;

  // Por esto (si quieres que salga apenas elijan Miembro Externo):
  const showResponsible = formData.estamento === "MIEMBRO EXTERNO";
  const isMinor = Number(formData.age) > 0 && Number(formData.age) < 18;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, [name]: numericValue }));
    
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleEstamentoChange = (value: string) => {
    setFormData({
      name: "",
      dni: "",
      estamento: value,
      age: "",
      email: "",
      password: "",
      address: "",
      responsibleName: "",
      responsibleDni: "",
      responsiblePhone: "",
    });
  
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);

      const payload: any = {
        name: formData.name,
        estate: formData.estamento,
        age: Number(formData.age),
        dni: formData.dni,
        email: formData.email,
        password: formData.password,
        address: formData.address,
      };

      if (
        Number(formData.age) < 18 &&
        formData.estamento === "MIEMBRO EXTERNO"
      ) {
        payload.responsible = {
          name: formData.responsibleName,
          dni: formData.responsibleDni,
          phone: formData.responsiblePhone,
        };
      }

      const response = await userService.createUser(payload);

      console.log("Usuario creado:", response);

      alert("Usuario creado correctamente");
      setFormData({
        name: "",
        dni: "",
        estamento: "",
        age: "",
        email: "",
        password: "",
        address: "",
        responsibleName: "",
        responsibleDni: "",
        responsiblePhone: "",
      });
      setErrors({});

      router.push("/");

    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-10 shadow-xl">

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Registrarse
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selecciona tu Estamento</p>
          <EstamentoSelector
            selected={formData.estamento}
            onSelect={handleEstamentoChange}
          />
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <InputGroup
                label="Nombres y Apellidos"
                name="name"
                type="text"
                placeholder="Ej. Juan"
                value={formData.name}
                handleChange={handleChange}
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.name} />
            </div>
            <div>
              <InputGroup
                label="Cédula"
                name="dni"
                type="text"
                value={formData.dni}
                handleChange={handleNumericChange}
                placeholder="110XXXXXXX"
                icon={<FiCreditCard className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.dni} />
            </div>
            <div>
              <InputGroup
                label="Dirección"
                name="address"
                type="text"
                placeholder="Ej. Av. Universitaria"
                value={formData.address}
                handleChange={handleChange}
                icon={<FiMapPin className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.address} />
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <InputGroup
                label="Edad"
                name="age"
                type="text"
                value={formData.age}
                handleChange={handleNumericChange}
                placeholder="25"
                icon={<FiCalendar className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.age} />
            </div>
            <div>
              <InputGroup
                label="Correo electrónico"
                name="email"
                type="text"
                value={formData.email}
                handleChange={handleChange}
                placeholder="john@example.com"
                icon={<FiMail className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.email} />
            </div>
            <div>
              <InputGroup
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                handleChange={handleChange}
                icon={<PasswordIcon />}
              />
              <ErrorMessage message={errors.password} />
            </div>
          </div>
          {showResponsible && (
            <ResponsibleForm
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors} 
              disabled={!isMinor}
            />
          )}
          <Button
            type="submit"
            disabled={submitting}
            label={submitting ? "Guardando..." : "Registrar"}
            className="mt-8 w-full py-4 text-lg"
            variant="primary"
          />
        </form>
      </div>
    </div>
  );
}