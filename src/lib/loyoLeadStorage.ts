
export interface LoyoLead {
  id: string;
  level: import('./../features/inquiry/questionnaireLevels').LeadLevel;
  serviceId?: string;
  jmeno: string;
  firma: string;
  web: string;
  email: string;
  telefon: string;
  coZereCas: string;
  otazkaNaMe: string;
  doplnujici: string;
  // standard
  velikostTymu: string;
  nastroje: string[];
  proces1: string;
  proces2: string;
  proces3: string;
  hodinyTydne: string;
  chodDat: string;
  // deep
  detailPoptavka: string;
  chybyZdrzeni: string;
  lidiProces: string;
  uspech: string;
  loomLink: string;
  timestamp: string;
}

const STORAGE_KEY = 'loyo_leads_folder';

export function saveLeadToFolder(lead: LoyoLead) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.unshift(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    // also trigger download as file to simulate folder
    const blob = new Blob([JSON.stringify(lead, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeFirm = (lead.firma || lead.jmeno || 'lead').toLowerCase().replace(/[^a-z0-9-]/g,'-').slice(0,30);
    a.href = url;
    a.download = `${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}--${lead.level}--${safeFirm}.json`;
    // only auto-download for deep dive to avoid spam, for others just save
    if (lead.level === 'deep') {
      // a.click(); // uncomment if you want auto download
    }
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    return true;
  } catch (e) {
    console.warn('saveLeadToFolder failed', e);
    return false;
  }
}

export function sendLeadToEmail(lead: LoyoLead) {
  const subject = `LOYO [${lead.level.toUpperCase()}] - ${lead.firma || lead.jmeno} - ${lead.serviceId || 'automatizace'}`;
  let body = `NOVY LEAD - LOYO OS\n\n`;
  body += `Level: ${lead.level}\n`;
  body += `Sluzba: ${lead.serviceId || 'neuvedeno'}\n`;
  body += `Jmeno: ${lead.jmeno}\nFirma: ${lead.firma}\nWeb: ${lead.web}\nEmail: ${lead.email}\nTel: ${lead.telefon}\n\n`;
  body += `CO ZERE CAS:\n${lead.coZereCas}\n\n`;
  if (lead.level !== 'rychly') {
    body += `TOP 3 ZROUTI:\n1. ${lead.proces1}\n2. ${lead.proces2}\n3. ${lead.proces3}\nHodiny: ${lead.hodinyTydne} | Data: ${lead.chodDat} | Nastroje: ${lead.nastroje.join(', ')}\n\n`;
  }
  if (lead.level === 'deep') {
    body += `DETAIL POPTAVKY:\n${lead.detailPoptavka}\n\nChyby: ${lead.chybyZdrzeni}\nLidi: ${lead.lidiProces}\nUspech: ${lead.uspech}\nLoom: ${lead.loomLink}\n\n`;
  }
  body += `OTAZKA NA ME:\n${lead.otazkaNaMe}\n\nDoplnujici:\n${lead.doplnujici}\n\n---\nUlozeno v /data/leads/ (localStorage) + JSON`;
  
  const mailto = `mailto:loyo.gruup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailto, '_blank');
}

export async function saveLeadToApi(lead: LoyoLead) {
  try {
    // Pokud budeš mít Vercel function /api/loyo-lead, pošle se tam
    const res = await fetch('/api/loyo-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return res.ok;
  } catch {
    return false;
  }
}
