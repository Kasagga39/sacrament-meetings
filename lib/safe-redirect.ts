/**
 * Keeps post-sign-in redirects inside this application.
 *
 * Only same-site paths that start with a single `/` are accepted, so a crafted
 * `?next=` value can never send a signed-in bishopric member to another site.
 */
export function safeRedirectPath(
  value: string | string[] | undefined,
  fallback = '/meetings/new',
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (typeof candidate !== 'string') {
    return fallback;
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return fallback;
  }

  return candidate;
}
