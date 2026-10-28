import { NextRequest, NextResponse } from 'next/server';
import { activeAIProvider } from '@/services/aiProvider';
import { sanitizeUserMessage } from '@/lib/security';
import { agentTools } from '@/services/agentTools';

// Simple in-memory rate limiter por IP (previene abusos en serverless)
const requestCounts = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || entry.expiresAt < now) {
    requestCounts.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }
  if (entry.count >= 20) {
    return false; // más de 20 mensajes por minuto
  }
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Límite de solicitudes alcanzado. Por favor espera un momento.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, leadData } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Formato de mensajes inválido' }, { status: 400 });
    }

    // Si viene leadData enviado explícitamente desde el formulario de contacto del chat
    if (leadData && leadData.fullName && (leadData.phone || leadData.email)) {
      const leadRes = await agentTools.createProspect({
        fullName: leadData.fullName,
        phone: leadData.phone,
        email: leadData.email,
        courseName: leadData.courseName,
        notes: leadData.notes || 'Registrado desde formulario integrado del chat',
      });

      if (!leadRes.success) {
        return NextResponse.json({ error: leadRes.error }, { status: 400 });
      }

      return NextResponse.json({
        response: {
          message: `¡Excelente, ${leadData.fullName}! 🎉 Tus datos han sido registrados en nuestro sistema de admisiones.\n\nUn asesor académico de **ORATORIA JANM ELITE** se comunicará contigo muy pronto para brindarte la asesoría personalizada y confirmar tu cupo.`,
          provider: 'system',
          leadCaptured: true,
        },
      });
    }

    const lastMessage = messages[messages.length - 1];
    const validation = sanitizeUserMessage(lastMessage.content);

    if (!validation.isSafe) {
      return NextResponse.json({
        response: {
          message: `🛡️ Advertencia: ${validation.reason || 'Consulta bloqueada por protocolo de seguridad.'}`,
          provider: 'no_ia_heuristic',
        },
      });
    }

    // Enviar al proveedor de IA activo
    const aiResponse = await activeAIProvider.sendMessage(messages);

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      {
        response: {
          message: 'Lo sentimos, ocurrió un inconveniente temporal. Si deseas atención inmediata, puedes contactar a nuestro asesor al +51 984 512 345.',
          provider: 'no_ia_heuristic',
        },
      },
      { status: 500 }
    );
  }
}
