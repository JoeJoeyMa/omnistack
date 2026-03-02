import { enMessages } from './messages/en'
import { zhMessages } from './messages/zh'
import { jpMessages } from './messages/jp'

export const messages = {
  en: enMessages,
  zh: zhMessages,
  jp: jpMessages,
}

export type AppLocale = keyof typeof messages