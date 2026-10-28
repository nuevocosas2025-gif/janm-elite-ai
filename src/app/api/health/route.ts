import { NextResponse } from 'next/server';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;

  let supabaseStatus = 'DISCONNECTED';
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from('courses').select('id').limit(1);
    if (!error) {
      supabaseStatus = 'CONNECTED';
    } else {
      supabaseStatus = `CONFIGURED_ERROR (${error.code || error.message})`;
    }
  } catch (e: any) {
    supabaseStatus = `ERROR: ${e.message}`;
  }

  return NextResponse.json({
    status: 'HEALTHY',
    product: 'JANM ELITE AI',
    company: 'ORATORIA JANM ELITE',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    integrations: {
      supabase: {
        configured: !!supabaseUrl && hasAnonKey,
        status: supabaseStatus,
      },
      aiProvider: {
        geminiConfigured: hasGemini,
        groqConfigured: hasGroq,
        mode: hasGemini ? 'Gemini 1.5 Flash' : hasGroq ? 'Groq Llama 3' : 'Heurístico Sin IA (Costo S/ 0)',
      },
      sheets: {
        configured: !!process.env.GOOGLE_SHEETS_ID,
      },
    },
  });
}
