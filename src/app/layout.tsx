import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JANM ELITE AI | Academia de Oratoria y Liderazgo',
  description: 'Sistema inteligente de atención, admisiones y gestión comercial para Oratoria JANM Elite. Vence el miedo escénico y habla con poder.',
  keywords: ['oratoria', 'liderazgo', 'chiclayo', 'peru', 'hablar en publico', 'debate', 'janm elite ai'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-janm-dark text-slate-100 antialiased selection:bg-janm-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
