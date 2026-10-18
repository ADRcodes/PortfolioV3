import { Linkedin } from 'lucide-react';

export const linkedInUrl = item => item.urls.find(link => {
  const url = new URL(link.url);
  return /(^|\.)linkedin\.com$/.test(url.hostname) && (url.pathname.startsWith('/in/') || url.pathname.startsWith('/company/'));
})?.url;

export default function LinkedInLink({ item }) {
  const url = linkedInUrl(item);
  if (!url) return null;
  return <a className="summit-social-link" href={url} target="_blank" rel="noreferrer" aria-label={`${item.name} on LinkedIn (opens in a new tab)`} title={`${item.name} on LinkedIn`}><Linkedin size={21} aria-hidden="true" /></a>;
}
