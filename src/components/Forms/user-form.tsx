"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiCreditCard, FiMail, FiMapPin, FiUsers } from "react-icons/fi";
import { userService } from "@/services/users";
import InputGroup from "../FormElements/InputGroup";
import ErrorMessage from "../FormElements/errormessage";
import DatePickerTwo from "../FormElements/DatePicker/DatePickerTwo";
import { PasswordIcon } from "@/assets/icons";
import { Button } from "../ui-elements/button";

export default function UserForm() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [formData, setFormData] = useState({
    tipoIdentificacion: "CEDULA",
    numeroIdentificacion: "",
    nombre: "",
    apellido: "",
    rol: "",
    fechaNacimiento: "",
    correoElectronico: "",
    password: "",
    // Representante
    rep_tipoIdentificacion: "CEDULA",
    rep_numeroIdentificacion: "",
    rep_nombre: "",
    rep_celular: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tiposIdentificacion = ["CEDULA", "PASAPORTE"];
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await userService.getRoles();
        if (response?.roles) {
          setRoles(response.roles);
        }
      } catch (error) {
        console.error("Error cargando roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const calcularEdad = (fechaNacimiento: string): number => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const edad = calcularEdad(formData.fechaNacimiento);

  const showResponsible =
    formData.rol === "MIEMBRO_EXTERNO" &&
    formData.fechaNacimiento !== "" &&
    edad < 18;

  const hace100Anios = new Date();
  hace100Anios.setFullYear(hace100Anios.getFullYear() - 100);
  const fechaMinima = hace100Anios.toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleDateChange = (newDate: string) => {
    setFormData(prev => ({ ...prev, fechaNacimiento: newDate }));
    if (errors.fechaNacimiento) {
      const newErrors = { ...errors };
      delete newErrors.fechaNacimiento;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setSubmitting(true);

      const payload: any = {
        tipoIdentificacion: formData.tipoIdentificacion,
        numeroIdentificacion: formData.numeroIdentificacion,
        nombre: formData.nombre,
        apellido: formData.apellido,
        fechaNacimiento: formData.fechaNacimiento,
        correoElectronico: formData.correoElectronico,
        password: formData.password,
        rol: formData.rol,
      };

      if (showResponsible) {
        payload.representante = {
          tipoIdentificacion: formData.rep_tipoIdentificacion,
          numeroIdentificacion: formData.rep_numeroIdentificacion,
          nombre: formData.rep_nombre,
          celular: formData.rep_celular || undefined,
        };
      }

      const response = await userService.createUser(payload);
      alert("Usuario creado correctamente");

      setFormData({
        tipoIdentificacion: "CEDULA",
        numeroIdentificacion: "",
        nombre: "",
        apellido: "",
        rol: "",
        fechaNacimiento: "",
        correoElectronico: "",
        password: "",
        rep_tipoIdentificacion: "CEDULA",
        rep_numeroIdentificacion: "",
        rep_nombre: "",
        rep_celular: "",
      });

      router.push("/usuarios");

    } catch (error: any) {
      console.log("Error completo:", error);

      if (error.response?.data?.errores) {
        setErrors(error.response.data.errores);
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
            Registrar Usuario
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Primera fila: Tipo ID, Número ID y Rol */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Identificación
              </label>
              <select
                name="tipoIdentificacion"
                value={formData.tipoIdentificacion}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                {tiposIdentificacion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <InputGroup
                label="Número de Identificación"
                name="numeroIdentificacion"
                type="text"
                placeholder="1101234567"
                value={formData.numeroIdentificacion}
                handleChange={handleChange}
                icon={<FiCreditCard className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.numeroIdentificacion} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                disabled={loadingRoles}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  {loadingRoles ? "Cargando roles..." : "Seleccione un rol"}
                </option>

                {roles.map((rol) => (
                  <option key={rol.external_id} value={rol.nombre}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              <ErrorMessage message={errors.rol} />
            </div>
          </div>

          {/* Segunda fila: Nombre, Apellido y Fecha Nacimiento */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <InputGroup
                label="Nombre"
                name="nombre"
                type="text"
                placeholder="Juan"
                value={formData.nombre}
                handleChange={handleChange}
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.nombre} />
            </div>
            <div>
              <InputGroup
                label="Apellido"
                name="apellido"
                type="text"
                placeholder="Perez"
                value={formData.apellido}
                handleChange={handleChange}
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.apellido} />
            </div>
            <div>
              {/* 🔹 NUEVO: DatePicker integrado */}
              <DatePickerTwo
                label="Fecha de Nacimiento"
                value={formData.fechaNacimiento}
                onChange={handleDateChange}
                minDate={fechaMinima}
              // maxDate={hoy}
              />
              {formData.fechaNacimiento && (
                <p className="mt-1 text-sm text-gray-500">
                  Edad: {edad} años
                </p>
              )}
              <ErrorMessage message={errors.fechaNacimiento} />
            </div>
          </div>

          {/* Tercera fila: Email y Password */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <InputGroup
                label="Correo electrónico"
                name="correoElectronico"
                type="email"
                value={formData.correoElectronico}
                handleChange={handleChange}
                placeholder="ejemplo@unl.edu.ec"
                icon={<FiMail className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.correoElectronico} />
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

          {/* Sección de Representante (solo si aplica) */}
          {showResponsible && (
            <div className="mb-6 p-6 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                <FiUsers /> Datos del Representante (obligatorio por ser menor de edad)
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de ID del Representante
                  </label>
                  <select
                    name="rep_tipoIdentificacion"
                    value={formData.rep_tipoIdentificacion}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white"
                  >
                    {tiposIdentificacion.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <InputGroup
                    label="Cédula del Representante"
                    name="rep_numeroIdentificacion"
                    type="text"
                    placeholder="1101234567"
                    value={formData.rep_numeroIdentificacion}
                    handleChange={handleChange}
                    icon={<FiCreditCard className="text-gray-400" size={18} />}
                  />
                  <ErrorMessage message={errors.rep_numeroIdentificacion} />
                </div>
                <div>
                  <InputGroup
                    label="Nombre del Representante"
                    name="rep_nombre"
                    type="text"
                    placeholder="Carlos Perez"
                    value={formData.rep_nombre}
                    handleChange={handleChange}
                    icon={<FiUser className="text-gray-400" size={18} />}
                  />
                  <ErrorMessage message={errors.rep_nombre} />
                </div>
                <div>
                  <InputGroup
                    label="Celular del Representante (opcional)"
                    name="rep_celular"
                    type="text"
                    placeholder="0987654321"
                    value={formData.rep_celular}
                    handleChange={handleChange}
                    icon={<FiMapPin className="text-gray-400" size={18} />}
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            type="submit"
            disabled={submitting}
            label={submitting ? "Guardando..." : "Registrar Usuario"}
            className="mt-8 w-full py-4 text-lg"
            variant="primary"
          />
        </form>
      </div>
    </div>
  );
}