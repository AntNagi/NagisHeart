function getRepositoryRootUrl() {
  const href = window.location.href.split(/[?#]/)[0];
  const marker = '/web/';
  const markerIndex = href.indexOf(marker);
  if (markerIndex >= 0) {
    return href.slice(0, markerIndex + 1);
  }
  return href.endsWith('/') ? href : href.slice(0, href.lastIndexOf('/') + 1);
}

export function repoAssetUrl(path) {
  const cleanPath = String(path || '').replace(/^(\.\.\/)+/, '').replace(/^\//, '');
  return `${getRepositoryRootUrl()}${cleanPath}`;
}
