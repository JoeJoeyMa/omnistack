const DEFAULT_WEB_URL = "http://127.0.0.1:3000";
const LOCAL_ONLY_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

function parseUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function rewriteLocalUrlForCurrentHost(targetUrl: URL) {
  const currentUrl = new URL(window.location.origin);
  const rewrittenUrl = new URL(targetUrl.toString());

  rewrittenUrl.protocol = currentUrl.protocol;
  rewrittenUrl.hostname = currentUrl.hostname;
  rewrittenUrl.port = targetUrl.port || currentUrl.port;

  return rewrittenUrl;
}

export function getShopWebBaseUrl() {
  const configuredWebUrl = import.meta.env.VITE_WEB_URL?.trim();

  if (typeof window === "undefined") {
    return configuredWebUrl || DEFAULT_WEB_URL;
  }

  const targetUrl = parseUrl(configuredWebUrl || DEFAULT_WEB_URL);

  if (!targetUrl) {
    return configuredWebUrl || DEFAULT_WEB_URL;
  }

  if (
    LOCAL_ONLY_HOSTS.has(targetUrl.hostname.toLowerCase()) &&
    !LOCAL_ONLY_HOSTS.has(window.location.hostname.toLowerCase())
  ) {
    return rewriteLocalUrlForCurrentHost(targetUrl).toString();
  }

  return targetUrl.toString();
}

export function getShopLoginUrl(returnTo = window.location.href) {
  const loginUrl = new URL("/login", getShopWebBaseUrl());
  loginUrl.searchParams.set("returnTo", returnTo);
  return loginUrl.toString();
}
