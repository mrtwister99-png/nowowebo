import fs from 'fs';
import path from 'path';

type VercelRequest = {
  method?: string;
  body: unknown;
};

type VercelResponse = {
  status: (code: number) => {
    json: (data: unknown) => unknown;
  };
};

interface LeadBody {
  firma?: string;
  jmeno?: string;
  level?: string;
  [key: string]: unknown;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }
  
  try {
    const body = req.body as LeadBody;
    const ts = new Date().toISOString().replace(/[:.]/g,'-');
    
    const rawName = typeof body.firma === 'string' ? body.firma : 
                    typeof body.jmeno === 'string' ? body.jmeno : 'lead';
    const safe = rawName.toLowerCase().replace(/[^a-z0-9-]/g,'-').slice(0,30);
    const level = typeof body.level === 'string' ? body.level : 'unknown';
    const fileName = `${ts}--${level}--${safe}.json`;
    
    const tmpDir = '/tmp/loyo-leads';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(path.join(tmpDir, fileName), JSON.stringify(body, null, 2));
    
    console.log(`[LOYO LEAD] ${fileName}`);
    
    return res.status(200).json({ ok: true, file: fileName, saved: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}