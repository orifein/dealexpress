/** Real DEAL EXPRESS affiliate IDs only. Never invent tags. Never strip these. */

const AMAZON_COM_TAG = "dealexpress20-20";
const AMAZON_DE_TAG = "dealexpress21-21";
const IHERB_RCODE = "DBO0874";

function hostOf(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
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
    } else if (host === "amazon.de") {
      parsed.searchParams.set("tag", AMAZON_DE_TAG);
    } else if (host === "iherb.com") {
      parsed.searchParams.set("rcode", IHERB_RCODE);
    }

    return parsed.toString();
  } catch {
    return url;
  }
}
