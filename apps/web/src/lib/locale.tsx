import {
  type AppLocale,
  type CopyMessages,
  defaultLocale,
  isAppLocale,
  messages,
} from "@maple-global/i18n";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const localeStorageKey = "maple-locale";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  copy: CopyMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function localizeValue<T>(value: T, copy: CopyMessages): T {
  if (typeof value === "string") {
    return (copy[value] ?? value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeValue(item, copy)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        localizeValue(item, copy),
      ]),
    ) as T;
  }

  return value;
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    if (typeof window === "undefined") {
      return defaultLocale;
    }

    const stored = window.localStorage.getItem(localeStorageKey);
    return stored && isAppLocale(stored) ? stored : defaultLocale;
  });

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      copy: messages[locale].copy,
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}

export function useCopyText() {
  const { copy } = useLocale();

  return useMemo(() => (text: string) => copy[text] ?? text, [copy]);
}

export function useLocalizedValue<T>(value: T): T {
  const { copy } = useLocale();

  return useMemo(() => localizeValue(value, copy), [copy, value]);
}
