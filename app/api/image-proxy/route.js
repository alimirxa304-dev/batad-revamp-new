import { NextResponse } from "next/server";
import { TRUSTED_MEDIA_HOSTS } from "@/lib/seoMeta";

// Streams a real content image (city/course photo) from the CMS media host back
// out under our own domain, so social crawlers (Facebook/X/LinkedIn) — which only
// trust a same-origin og:image/twitter:image URL reliably — see a real,
// same-origin, always-reachable image instead of the site falling back to one
// generic fallback picture for every city. Only ever proxies a host already
// trusted for on-page rendering (see next.config.mjs images.remotePatterns) —
// never an arbitrary caller-supplied origin — so this can't become an open SSRF
// relay.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (targetUrl.protocol !== "https:" || !TRUSTED_MEDIA_HOSTS.includes(targetUrl.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  const upstream = await fetch(targetUrl, { next: { revalidate: 86400 } });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
