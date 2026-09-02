/** Real DEAL EXPRESS affiliate IDs only. Never invent tags. Never strip these. */

const AMAZON_COM_TAG = "dealexpress20-20";
const AMAZON_DE_TAG = "dealexpress21-21";
const IHERB_RCODE = "DBO0874";
const AE_TRACKING_ID = "deal_express";
const AE_GATEWAY = "glo2isr";

function hostOf(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function withAliExpressParams(url: URL): string {
  url.searchParams.set("gatewayAdapt", AE_GATEWAY);
  url.searchParams.set("tracking_id", AE_TRACKING_ID);
  return url.toString();
}

export function affiliateUrl(url: string): string {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const host = hostOf(parsed.hostname);

    if (host === "amazon.com") {
      parsed.searchParams.set("tag", AMAZON_COM_TAG);
      return parsed.toString();
    }
    if (host === "amazon.de") {
      parsed.searchParams.set("tag", AMAZON_DE_TAG);
      return parsed.toString();
    }
    if (host === "iherb.com") {
      parsed.searchParams.delete("IHERB30");
      parsed.searchParams.delete("iherb30");
      parsed.searchParams.set("rcode", IHERB_RCODE);
      return parsed.toString();
    }

    if (host === "s.click.aliexpress.com" || parsed.pathname.includes("deep_link")) {
      const target = parsed.searchParams.get("dl_target_url");
      if (target) {
        return withAliExpressParams(new URL(target));
      }
    }

    if (host === "aliexpress.com" || host.endsWith(".aliexpress.com")) {
      return withAliExpressParams(parsed);
    }

    return parsed.toString();
  } catch {
    return url;
  }
}
