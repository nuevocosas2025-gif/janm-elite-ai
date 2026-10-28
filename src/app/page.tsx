import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ChatWidget } from '@/components/ChatWidget';
import { FALLBACK_COURSES } from '@/services/courseService';
import { 
  Award, 
  Mic, 
  Users, 
  Video, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-janm-dark text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-6 shadow-gold-sm">
            <Sparkles className="w-3.5 h-3.5 text-janm-gold" />
            <span>JANM ELITE AI · Plataforma de Admisiones y Formación de Líderes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Domina el Arte de <br />
            <span className="gold-text-gradient">Hablar con Poder</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Vence el miedo escénico, modula tu voz y proyecta autoridad. En **ORATORIA JANM ELITE** transformamos tu capacidad de oratoria con una metodología 80% práctica y certificación oficial con valor curricular.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-bold text-base hover:brightness-110 shadow-gold-md hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <MessageSquare className="w-5 h-5 text-black" />
              <span>Consultar con Asistente IA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#cursos"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-zinc-700 bg-janm-surface hover:bg-janm-surfaceLight hover:border-amber-400/50 text-white font-medium text-base transition-all"
            >
              Ver Catálogo y Horarios
            </Link>
          </div>

          {/* Estadísticas de Confianza */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-janm-border/40">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">+1,500</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Líderes Graduados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">80% / 20%</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Práctica / Teoría</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Certificación Válida</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">24/7</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Atención JANM AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section id="metodologia" className="py-20 bg-janm-surface/40 border-y border-janm-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-janm-gold">Método Comprobado</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              ¿Por qué los profesionales eligen JANM Elite?
            </h3>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">
              Aprender oratoria no es memorizar discursos, sino dominar la fisiología, la convicción y la técnica argumentativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-janm-surface border border-janm-border hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Vence el Miedo Escénico</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ejercicios de respiración diafragmática y desensibilización sistemática para eliminar temblores, nudos en la garganta y bloqueos mentales.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-janm-surface border border-janm-border hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Simulacros y Video Feedback</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Prácticas reales grabadas en alta definición frente a público para corregir postura, gesticulación, microexpresiones y muletillas en tiempo real.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-janm-surface border border-janm-border hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Certificación Curricular</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Diploma oficial respaldado por la Academia con código QR verificable para potenciar tu currículum, ascensos laborales o sustentaciones de tesis.
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-janm-gold">Programas Académicos</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Catálogo Oficial de Cursos
              </h3>
            </div>
            <p className="text-zinc-400 text-sm max-w-md mt-4 md:mt-0">
              Tarifas transparentes en Soles (PEN), sin costos ocultos, con facilidades de pago en cuotas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FALLBACK_COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-janm-surface border border-janm-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-gold-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Modalidad {course.modality}
                    </span>
                    <span className="text-2xl font-extrabold text-amber-400">
                      S/ {course.price.toFixed(2)}
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-3">
                    {course.name}
                  </h4>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-janm-border/60 text-xs sm:text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-janm-gold shrink-0" />
                      <span><strong>Duración:</strong> {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-janm-gold shrink-0" />
                      <span><strong>Horario:</strong> {course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Incluye Certificación y Material Didáctico</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-janm-border/60 flex items-center gap-3">
                  <Link
                    href={`/chat?curso=${encodeURIComponent(course.name)}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-center text-sm hover:brightness-110 shadow-gold-sm transition-all"
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
      <footer className="mt-auto bg-black border-t border-janm-border/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-black">J</div>
                <span className="font-bold text-white tracking-wider">ORATORIA JANM ELITE</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Institución líder en formación de oradores, líderes, profesionales y niños. Metodología práctica de alto impacto.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-4">Contacto Directo</h5>
              <p className="text-xs text-zinc-400 mb-2">📞 Central Telefónica / WhatsApp: +51 984 512 345</p>
              <p className="text-xs text-zinc-400 mb-2">✉️ Correo: contacto@oratoriajanmelite.com</p>
              <p className="text-xs text-zinc-400">📍 Perú (Modalidades Presencial y Online en Vivo)</p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-4">Cumplimiento Legal y Privacidad</h5>
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ley N° 29733 (Perú)</span>
                </div>
                Sus datos son tratados estrictamente para la gestión de su solicitud académica. Puede solicitar la revocación o baja escribiendo a nuestro asistente con la palabra &quot;BAJA&quot;.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} ORATORIA JANM ELITE. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-amber-400 transition-colors">Portal Administrativo</Link>
              <Link href="/chat" className="hover:text-amber-400 transition-colors">Asistente IA</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Widget flotante interactivo de chatbot */}
      <ChatWidget />
    </div>
  );
}
