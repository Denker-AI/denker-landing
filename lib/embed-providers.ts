export type ProviderId = "youtube" | "vimeo" | "twitch" | "loom" | "wistia";

type AllowedParams = Record<string, string>;

interface ProviderSpec {
  id: ProviderId;
  hostMatches: RegExp[];
  idRegex: RegExp;
  buildEmbedUrl(id: string, params: AllowedParams): string;
  allowedParams: readonly string[];
}

const PROVIDERS: ProviderSpec[] = [
  {
    id: "youtube",
    hostMatches: [/(?:^|\.)youtube(?:-nocookie)?\.com$/i, /^youtu\.be$/i],
    idRegex: /^[A-Za-z0-9_-]{6,20}$/,
    buildEmbedUrl(id, params) {
      // YouTube returns "Error 153 / Video player configuration error" when
      // the embedding page can't be validated. Stamp `origin` and
      // `widget_referrer` with our canonical https domain so the embed
      // attribution lands somewhere YouTube accepts. Set after caller params
      // so they cannot be overridden by the allow-listed inputs.
      const sp = new URLSearchParams({ ...params });
      sp.set("origin", "https://denker.ai");
      sp.set("widget_referrer", "https://denker.ai");
      return `https://www.youtube-nocookie.com/embed/${id}?${sp.toString()}`;
    },
    allowedParams: ["t", "start", "autoplay", "loop", "mute", "controls", "rel"],
  },
  {
    id: "vimeo",
    hostMatches: [/(?:^|\.)vimeo\.com$/i],
    idRegex: /^\d+$/,
    buildEmbedUrl(id, params) {
      const sp = new URLSearchParams({ ...params });
      const qs = sp.toString();
      return `https://player.vimeo.com/video/${id}${qs ? `?${qs}` : ""}`;
    },
    allowedParams: ["h", "dnt", "autoplay", "loop", "muted"],
  },
  {
    id: "twitch",
    hostMatches: [/(?:^|\.)twitch\.tv$/i],
    // channel ids are prefixed with "channel:" in the proxy id param
    idRegex: /^(\d+|channel:[A-Za-z0-9_]{4,25})$/,
    buildEmbedUrl(id, params) {
      const sp = new URLSearchParams();
      if (id.startsWith("channel:")) {
        sp.set("channel", id.slice(8));
      } else {
        sp.set("video", id);
      }
      for (const [k, v] of Object.entries(params)) {
        sp.set(k, v);
      }
      // Twitch requires parent= to match the embedding host. Set last so a
      // caller-supplied parent (or future allowlist additions) cannot override.
      sp.set("parent", "denker.ai");
      return `https://player.twitch.tv/?${sp.toString()}`;
    },
    allowedParams: ["autoplay", "muted", "time"],
  },
  {
    id: "loom",
    hostMatches: [/(?:^|\.)loom\.com$/i],
    idRegex: /^[a-f0-9]{32}$/i,
    buildEmbedUrl(id, params) {
      const sp = new URLSearchParams({ ...params });
      const qs = sp.toString();
      return `https://www.loom.com/embed/${id}${qs ? `?${qs}` : ""}`;
    },
    allowedParams: ["hide_owner", "hide_share", "hideEmbedTopBar", "t"],
  },
  {
    id: "wistia",
    hostMatches: [/(?:^|\.)wistia\.(?:com|net)$/i],
    idRegex: /^[a-z0-9]{8,12}$/i,
    buildEmbedUrl(id, params) {
      const sp = new URLSearchParams({ ...params });
      const qs = sp.toString();
      return `https://fast.wistia.net/embed/iframe/${id}${qs ? `?${qs}` : ""}`;
    },
    allowedParams: ["autoPlay", "silentAutoPlay"],
  },
];

export function validateProvider(provider: string): ProviderId | null {
  const spec = PROVIDERS.find((p) => p.id === provider);
  return spec ? spec.id : null;
}

export function validateId(provider: ProviderId, id: string): boolean {
  const spec = PROVIDERS.find((p) => p.id === provider);
  if (!spec) return false;
  return spec.idRegex.test(id);
}

export function filterParams(
  provider: ProviderId,
  params: Record<string, string>,
): Record<string, string> {
  const spec = PROVIDERS.find((p) => p.id === provider);
  if (!spec) return {};
  const result: Record<string, string> = {};
  for (const key of spec.allowedParams) {
    if (key in params) result[key] = params[key]!;
  }
  return result;
}

export function buildEmbedUrl(
  provider: ProviderId,
  id: string,
  params: Record<string, string>,
): string {
  const spec = PROVIDERS.find((p) => p.id === provider);
  if (!spec) throw new Error(`Unknown provider: ${provider}`);
  return spec.buildEmbedUrl(id, params);
}
