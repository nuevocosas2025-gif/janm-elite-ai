import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sheetId = body.sheetId || process.env.GOOGLE_SHEETS_ID;
    const tabName = body.tabName || process.env.GOOGLE_SHEETS_TAB_NAME || 'Contactos';

    if (!sheetId) {
      return NextResponse.json(
        { error: 'ID de Google Sheets no especificado ni en la petición ni en variables de entorno.' },
        { status: 400 }
      );
    }

    const report = await googleSheetsService.executeSync(sheetId, tabName);
    return NextResponse.json({ success: true, report });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
