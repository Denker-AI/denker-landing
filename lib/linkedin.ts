const PARTNER_ID = "9957393";
const SCRIPT_ID = "li-insight-script";

type LinktrkFn = (action: string, data?: { conversion_id?: number }) => void;

function getLintrk(): LinktrkFn | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { lintrk?: LinktrkFn }).lintrk;
}

/**
 * Injects the LinkedIn Insight Tag script. Safe to call multiple times —
 * no-ops if the script is already present.
 */
export function loadLinkedIn(): void {
  if (typeof window === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  const w = window as unknown as {
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    lintrk?: LinktrkFn & { q?: unknown[][] };
  };

  w._linkedin_partner_id = PARTNER_ID;
  w._linkedin_data_partner_ids = w._linkedin_data_partner_ids ?? [];
  w._linkedin_data_partner_ids.push(PARTNER_ID);

  if (!w.lintrk) {
    const fn = function (a: string, b?: { conversion_id?: number }) {
      (fn.q = fn.q ?? []).push([a, b]);
    } as LinktrkFn & { q?: unknown[][] };
    fn.q = [];
    w.lintrk = fn;
  }

  const existing = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "text/javascript";
  script.async = true;
  script.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  existing.parentNode?.insertBefore(script, existing);
}

/**
 * Fire a LinkedIn conversion event. No-ops if conversionId is not provided
 * (env var not set) or if the tag has not loaded yet.
 */
export function trackLinkedInConversion(conversionId?: number): void {
  if (!conversionId) return;
  getLintrk()?.("track", { conversion_id: conversionId });
}
