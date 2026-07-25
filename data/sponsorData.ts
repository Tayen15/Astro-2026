export interface Sponsor {
  name: string;
  tier: 'platinum' | 'gold' | 'silver';
  website?: string;
}

export interface MediaPartner {
  name: string;
  website?: string;
}

export const sponsors: Sponsor[] = [
  { name: 'Telkom Indonesia', tier: 'platinum', website: 'https://www.telkom.co.id' },
  { name: 'Gojek', tier: 'platinum', website: 'https://www.gojek.com' },
  { name: 'Bank Mandiri', tier: 'gold', website: 'https://www.bankmandiri.co.id' },
  { name: 'Lazada', tier: 'silver', website: 'https://www.lazada.co.id' },
  { name: 'Shopee', tier: 'silver', website: 'https://shopee.co.id' },
];

export const mediaPartners: MediaPartner[] = [
  { name: 'Kompas', website: 'https://www.kompas.com' },
  { name: 'Detik', website: 'https://www.detik.com' },
  { name: 'Tribun News', website: 'https://www.tribunnews.com' },
  { name: 'Vice Indonesia', website: 'https://www.vice.com/id' },
  { name: 'Whiteboard Journal', website: 'https://www.whiteboardjournal.com' },
  { name: 'Pinhome', website: 'https://www.pinhome.id' },
];
