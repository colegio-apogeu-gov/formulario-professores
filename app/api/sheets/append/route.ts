export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { SignJWT, importPKCS8 } from 'jose';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

async function getAccessToken() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL!;
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY!;
  if (!clientEmail || !privateKey) throw new Error('Missing SA envs');
  privateKey = privateKey.replace(/\\n/g, '\n'); // 🔑 importante

  const key = await importPKCS8(privateKey, 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({ scope: SHEETS_SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const { access_token } = await res.json();
  return access_token;
}

async function appendToSheet(values: (string | number | null)[][], range = 'Respostas!A:Z') {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID');

  const accessToken = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const row = [[
      new Date().toISOString(),
      data.user_id ?? '',
      data.user_name ?? '',
      data.unidade ?? '',
      data.nome_professor ?? '',
      data.regional ?? '',
      data.cadastro ?? '',
      data.admissao ?? '',
      data.cpf ?? '',
      data.cargo ?? '',
      data.local ?? '',
      data.escola ?? '',
      data.horas_mes ?? '',
      data.horas_semana ?? '',
      data.observacoes_sala_aula ?? '',
      data.feedback_evolucao ?? '',
      data.planejamento_org ?? '',
      data.dominio_conteudo ?? '',
      data.gestao_aprendizagem ?? '',
      data.comunicacao_rel ?? '',
      data.postura_prof ?? '',
      data.consideracoes ?? '',
    ]];

    await appendToSheet(row, 'Respostas!A:Z');
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('[Sheets append] error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
