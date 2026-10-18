export function descriptionPreview(text, limit = 180) {
  if (text.length <= limit) return text;
  const sentence = text.slice(0, limit).match(/^.*[.!?](?=\s|$)/)?.[0];
  return sentence ?? `${text.slice(0, limit).replace(/\s+\S*$/, '').trimEnd()}…`;
}
