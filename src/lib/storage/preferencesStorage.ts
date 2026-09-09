import { STORAGE_KEYS, type Theme, type ViewMode } from '@/lib/constants'
import { readStringFromStorage, writeStringToStorage } from '@/lib/storage/storage'

function isViewMode(value: string): value is ViewMode {
  return value === 'grid' || value === 'list'
}

function isTheme(value: string): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getStoredViewMode(): ViewMode | null {
  const value = readStringFromStorage(STORAGE_KEYS.viewMode, '')
  return isViewMode(value) ? value : null
}

export function setStoredViewMode(mode: ViewMode): void {
  writeStringToStorage(STORAGE_KEYS.viewMode, mode)
}

export function getStoredTheme(): Theme | null {
  const value = readStringFromStorage(STORAGE_KEYS.theme, '')
  return isTheme(value) ? value : null
}

export function setStoredTheme(theme: Theme): void {
  writeStringToStorage(STORAGE_KEYS.theme, theme)
}
