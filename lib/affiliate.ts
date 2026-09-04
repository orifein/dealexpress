/** Real DEAL EXPRESS affiliate IDs only. Never invent tags. Never strip these. */

const AMAZON_COM_TAG = "dealexpress20-20";
const AMAZON_DE_TAG = "dealexpress21-21";
const IHERB_RCODE = "DBO0874";
const AE_GATEWAY = "glo2isr";
const SHEIN_URL_FROM = "GM71036732507";

function hostOf(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/**
 * `gatewayAdapt=glo2isr` only switches AliExpress to the Israel storefront
 * (region/currency) — it is NOT affiliate tracking. There is no query param
 * that makes a plain aliexpress.com/item link count as an affiliate sale.
 * Real tracking only comes from a `https://s.click.aliexpress.com/e/_...`
 * link generated per-product in the AliExpress Affiliate Portal
 * (portals.aliexpress.com); those links already carry the affiliate id in
 * the short code and must be stored as-is in `affiliateUrl` — never rewrite
 * or append params to them here.
 */
function withAliExpressGateway(url: URL): string {
  url.searchParams.set("gatewayAdapt", AE_GATEWAY);
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

    if (host === "s.click.aliexpress.com") {
      // Real Affiliate Portal short link — the affiliate id is baked into
      // the short code itself, so return it untouched.
      return parsed.toString();
    }

    if (parsed.pathname.includes("deep_link")) {
      const target = parsed.searchParams.get("dl_target_url");
      if (target) {
        return withAliExpressGateway(new URL(target));
      }
    }

    if (host === "aliexpress.com" || host.endsWith(".aliexpress.com")) {
      // Plain product link, no real affiliate tracking — see the comment
      // above withAliExpressGateway(). content/deals files should not ship
      // with this as their affiliateUrl; QA blocks it before publish.
      return withAliExpressGateway(parsed);
    }

    if (host === "shein.com" || host.endsWith(".shein.com")) {
      parsed.searchParams.set("url_from", SHEIN_URL_FROM);
      return parsed.toString();
    }

    return parsed.toString();
  } catch {
    return url;
  }
}
