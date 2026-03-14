"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { messagesByLocale, type MessageKey } from "./messages"
import type { Locale } from "./types"

const LOCALE_STORAGE_KEY = "mintbit-locale"
const DEFAULT_LOCALE: Locale = "zh-CN"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: MessageKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)

  if (storedLocale === "zh-CN" || storedLocale === "en") {
    return storedLocale
  }

  return DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setLocaleState(getInitialLocale())
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => {
    return {
      locale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale)
      },
      toggleLocale: () => {
        setLocaleState((currentLocale) => (currentLocale === "zh-CN" ? "en" : "zh-CN"))
      },
      t: (key) => messagesByLocale[locale][key],
    }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocaleContext() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocaleContext must be used within a LocaleProvider")
  }

  return context
}
