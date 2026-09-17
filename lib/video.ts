/** Video havolasini qanday ko'rsatishni aniqlaydi: fayl (mp4) yoki embed (YouTube/Vimeo) */
export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string }
  | { kind: "link"; src: string };

const FILE_EXTENSIONS = /\.(mp4|webm|ogg)(\?.*)?$/i;

export function parseVideoUrl(url: string): VideoSource | null {
  const value = url?.trim();
  if (!value) return null;

  if (FILE_EXTENSIONS.test(value)) return { kind: "file", src: value };

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}` } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const id = parsed.searchParams.get("v") ?? parsed.pathname.match(/\/(embed|shorts|live)\/([\w-]+)/)?.[2];
    return id ? { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}` } : null;
  }
  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? { kind: "embed", src: `https://player.vimeo.com/video/${id}` } : null;
  }

  // Boshqa havolalar (Instagram, Telegram va h.k.) — yangi oynada ochiladigan havola sifatida
  return { kind: "link", src: value };
}
