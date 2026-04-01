import { useEffect } from "react";

const chatwootBaseUrl = import.meta.env.VITE_CHATWOOT_BASE_URL?.trim();
const chatwootWebsiteToken = import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN?.trim();

export function ChatwootWidget() {
  useEffect(() => {
    if (!chatwootBaseUrl || !chatwootWebsiteToken) {
      return;
    }

    const scriptSrc = new URL("/packs/js/sdk.js", chatwootBaseUrl).toString();
    const existingRun = (window as Window & {
      chatwootSDK?: {
        run: (options: { websiteToken: string; baseUrl: string }) => void;
      };
    }).chatwootSDK;

    if (existingRun) {
      existingRun.run({
        websiteToken: chatwootWebsiteToken,
        baseUrl: chatwootBaseUrl,
      });
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`,
    );

    const runWidget = () => {
      const sdk = (window as Window & {
        chatwootSDK?: {
          run: (options: { websiteToken: string; baseUrl: string }) => void;
        };
      }).chatwootSDK;

      sdk?.run({
        websiteToken: chatwootWebsiteToken,
        baseUrl: chatwootBaseUrl,
      });
    };

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        runWidget();
        return;
      }

      existingScript.addEventListener("load", runWidget, { once: true });
      return () => {
        existingScript.removeEventListener("load", runWidget);
      };
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      runWidget();
    };
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return null;
}
