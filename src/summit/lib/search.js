export const normalizeSearch = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export function matchesSearch(item, query, companies = []) {
  const haystack = normalizeSearch([item.name, item.description, ...companies.filter(company => item.companyIds?.includes(company.id)).map(company => company.name)].join(' '));
  return normalizeSearch(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word) || haystack.replace(/\s/g, '').includes(word));
}
