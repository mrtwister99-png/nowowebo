// api/loyo-lead.ts — Vercel funkce: dotazník z webu → e-mail s výsledky.
//
// Formulář (src/features/inquiry/QuestionnaireModal.tsx) pošle POST /api/loyo-lead s vyplněnými poli.
// Funkce pole zkontroluje, odfiltruje boty a pošle e-mail přes SMTP (Gmail + heslo pro aplikace):
//   Předmět: [LOYO-DOTAZNIK] <úroveň> · <firma nebo jméno>
//   Text:    čitelné shrnutí + na konci strojově čitelný blok JSON mezi značkami LOYO-DOTAZNIK-JSON
//            (podle nich dotazník pozná a zpracuje agent Luuu v LoYo OS)
//   Reply-To: e-mail návštěvníka → „Odpovědět“ jde rovnou jemu.
//
// Proměnné (Vercel → Settings → Environment Variables; repo je veřejné, adresy ani hesla sem nepatří):
//   LEAD_SMTP_USER   adresa schránky, ze které se posílá (např. Gmail webu)
//   LEAD_SMTP_PASS   heslo pro aplikace té schránky (Google účet → Zabezpečení → Hesla aplikací)
//   LEAD_TO          kam výsledky poslat (víc adres oddělit čárkou), nevyplněno = LEAD_SMTP_USER
//   LEAD_SMTP_HOST / LEAD_SMTP_PORT   nepovinné, výchozí smtp.gmail.com:465
// Bez SMTP údajů vrátí 503 a formulář ukáže chybu s možností poslat odpovědi z vlastního e-mailu.
import nodemailer from 'nodemailer';

type VercelRequest = { method?: string; body: unknown; headers: Record<string, string | string[] | undefined> };
type VercelResponse = { status: (code: number) => { json: (data: unknown) => unknown } };

const MARK_START = '--- LOYO-DOTAZNIK-JSON ---';
const MARK_END = '--- /LOYO-DOTAZNIK-JSON ---';
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const LEVELS: Record<string, string> = { rychly: 'Rychlý (2 min)', standard: 'Standard (5 min)', deep: 'Deep dive (15 min)' };

// pole formuláře a jejich popisky v e-mailu (pořadí = pořadí v e-mailu)
const SECTIONS: { title: string; fields: [string, string][] }[] = [
  { title: 'KONTAKT', fields: [['jmeno', 'Jméno'], ['firma', 'Firma'], ['web', 'Web'], ['email', 'E-mail'], ['telefon', 'Telefon']] },
  { title: 'CO ŽERE ČAS', fields: [['coZereCas', 'Co žere čas'], ['proces1', 'Proces 1'], ['proces2', 'Proces 2'], ['proces3', 'Proces 3'], ['hodinyTydne', 'Hodin týdně'], ['velikostTymu', 'Velikost týmu'], ['nastroje', 'Nástroje'], ['chodDat', 'Data'], ['citlivost', 'Citlivost dat'], ['api', 'API / napojení']] },
  { title: 'DETAIL', fields: [['detailPoptavka', 'Detail poptávky'], ['chybyZdrzeni', 'Chyby a zdržení'], ['lidiProces', 'Lidé v procesu'], ['uspech', 'Co je úspěch'], ['detektivka', 'Detektivka'], ['budget', 'Rozpočet'], ['timeline', 'Termín'], ['loomLink', 'Video (Loom)']] },
  { title: 'OTÁZKY', fields: [['otazkaNaMe', 'Otázka na mě'], ['doplnujici', 'Doplňující']] },
];
const KNOWN = new Set(['id', 'level', 'serviceId', 'timestamp', ...SECTIONS.flatMap((s) => s.fields.map(([k]) => k))]);

/** jen známá pole, texty oříznuté, pole řetězců max 20 položek — nic dalšího z formuláře neprojde */
function clean(body: Record<string, unknown>): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!KNOWN.has(k)) continue;
    if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === 'string').slice(0, 20).map((x) => x.slice(0, 100));
    else if (typeof v === 'string') out[k] = v.trim().slice(0, k === 'detailPoptavka' || k === 'coZereCas' ? 5000 : 2000);
  }
  return out;
}

// jednoduchá brzda proti spamu: max 5 odeslání z jedné IP za 10 min (paměť instance funkce)
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'jen POST' });
  const body = (typeof req.body === 'string' ? safeJson(req.body) : req.body) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, error: 'prázdný formulář' });

  // past na boty: skryté pole, které člověk nevidí, a formulář odeslaný rychleji než za 3 s
  if (typeof body.website2 === 'string' && body.website2.trim()) return res.status(200).json({ ok: true });
  const openedAt = Number(body.openedAt);
  if (openedAt && Date.now() - openedAt < 3000) return res.status(200).json({ ok: true });

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'neznámá';
  if (tooMany(ip)) return res.status(429).json({ ok: false, error: 'příliš mnoho odeslání, zkuste to za pár minut' });

  const lead = clean(body);
  const email = String(lead.email ?? '');
  if (!String(lead.jmeno ?? '').trim() || !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: 'jméno a platný e-mail jsou povinné' });

  const user = process.env.LEAD_SMTP_USER;
  const pass = (process.env.LEAD_SMTP_PASS ?? '').replace(/\s+/g, '');
  if (!user || !pass) return res.status(503).json({ ok: false, error: 'odesílání není nastavené' });
  const to = process.env.LEAD_TO || user;

  const level = String(lead.level ?? 'standard');
  const who = String(lead.firma || lead.jmeno);
  const subject = `[LOYO-DOTAZNIK] ${level} · ${who}`.slice(0, 160);
  const receivedAt = new Date().toISOString();
  const payload = { ...lead, receivedAt, source: 'totujestenebylo.cz' };

  const lines: string[] = [
    `Nový dotazník z webu — ${LEVELS[level] ?? level}${lead.serviceId ? ` · služba: ${lead.serviceId}` : ''}`,
    `Přijato: ${new Date(receivedAt).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}`,
    '',
  ];
  for (const s of SECTIONS) {
    const rows = s.fields
      .map(([k, label]) => [label, lead[k]] as const)
      .filter(([, v]) => (Array.isArray(v) ? v.length : String(v ?? '').trim()));
    if (!rows.length) continue;
    lines.push(`== ${s.title} ==`);
    for (const [label, v] of rows) {
      const val = Array.isArray(v) ? v.join(', ') : String(v);
      lines.push(val.includes('\n') ? `${label}:\n${val}` : `${label}: ${val}`);
    }
    lines.push('');
  }
  lines.push('Odpovědět = napíšete rovnou zákazníkovi (Reply-To).', '', MARK_START, JSON.stringify(payload, null, 2), MARK_END);

  try {
    const port = Number(process.env.LEAD_SMTP_PORT) || 465;
    const t = nodemailer.createTransport({ host: process.env.LEAD_SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, auth: { user, pass } });
    await t.sendMail({ from: `"Web — dotazník" <${user}>`, to, replyTo: email, subject, text: lines.join('\n') });
    return res.status(200).json({ ok: true });
  } catch (error: unknown) {
    console.error('[loyo-lead] odeslání selhalo', error instanceof Error ? error.message : error);
    return res.status(502).json({ ok: false, error: 'e-mail se nepodařilo odeslat' });
  }
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}
