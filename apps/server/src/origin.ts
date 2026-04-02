type ResolveWebOriginOptions = {
  configuredWebOrigin: string;
  configuredShopOrigin?: string;
  requestOrigin?: string | null;
  serverOrigin: string;
};

const loopbackHosts = new Set(["127.0.0.1", "::1", "localhost"]);

function parseOrigin(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".");

  if (parts.length !== 4) {
    return false;
  }

  const octets = parts.map((part) => Number.parseInt(part, 10));

  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  const [first, second] = octets;

  return (
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isLocalHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase();
  return (
    loopbackHosts.has(normalizedHostname) || isPrivateIpv4(normalizedHostname)
  );
}

function isLocalOrigin(url: URL | null) {
  return Boolean(
    url &&
      (url.protocol === "http:" || url.protocol === "https:") &&
      isLocalHostname(url.hostname),
  );
}

function configuredOrigins(options: ResolveWebOriginOptions) {
  return [
    options.configuredWebOrigin,
    options.configuredShopOrigin,
  ]
    .map((value) => parseOrigin(value)?.origin ?? null)
    .filter((value): value is string => Boolean(value));
}

function rewriteOriginForRequestHost(origin: string, requestOriginUrl: URL) {
  const parsedOrigin = parseOrigin(origin);
  if (!parsedOrigin) {
    return null;
  }

  const rewrittenUrl = new URL(parsedOrigin.toString());
  rewrittenUrl.protocol = requestOriginUrl.protocol;
  rewrittenUrl.hostname = requestOriginUrl.hostname;

  return rewrittenUrl.origin;
}

function useDynamicLocalOrigins(options: ResolveWebOriginOptions) {
  const origins = configuredOrigins(options);

  return (
    origins.length > 0 &&
    origins.every((origin) => isLocalOrigin(parseOrigin(origin))) &&
    isLocalOrigin(parseOrigin(options.serverOrigin))
  );
}

function dynamicLocalOrigins(options: ResolveWebOriginOptions) {
  const requestOriginUrl = parseOrigin(options.requestOrigin);

  if (
    !requestOriginUrl ||
    !isLocalOrigin(requestOriginUrl) ||
    !useDynamicLocalOrigins(options)
  ) {
    return [];
  }

  return configuredOrigins(options)
    .map((origin) => rewriteOriginForRequestHost(origin, requestOriginUrl))
    .filter((origin): origin is string => Boolean(origin));
}

export function getRequestOrigin(request: Request) {
  const originHeader = parseOrigin(request.headers.get("origin"));

  if (originHeader) {
    return originHeader.origin;
  }

  const refererHeader = parseOrigin(request.headers.get("referer"));
  return refererHeader?.origin;
}

export function resolveWebOrigin({
  configuredWebOrigin,
  configuredShopOrigin,
  requestOrigin,
  serverOrigin,
}: ResolveWebOriginOptions) {
  const configuredOrigin = parseOrigin(configuredWebOrigin);
  const requestOriginUrl = parseOrigin(requestOrigin);
  const allowedConfiguredOrigins = new Set([
    ...configuredOrigins({
      configuredWebOrigin,
      configuredShopOrigin,
      requestOrigin,
      serverOrigin,
    }),
    ...dynamicLocalOrigins({
      configuredWebOrigin,
      configuredShopOrigin,
      requestOrigin,
      serverOrigin,
    }),
  ]);

  if (!configuredOrigin) {
    return requestOriginUrl?.origin ?? configuredWebOrigin;
  }

  if (!requestOriginUrl) {
    return configuredOrigin.origin;
  }

  if (allowedConfiguredOrigins.has(requestOriginUrl.origin)) {
    return requestOriginUrl.origin;
  }

  return configuredOrigin.origin;
}

export function getTrustedOrigins(options: ResolveWebOriginOptions) {
  return [
    ...new Set([
      resolveWebOrigin(options),
      ...configuredOrigins(options),
      ...dynamicLocalOrigins(options),
    ]),
  ];
}
