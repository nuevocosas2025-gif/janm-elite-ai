'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { Profile, UserRole } from '@/types';
import { ShieldCheck, UserPlus, Key, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u-1',
    full_name: 'Heiner Coronel (Director General)',
    role: 'admin',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u-2',
    full_name: 'Eva Rinza (Coordinación y Admisiones)',
    role: 'asesor',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u-3',
    full_name: 'Auditor Externo / Practicante',
    role: 'solo_lectura',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function UsersAdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [toast, setToast] = useState<string | null>(null);

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setProfiles(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    setToast(`Permisos actualizados para el usuario. Nuevo rol: ${newRole.toUpperCase()}`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Gestión de Usuarios, Roles y Permisos
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Seguridad RBAC en Supabase PostgreSQL. Validación estricta en servidor y políticas RLS.
            </p>
          </div>
        </div>

        {toast && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* EXPLICACIÓN DE LOS 3 ROLES REQUERIDOS EN LA SECCIÓN 13 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrador</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Acceso total: gestiona usuarios, configura integraciones y claves, administra cursos, gestiona contactos y consulta estadísticas globales.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border">
            <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Asesor Académico</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gestión comercial: consulta contactos autorizados, gestiona estados de prospectos, notas y atiende conversaciones derivadas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border">
            <div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Solo Lectura</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auditoría: consulta información autorizada y reportes sin permisos para modificar, eliminar ni crear registros.
            </p>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="rounded-2xl bg-janm-surface border border-janm-border overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-janm-border/60 bg-janm-dark/50 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Usuario Institucional</th>
                <th className="py-3 px-4 font-semibold">Rol Asignado</th>
                <th className="py-3 px-4 font-semibold">Fecha de Alta</th>
                <th className="py-3 px-4 font-semibold text-right">Modificar Permiso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-janm-border/40">
              {profiles.map(user => (
                <tr key={user.id} className="hover:bg-janm-surfaceLight/50">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{user.full_name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">ID: {user.id}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      user.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : user.role === 'asesor'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="bg-janm-dark border border-janm-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-janm-gold"
                    >
                      <option value="admin">Administrador</option>
                      <option value="asesor">Asesor</option>
                      <option value="solo_lectura">Solo Lectura</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
