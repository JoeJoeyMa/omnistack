import { enMessages } from "./messages/en";
import { jpMessages } from "./messages/jp";
import { zhMessages } from "./messages/zh";

export const messages = {
  en: enMessages,
  zh: zhMessages,
  jp: jpMessages,
};

export type AppLocale = keyof typeof messages;
