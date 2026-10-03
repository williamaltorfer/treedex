/**
 * crypto.randomUUID() only exists in secure contexts (HTTPS or localhost).
 * Testing over plain HTTP on the LAN (e.g. http://192.168.x.x:5173, which
 * iOS needs for the camera to work pre-deploy) is not secure, so fall back
 * to a non-cryptographic id in that case.
 */
export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
