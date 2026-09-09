export function readJsonFromStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!validate(parsed)) return fallback
    return parsed
  } catch {
    return fallback
  }
}

export function writeJsonToStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readStringFromStorage(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

export function writeStringToStorage(key: string, value: string): void {
  window.localStorage.setItem(key, value)
}
