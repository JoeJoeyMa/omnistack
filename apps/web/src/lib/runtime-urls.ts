const DEFAULT_SERVER_URL = "http://127.0.0.1:3001";
const DEFAULT_SHOP_URL = "http://127.0.0.1:3005";
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

  return rewrittenUrl.toString();
}

function resolveRuntimeUrl(configuredUrl: string | undefined, fallbackUrl: string) {
  const resolvedUrl = configuredUrl?.trim() || fallbackUrl;

  if (typeof window === "undefined") {
    return resolvedUrl;
  }

  const targetUrl = parseUrl(resolvedUrl);

  if (!targetUrl) {
    return resolvedUrl;
  }

  if (
    LOCAL_ONLY_HOSTS.has(targetUrl.hostname.toLowerCase()) &&
    !LOCAL_ONLY_HOSTS.has(window.location.hostname.toLowerCase())
  ) {
    return rewriteLocalUrlForCurrentHost(targetUrl);
  }

  return resolvedUrl;
}

export function getWebServerUrl() {
  return resolveRuntimeUrl(import.meta.env.VITE_SERVER_URL, DEFAULT_SERVER_URL);
}

export function getWebAuthBaseUrl() {
  return new URL("/api/auth/", getWebServerUrl()).toString();
}

export function getWebShopUrl() {
  return resolveRuntimeUrl(import.meta.env.VITE_SHOP_URL, DEFAULT_SHOP_URL);
}
