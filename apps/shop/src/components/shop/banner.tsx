export function AppDownloadBanner() {
  return (
    <a
      className="flex h-10 items-center justify-center gap-3 bg-[#111214] px-4 text-center text-[12px] font-medium text-white"
      href="/"
    >
      <span className="rounded-full bg-white/12 px-2 py-0.5 text-[11px]">
        Shop
      </span>
      <span>Download Shop app.</span>
      <span className="text-white/60">Available on iOS & Android</span>
    </a>
  );
}
