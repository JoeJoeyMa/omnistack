import { cn } from "~/components/ui/button";
import { useLocale } from "~/lib/locale";

const locales = [
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
] as const;

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex h-9 items-center rounded-full border border-gray-200 bg-white/80 p-1 text-[13px] font-medium dark:border-white/10 dark:bg-white/5">
      {locales.map((item) => (
        <button
          className={cn(
            "inline-flex h-7 items-center justify-center rounded-full px-3 transition-colors",
            locale === item.value
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white",
          )}
          key={item.value}
          onClick={() => setLocale(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
