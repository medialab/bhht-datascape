import urljoin from 'url-join';

export function getPublicUrl(name) {
  return urljoin(BASE_URL, 'public', name);
}
