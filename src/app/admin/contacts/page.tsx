'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir de inmediato al módulo unificado oficial de Clientes y Ventas (CRM)
    router.replace('/admin/prospects');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center text-amber-400 text-xs font-mono">
      Cargando base unificada de clientes CRM3 EVA...
    </div>
  );
}
