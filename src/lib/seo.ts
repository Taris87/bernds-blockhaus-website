export function getCanonicalUrl(path: string) {
  return new URL(path.replace(/^\//, ''), 'https://taris87.github.io/bernds-blockhaus-website/').toString();
}
