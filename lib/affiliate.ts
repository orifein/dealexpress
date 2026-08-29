/** Outbound store links must stay clean. Never invent or inject affiliate IDs. */

const blockedParams = ["tag", "ascsubtag", "linkCode", "linkId", "ref_", "asc_campaign"];

export function cleanStoreUrl(url: string): string {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    for (const key of blockedParams) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
