// Change only this mount path when extracting to a standalone site.
export const SUMMIT_BASE = '/technlsummit';
export const summitPath = (path = '') => `${SUMMIT_BASE}/${path}`.replace(/\/$/, '') || '/';
export const navigation = [
  { label: 'Home', path: '' },
  { label: 'Sessions', path: 'sessions' },
  { label: 'Speakers', path: 'speakers' },
  { label: 'Companies', path: 'companies' },
];
