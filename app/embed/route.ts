import {
  validateProvider,
  validateId,
  filterParams,
  buildEmbedUrl,
} from "@/lib/embed-providers";

// Route handler instead of a page so the response bypasses the root
// layout (which injects analytics, cookie banner, dark `<body>` background,
// etc.). When this lived as `app/embed/page.tsx`, the embed iframe ended
// up nested inside the marketing-site `<html>/<body>` — visually empty in
// every browser including Safari and the Tauri WKWebView.

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawProvider = url.searchParams.get("provider") ?? "";
  const rawId = url.searchParams.get("id") ?? "";

  const provider = validateProvider(rawProvider);
  if (!provider) return new Response("Not found", { status: 404 });
  if (!validateId(provider, rawId))
    return new Response("Not found", { status: 404 });

  const extraParams: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (key === "provider" || key === "id") continue;
    extraParams[key] = value;
  }

  const allowed = filterParams(provider, extraParams);
  const canonicalUrl = buildEmbedUrl(provider, rawId, allowed);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeAttr(provider)} embed</title>
<style>
  html, body { margin: 0; padding: 0; height: 100%; background: #000; }
  iframe { width: 100vw; height: 100vh; border: 0; display: block; }
</style>
</head>
<body>
<iframe src="${escapeAttr(canonicalUrl)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
