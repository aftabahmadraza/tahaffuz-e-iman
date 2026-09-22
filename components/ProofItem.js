"use client";

function getYoutubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.searchParams.get("v")) {
      id = u.searchParams.get("v");
    } else if (u.pathname.includes("/shorts/")) {
      id = u.pathname.split("/shorts/")[1];
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function getInstagramEmbedUrl(url) {
  // Instagram embed pattern: {post-url}embed
  const clean = url.split("?")[0].replace(/\/$/, "");
  return `${clean}/embed`;
}

export default function ProofItem({ proof }) {
  const { type, url, label, note } = proof;

  return (
    <div className="border border-brand-gold/30 rounded-xl p-4 bg-white">
      {label && (
        <p className="text-sm font-semibold text-brand-dark mb-2">{label}</p>
      )}

      {type === "text" && note && (
        <p className="text-gray-700 whitespace-pre-line">{note}</p>
      )}

      {type === "image" && url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label || "Proof screenshot"}
          className="rounded-lg max-h-[500px] w-auto mx-auto"
        />
      )}

      {type === "pdf" && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-dark text-brand-cream px-4 py-2 rounded-full text-sm"
        >
          PDF Dekhein / Download Karein
        </a>
      )}

      {type === "video" && url && (
        <video controls className="w-full rounded-lg max-h-[500px]">
          <source src={url} />
          Aapka browser video tag support nahi karta.
        </video>
      )}

      {type === "youtube" && url && (
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={getYoutubeEmbedUrl(url) || url}
            title={label || "YouTube video"}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {type === "instagram" && url && (
        <div className="flex justify-center">
          <iframe
            src={getInstagramEmbedUrl(url)}
            title={label || "Instagram Reel"}
            className="rounded-lg border-0"
            width="400"
            height="480"
            scrolling="no"
            allowTransparency="true"
          />
        </div>
      )}

      {note && type !== "text" && (
        <p className="text-gray-500 text-sm mt-2">{note}</p>
      )}
    </div>
  );
}
