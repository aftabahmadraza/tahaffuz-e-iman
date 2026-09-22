import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Tahaffuz-E-Iman Library",
  description:
    "Deobandiyon ke sawalaat ka mudallal jawab — har jawab ke sath kitab ka reference, screenshot, PDF ya audio/video hawala mojood hai.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ur">
      <body className="min-h-screen flex flex-col font-serif">
        <header className="bg-brand-dark border-b-2 border-brand-gold">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full border-2 border-brand-gold flex items-center justify-center text-brand-cream">
                ☾
              </span>
              <span className="text-brand-cream text-xl md:text-2xl font-semibold">
                Tahaffuz-E-Iman Library
              </span>
            </Link>
            <nav className="flex gap-6 text-brand-cream text-sm md:text-base">
              <Link href="/">Home</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-brand-dark border-t-2 border-brand-gold text-brand-cream/80 text-sm">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center space-y-1">
            <p>Tahaffuz-E-Iman Library — Iman ki hifazat, Quran o Hadees ki roshni mein.</p>
            <p>&copy; {new Date().getFullYear()} Tahaffuz-E-Iman Library. Sab huqooq mahfooz.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
