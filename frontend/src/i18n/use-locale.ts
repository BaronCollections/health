"use client"

import { useLocaleContext } from "./locale-context"

export function useLocale() {
  return useLocaleContext()
}
