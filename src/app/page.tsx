import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ChatWidget } from '@/components/ChatWidget';
import { FALLBACK_COURSES } from '@/services/courseService';
import { 
  Award, 
  Mic, 
  Video, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow de fondo dorado */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ORATORIA JANM ELITE · Academia de Formación de Líderes y Oradores</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Domina el Arte de <br />
            <span className="bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Hablar con Poder
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Vence el miedo escénico, modula tu voz y proyecta autoridad. En <strong>ORATORIA JANM ELITE</strong> transformamos tu capacidad comunicativa con una metodología 80% práctica y certificación oficial con valor curricular.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-black text-base hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2.5 group"
            >
              <MessageSquare className="w-5 h-5 text-black" />
              <span>Consultar en Línea (24/7)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#cursos"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-amber-400/50 text-white font-bold text-base transition-all"
            >
              Ver Catálogo y Horarios
            </Link>
          </div>

          {/* Estadísticas de Confianza */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">+1,500</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Líderes Graduados</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">80% / 20%</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Práctica / Teoría</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Certificación Válida</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">24/7</div>
              <div className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-wider">Atención en Línea</div>
            </div>
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section id="metodologia" className="py-20 bg-[#0B0F19] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Método Comprobado</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-2">
              ¿Por qué los profesionales eligen JANM Elite?
            </h3>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Aprender oratoria no es memorizar discursos, sino dominar la seguridad corporal, la voz y la técnica argumentativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#0D1322] border border-slate-800 hover:border-amber-400/50 shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Vence el Miedo Escénico</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ejercicios de respiración diafragmática y prácticas graduales para eliminar temblores, nudos en la garganta y bloqueos mentales.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0D1322] border border-slate-800 hover:border-amber-400/50 shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Simulacros y Práctica Real</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Prácticas reales frente a público para corregir postura, gesticulación, microexpresiones y muletillas en tiempo real.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0D1322] border border-slate-800 hover:border-amber-400/50 shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Certificación Curricular</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Diploma oficial respaldado por la Academia con código de registro para potenciar tu currículum, ascensos laborales o sustentaciones de tesis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE CURSOS */}
      <section id="cursos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Programas Académicos</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Catálogo Oficial de Cursos
              </h3>
            </div>
            <p className="text-slate-300 text-sm max-w-md mt-4 md:mt-0">
              Tarifas transparentes en Soles (PEN), sin costos ocultos, con facilidades de pago en cuotas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FALLBACK_COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Modalidad {course.modality}
                    </span>
                    <span className="text-2xl font-black text-amber-400">
                      S/ {course.price.toFixed(2)}
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-3">
                    {course.name}
                  </h4>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Duración:</strong> {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Horario:</strong> {course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Incluye Certificación Oficial y Material Práctico</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                  <Link
                    href={`/chat?curso=${encodeURIComponent(course.name)}`}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-center text-sm hover:brightness-110 shadow-md transition-all"
                  >
                    Consultar o Reservar Vacante
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER & AVISO DE PRIVACIDAD LEY 29733 */}
      <footer className="mt-auto bg-[#070A12] border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-black">J</div>
                <span className="font-extrabold text-white tracking-wider">ORATORIA JANM ELITE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Institución líder en formación de oradores, líderes, profesionales y niños. Metodología práctica de alto impacto.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-4">Contacto Directo</h5>
              <p className="text-xs text-slate-300 mb-2">📞 Central Telefónica / WhatsApp: +51 984 512 345</p>
              <p className="text-xs text-slate-300 mb-2">✉️ Correo: contacto@oratoriajanmelite.com</p>
              <p className="text-xs text-slate-400">📍 Perú (Modalidades Presencial y Online en Vivo)</p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-4">Cumplimiento Legal y Privacidad</h5>
              <div className="p-4 rounded-2xl bg-[#0D1322] border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Ley N° 29733 (Perú)</span>
                </div>
                Sus datos son tratados estrictamente para la gestión de su solicitud académica. Puede solicitar la revocación o baja escribiendo la palabra &quot;BAJA&quot;.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} ORATORIA JANM ELITE. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-amber-400 transition-colors">Consola Administrativa</Link>
              <Link href="/chat" className="hover:text-amber-400 transition-colors">Atención en Línea</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Widget flotante interactivo de consulta */}
      <ChatWidget />
    </div>
  );
}
