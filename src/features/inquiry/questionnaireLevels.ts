
export type LeadLevel = 'rychly' | 'standard' | 'deep';
export interface LevelConfig { id: LeadLevel; label: string; shortLabel: string; title: string; hint: string; dotColor: string; }
export const LEVEL_CONFIG: Record<LeadLevel, LevelConfig> = {
  rychly: { id: 'rychly', label: 'Rychlý', shortLabel: '2 min', title: 'Rychlý dotaz • 2 minuty', hint: 'Pro ty co nechtějí psát esej', dotColor: '#040b8d' },
  standard: { id: 'standard', label: 'Standard', shortLabel: '5 min', title: 'Kde vám utíká čas? • 5 minut', hint: 'Ideální start - 80% podstaty', dotColor: '#cda24d' },
  deep: { id: 'deep', label: 'Deep dive', shortLabel: '15 min', title: 'Deep dive pro nejlepší řešení • 15 minut', hint: 'Nejlevnější + nejrychlejší návrh', dotColor: '#ac0001' },
};
export const TEAM_SIZE = ['1-3','4-10','11-30','30+'] as const;
export const TOOLS = ['Gmail','Outlook','Excel','Pohoda','Notion','Slack','Shoptet','Helios','Pipedrive','Make/n8n','Zapier','Airtable','Fakturoid','Raynet'] as const;
export const HOURS = ['2-5h týdně','5-15h týdně','15-40h týdně','40h+ týdně'] as const;
export const DATA_HANDLING = ['Cloud OK','Musí zůstat lokálně','Nevím - poradíte','Hybrid'] as const;
