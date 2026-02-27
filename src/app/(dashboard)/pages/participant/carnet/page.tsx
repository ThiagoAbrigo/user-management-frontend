'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, QrCode, Download, User, Edit, X, Save } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/users';
import ErrorMessage from '@/components/FormElements/errormessage';

interface UserData {
  id?: string | number;
  _id?: string | number;
  external_id?: string;
  nombre: string;
  email: string;
  cedula: string;
  role?: string;
  edad?: number | string;
  estate?: string;
  address?: string;
  nombreResponsable?: string;
  dniResponsable?: string;
  telefonoResponsable?: string;
}

interface EditFormData {
  nombre: string;
  cedula: string;
  email: string;
  edad: number | string;
  direccion: string;
  nombreResponsable?: string;
  dniResponsable?: string;
  telefonoResponsable?: string;
}

const CarnetPage: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<EditFormData>({
    nombre: '',
    cedula: '',
    email: '',
    edad: '',
    direccion: '',
    nombreResponsable: '',
    dniResponsable: '',
    telefonoResponsable: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'USUARIO') {
      router.push('/pages/participant');
      return;
    }
    setUserData(user);
    setLoading(false);
  }, [router]);

  const getUserId = (): string => {
    if (!userData) return 'UNL';
    const id = userData.id || userData._id;
    return id ? String(id).slice(0, 8) : 'UNL';
  };

  const handleDownload = () => {
    alert('Preparando descarga del carnet...');
  };

  const openEditModal = () => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        cedula: userData.cedula || '',
        email: userData.email || '',
        edad: userData.edad || '',
        direccion: userData.address || '',
        nombreResponsable: userData.nombreResponsable || '',
        dniResponsable: userData.dniResponsable || '',
        telefonoResponsable: userData.telefonoResponsable || ''
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.external_id) {
      alert("No se pudo identificar el usuario");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.nombre,
        dni: formData.cedula,
        email: formData.email,
        age: Number(formData.edad),
        address: formData.direccion,
        estate: userData.estate,
        responsible: isEstamentoExterno
          ? {
            name: formData.nombreResponsable,
            dni: formData.dniResponsable,
            phone: formData.telefonoResponsable,
          }
          : null,
      };

      await userService.updateUser(userData.external_id, payload);
      setUserData((prev) =>
        prev ? {
          ...prev,
          nombre: formData.nombre,
          cedula: formData.cedula,
          email: formData.email,
          edad: formData.edad,
          address: formData.direccion,
          nombreResponsable: formData.nombreResponsable,
          dniResponsable: formData.dniResponsable,
          telefonoResponsable: formData.telefonoResponsable,
        } : prev
      );
      closeModal();
      alert("Datos actualizados correctamente");
    } catch (error: any) {
      if (error.errors) {
        const backendErrors = error.errors;
        setErrors({
          nombre: backendErrors.name,
          cedula: backendErrors.dni,
          email: backendErrors.email,
          edad: backendErrors.age,
          direccion: backendErrors.address,
          nombreResponsable: backendErrors.responsibleName,
          dniResponsable: backendErrors.responsibleDni,
          telefonoResponsable: backendErrors.responsiblePhone,
        });
      } else {
        alert(error.msg || "Error al actualizar");
      }
    } finally {
      setSaving(false);
    }
  };

  const isEstamentoExterno = userData?.estate?.toLowerCase() === 'miembro externo';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-xl animate-pulse">Cargando carnet...</div>
      </div>
    );
  }

  if (!userData) return null;

  const {
    nombre = 'Usuario',
    email = 'correo@ejemplo.com',
    cedula = '000.000.000-0',
    edad = 'N/A',
    estate = "Universitario"
  } = userData;

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
            Visualización de Mi Carnet
          </h1>
          <p className="text-slate-400">
            Bienvenido, {typeof nombre === 'string' ? nombre.split(' ')[0] : 'Usuario'}
          </p>
        </div>
        <div className="relative bg-gradient-to-br from-[#1a1c2e] to-[#0f101a] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-indigo-400 font-bold uppercase">
                  Universidad
                </p>
                <h2 className="text-2xl font-black tracking-wider text-white">NACIONAL DE LOJA</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-indigo-900/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border border-indigo-500/30 uppercase">
                {estate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-3 flex justify-center md:justify-start">
              <div className="relative w-32 md:w-40">
                <div className="w-full aspect-square rounded-2xl flex items-center justify-center border-2 border-indigo-500/30 bg-slate-800/50">
                  <div className="bg-slate-700/50 p-4 rounded-full border border-slate-600">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-indigo-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col gap-y-6 text-center md:text-left">
              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">
                  Nombre Completo
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white break-words">{nombre}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                    Cédula de Identidad
                  </p>
                  <p className="font-semibold text-slate-200">{cedula}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                    Correo Electrónico
                  </p>
                  <p className="font-semibold text-slate-200 text-sm break-all leading-tight">
                    {email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                    Edad
                  </p>
                  <p className="font-semibold text-slate-200">{edad} años</p>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 flex flex-col items-center md:items-end justify-center">
              <div className="bg-white p-2 rounded-2xl w-full max-w-[140px] aspect-square flex flex-col items-center justify-between shadow-xl">
                <div className="flex-1 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-black" />
                </div>
                <div className="w-full text-center py-1.5 bg-slate-50 rounded-xl">
                  <p className="text-black text-[9px] font-black tracking-[0.2em] uppercase">
                    ID: {getUserId()}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={openEditModal}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 border border-slate-700 shadow-lg"
          >
            <Edit className="w-5 h-5" />
            Editar Información
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-5 h-5" />
            Descargar Carnet (PDF)
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#1a1c2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-[#1a1c2e] border-b border-slate-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white">Editar Información</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <ErrorMessage message={errors.nombre} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cédula</label>
                  <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <ErrorMessage message={errors.cedula} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <ErrorMessage message={errors.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Edad</label>
                  <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} min="1" max="120" className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <ErrorMessage message={errors.edad} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Dirección</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <ErrorMessage message={errors.direccion} />
                </div>
              </div>

              {isEstamentoExterno && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Datos del Responsable</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">DNI Responsable</label>
                      <input type="text" name="dniResponsable" value={formData.dniResponsable} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <ErrorMessage message={errors.dniResponsable} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Responsable</label>
                      <input type="text" name="nombreResponsable" value={formData.nombreResponsable} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <ErrorMessage message={errors.nombreResponsable} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono Responsable</label>
                      <input type="tel" name="telefonoResponsable" value={formData.telefonoResponsable} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <ErrorMessage message={errors.telefonoResponsable} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors" disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                  {saving ? "Guardando..." : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarnetPage;