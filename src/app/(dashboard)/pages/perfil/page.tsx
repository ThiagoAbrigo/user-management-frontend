'use client'
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Globe, Shield, Edit3, Share2, Briefcase, Heart, User, FolderOpen, ExternalLink, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';
import { perfilService } from '@/services/perfil';
import ErrorMessage from '@/components/FormElements/errormessage';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const external_id = localStorage.getItem("external_id");
      if (!external_id) return;

      try {
        const data = await perfilService.getProfile(external_id);
        setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const external_id = localStorage.getItem("external_id");
    if (!external_id) return;

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      // Preparar solo los datos que han cambiado (opcional pero recomendado)
      const updatedData = {
        cuenta: editedData.cuenta,
        usuario: editedData.usuario,
        perfil: editedData.perfil,
        representante: editedData.representante
      };
      console.log("Enviando datos filtrados:", updatedData);

      const response = await perfilService.updateProfile(external_id, updatedData);

      // Actualizar con los datos devueltos del servidor
      setProfileData(response);
      setIsEditing(false);

      // Mostrar mensaje de éxito (opcional)
      console.log('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error al guardar:', error);

      // Manejar diferentes formatos de error
      if (error.errores) {
        // Si el error viene como diccionario de errores por campo
        setFieldErrors(error.errores);
      } else if (error.error) {
        // Si es un error general
        setError(error.error);
      } else {
        setError('Error al actualizar el perfil');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(JSON.parse(JSON.stringify(profileData))); // Restaurar datos originales
    setIsEditing(false);
    setFieldErrors({});
  };

  const handleInputChangeWithErrorClear = (section: string, field: string, value: any) => {
    // Construir la clave del error (ej: "correoElectronico", "numeroIdentificacion")
    const errorKey = field === 'correoElectronico' ? 'correoElectronico' :
      field === 'numeroIdentificacion' ? 'numeroIdentificacion' :
        field === 'fechaNacimiento' ? 'fechaNacimiento' :
          field === 'celular' ? 'celular' :
            field === 'nombre' ? 'nombre' :
              field === 'apellido' ? 'apellido' : field;

    // Limpiar el error específico
    if (fieldErrors[errorKey]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    // Llamar al handleInputChange original
    handleInputChange(section, field, value);
  };

  const handleEdit = () => {
    const copy = JSON.parse(JSON.stringify(profileData));

    copy.perfil.habilidades = copy.perfil.habilidades || [];
    copy.perfil.portafolio = copy.perfil.portafolio || [];
    copy.perfil.redesSociales = copy.perfil.redesSociales || [];

    setEditedData(copy);
    setIsEditing(true);
  };


  if (loading) return <div>Cargando perfil...</div>;
  if (!profileData) return <div>No se encontró el perfil</div>;

  const { usuario, perfil, representante, cuenta } = isEditing ? editedData : profileData;
  const mostrarRepresentante = representante && Object.values(representante).some(val => val && val !== '');
  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SIDEBAR: PERFIL IZQUIERDA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#161b22] rounded-3xl p-8 border border-gray-800 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-[#21262d] flex items-center justify-center border-4 border-[#1f2937]">
                <User size={60} className="text-gray-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">{usuario.nombre} {usuario.apellido}</h1>
            <p className="text-blue-400 font-medium text-sm mb-4">{cuenta?.rol || "Participante"}</p>

            <div className="w-full mb-6">
              {isEditing ? (
                <textarea
                  value={perfil?.descripcion || ""}
                  onChange={(e) =>
                    handleInputChange("perfil", "descripcion", e.target.value)
                  }
                  className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              ) : (
                <p className="text-gray-400 text-sm">
                  {perfil?.descripcion || "Sin descripción disponible."}
                </p>
              )}
            </div>

            <div className="flex w-full gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-500 py-2.5 rounded-xl font-semibold"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 py-2.5 rounded-xl font-semibold"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>

            <div className="w-full border-t border-gray-800 mt-8 pt-6 space-y-4">
              <SidebarLink icon={<Mail size={18} />} text={cuenta.correoElectronico} />
              <div className="w-full">
                {isEditing ? (
                  <input
                    type="text"
                    value={perfil?.direccion || ""}
                    onChange={(e) =>
                      handleInputChange("perfil", "direccion", e.target.value)
                    }
                    className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                    placeholder="Dirección"
                  />
                ) : (
                  <SidebarLink
                    icon={<MapPin size={18} />}
                    text={perfil?.direccion || "Ubicación no definida"}
                  />
                )}
              </div>
            </div>
          </div>
          <section className="bg-[#161b22] rounded-3xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
              <Share2 size={18} className="text-blue-500" /> Redes Sociales
            </h3>

            {isEditing ? (
              <div className="bg-[#0b0e14] border border-gray-700 rounded-lg p-3">

                {/* Lista de redes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {perfil?.redesSociales?.map((url: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-[#1c2128] text-blue-400 px-3 py-1 rounded-lg text-xs"
                    >
                      {url.replace("https://", "").replace("www.", "").split("/")[0]}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = perfil.redesSociales.filter(
                            (_: string, i: number) => i !== index
                          );
                          handleInputChange("perfil", "redesSociales", updated);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Input para agregar nueva red */}
                <input
                  type="text"
                  placeholder="Escribe un enlace y presiona Enter"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (!value) return;

                      if (perfil?.redesSociales?.includes(value)) {
                        e.currentTarget.value = "";
                        return;
                      }

                      const updated = [...(perfil?.redesSociales || []), value];
                      handleInputChange("perfil", "redesSociales", updated);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {perfil?.redesSociales && perfil.redesSociales.length > 0 ? (
                  perfil.redesSociales.map((url: string, index: number) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-gray-800 hover:border-blue-500/50 hover:bg-[#1c2128] transition-all group"
                    >
                      <div className="flex items-center gap-3 text-gray-400 group-hover:text-white">
                        <span className="text-blue-500">
                          <Globe size={18} />
                        </span>
                        <span className="text-xs font-medium truncate max-w-[150px]">
                          {url.replace("https://", "").replace("www.", "").split("/")[0]}
                        </span>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-gray-600 group-hover:text-blue-400"
                      />
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs italic text-center py-2">
                    No hay redes sociales vinculadas.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* CONTENIDO PRINCIPAL: DERECHA */}
        <div className="lg:col-span-8 space-y-6">

          {/* INFORMACIÓN PERSONAL */}
          <section className="bg-[#161b22] rounded-3xl p-8 border border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Briefcase className="text-blue-500" size={20} /> Información Personal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField
                label="Nombres"
                value={usuario.nombre}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("usuario", "nombre", val)}
                error={fieldErrors["nombre"]}
                name="nombre"
              />

              <InfoField
                label="Apellidos"
                value={usuario.apellido}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("usuario", "apellido", val)}
                error={fieldErrors["apellido"]}
                name="apellido"
              />

              <InfoField
                label="Correo"
                value={cuenta.correoElectronico}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("cuenta", "correoElectronico", val)}
                error={fieldErrors["correoElectronico"]}
                name="correoElectronico"
              />

              <InfoField
                label="Celular"
                value={perfil?.celular}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("perfil", "celular", val)}
                error={fieldErrors["celular"]}
                name="celular"
              />

              <InfoField
                label="Identificación"
                value={usuario.numeroIdentificacion}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("usuario", "numeroIdentificacion", val)}
                error={fieldErrors["numeroIdentificacion"]}
                name="numeroIdentificacion"
              />

              <InfoField
                label="Fecha de Nacimiento"
                value={usuario.fechaNacimiento}
                isEditing={isEditing}
                onChange={(val) => handleInputChangeWithErrorClear("usuario", "fechaNacimiento", val)}
                error={fieldErrors["fechaNacimiento"]}
                name="fechaNacimiento"
              />
            </div>
          </section>

          <section className="bg-[#161b22] rounded-3xl p-8 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="text-purple-500" size={20} /> Habilidades
            </h2>

            {isEditing ? (
              <div className="bg-[#0b0e14] border border-gray-700 rounded-lg p-3">

                {/* Lista de habilidades */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {perfil?.habilidades?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-[#1c2128] text-blue-400 px-3 py-1 rounded-lg text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = perfil.habilidades.filter(
                            (_: string, i: number) => i !== index
                          );
                          handleInputChange("perfil", "habilidades", updated);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Input para agregar nueva habilidad */}
                <input
                  type="text"
                  placeholder="Escribe una habilidad y presiona Enter"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (!value) return;

                      // Evitar duplicados
                      if (perfil?.habilidades?.includes(value)) {
                        e.currentTarget.value = "";
                        return;
                      }

                      const updated = [...(perfil?.habilidades || []), value];
                      handleInputChange("perfil", "habilidades", updated);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {perfil?.habilidades?.length > 0 ? (
                  perfil.habilidades.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-[#1c2128] text-blue-400 border border-blue-900/30 px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic text-sm">
                    No se han añadido habilidades.
                  </span>
                )}
              </div>
            )}
          </section>
          <section className="bg-[#161b22] rounded-3xl p-8 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FolderOpen className="text-orange-400" size={20} /> Portafolio
            </h2>

            {isEditing ? (
              <div className="bg-[#0b0e14] border border-gray-700 rounded-lg p-3">

                {/* Lista de enlaces */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {perfil?.portafolio?.map((link: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-[#1c2128] text-blue-400 px-3 py-1 rounded-lg text-sm"
                    >
                      {link.replace("https://", "").replace("www.", "").split("/")[0]}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = perfil.portafolio.filter(
                            (_: string, i: number) => i !== index
                          );
                          handleInputChange("perfil", "portafolio", updated);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Escribe un enlace y presiona Enter"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (!value) return;

                      const updated = [...(perfil?.portafolio || []), value];
                      handleInputChange("perfil", "portafolio", updated);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {perfil?.portafolio?.length > 0 ? (
                  perfil.portafolio.map((link: string, index: number) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#1c2128] text-blue-400 border border-blue-900/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#252b33]"
                    >
                      <ExternalLink size={14} />
                      {link.replace("https://", "").replace("www.", "").split("/")[0]}
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500 italic text-sm">
                    No se han añadido enlaces al portafolio.
                  </span>
                )}
              </div>
            )}
          </section>
          {mostrarRepresentante && (
            <section className="bg-[#161b22] rounded-3xl p-8 border border-gray-800">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white mb-6">
                <Heart className="text-red-500" size={20} /> Datos del Representante
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0b0e14] bg-opacity-40 p-6 rounded-2xl border border-gray-800">
                <InfoField
                  label="Nombre"
                  value={representante?.nombre}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChangeWithErrorClear("representante", "nombre", val)}
                  error={fieldErrors["representante_nombre"]}
                />

                <InfoField
                  label="Celular"
                  value={representante?.celular}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChangeWithErrorClear("representante", "celular", val)}
                  error={fieldErrors["representante_celular"]}
                />

                <InfoField
                  label="Identificación"
                  value={representante?.numeroIdentificacion}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChangeWithErrorClear("representante", "numeroIdentificacion", val)}
                  error={fieldErrors["representante_identificacion"]}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes Pequeños para mantener el código limpio
const SidebarLink = ({ icon, text }: any) => (
  <div className="flex items-center gap-3 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
    <span className="text-blue-500/80">{icon}</span>
    <span className="text-sm truncate">{text}</span>
  </div>
);
interface InfoFieldProps {
  label: string
  value: string
  isEditing?: boolean
  onChange?: (value: string) => void
  error?: string; // Nuevo prop para el error
  name?: string;
}
const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  isEditing = false,
  onChange,
  error,
  name
}) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">{label}</label>
    {isEditing ? (
      <>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={`bg-[#0b0e14] border rounded-lg px-3 py-2 text-sm text-white ${error ? 'border-red-500' : 'border-gray-700'
            }`}
        />
        <ErrorMessage message={error} />
      </>
    ) : (
      <span className="text-white text-sm font-medium">
        {value || "No definido"}
      </span>
    )}
  </div>
)
export default ProfilePage;