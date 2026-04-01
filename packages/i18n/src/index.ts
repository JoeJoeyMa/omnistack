import { enMessages } from "./messages/en";
import { jpMessages } from "./messages/jp";
import { zhMessages } from "./messages/zh";

export type CopyMessages = Record<string, string>;
export type AppMessages = {
  localeLabel: string;
  copy: CopyMessages;
};

export const messages = {
  en: enMessages,
  zh: zhMessages,
  jp: jpMessages,
} satisfies Record<string, AppMessages>;

export const appLocales = ["en", "zh"] as const;
export const defaultLocale = "en";

export type AppLocale = (typeof appLocales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}
