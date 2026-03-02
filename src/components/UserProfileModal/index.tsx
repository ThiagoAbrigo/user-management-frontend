'use client';

import React, { useEffect, useState } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import { perfilService } from '@/services/perfil';
import Swal from 'sweetalert2';
import ErrorMessage from '@/components/FormElements/errormessage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data = await perfilService.getProfile(userId);
      setProfileData(data);
      setEditedData(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error('Error cargando perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el perfil del usuario',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);
    setFieldErrors({});

    try {
      const response = await perfilService.updateProfile(userId, editedData);
      setProfileData(response);
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Perfil actualizado correctamente',
        confirmButtonText: 'Aceptar',
      });
    } catch (error: any) {
      if (error.errores) {
        setFieldErrors(error.errores);
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(JSON.parse(JSON.stringify(profileData)));
    setIsEditing(false);
    setFieldErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-gray-500">Cargando perfil...</p>
          </div>
        ) : profileData ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Perfil de {profileData.usuario?.nombre || 'Usuario'}
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
              )}
            </div>

            {/* Sección Usuario */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.usuario?.nombre || ''}
                      onChange={(e) => handleInputChange('usuario', 'nombre', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.usuario?.nombre || '-'}
                    </p>
                  )}
                  <ErrorMessage message={fieldErrors.nombre} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cédula
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.usuario?.cedula || ''}
                      onChange={(e) => handleInputChange('usuario', 'cedula', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.usuario?.cedula || '-'}
                    </p>
                  )}
                  <ErrorMessage message={fieldErrors.cedula} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData?.usuario?.email || ''}
                      onChange={(e) => handleInputChange('usuario', 'email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.usuario?.email || '-'}
                    </p>
                  )}
                  <ErrorMessage message={fieldErrors.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Edad
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData?.usuario?.edad || ''}
                      onChange={(e) => handleInputChange('usuario', 'edad', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.usuario?.edad || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección Perfil */}
            {profileData.perfil && (
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Información Profesional
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rol
                    </label>
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.perfil?.nombre || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                      {profileData.perfil?.estado || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sección Representante (si existe) */}
            {profileData.representante && (
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Datos del Representante
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.representante?.nombre || ''}
                        onChange={(e) => handleInputChange('representante', 'nombre', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                        {profileData.representante?.nombre || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cédula
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.representante?.cedula || ''}
                        onChange={(e) => handleInputChange('representante', 'cedula', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                        {profileData.representante?.cedula || '-'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.representante?.telefono || ''}
                        onChange={(e) => handleInputChange('representante', 'telefono', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 text-gray-900 dark:text-gray-300">
                        {profileData.representante?.telefono || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {isEditing && (
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg"
                >
                  <Save size={18} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
