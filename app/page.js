"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ questions: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async (s, p) => {
    setLoading(true);
    const res = await fetch(
      `/api/questions?search=${encodeURIComponent(s)}&page=${p}`
    );
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions(search, page);
  }, [search, page, fetchQuestions]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearch(inputValue);
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-brand-dark text-brand-cream py-16 px-6 text-center relative overflow-hidden">
        <p className="text-brand-gold tracking-widest text-xs md:text-sm font-semibold mb-3">
          IMAN KI HIFAZAT &bull; QURAN O HADEES KI ROSHNI MEIN
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold mb-5">
          Tahaffuz-E-Iman Library
        </h1>
        <p className="max-w-2xl mx-auto text-brand-cream/90 mb-8">
          Deobandiyon ke sawalaat ka mudallal jawab — har jawab ke sath kitab ka
          reference, screenshot, PDF ya audio/video hawala mojood hai.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="max-w-xl mx-auto flex rounded-full overflow-hidden shadow-lg"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Sawal talash karein... (misaal: Milad, Qabar Parasti)"
            className="flex-1 px-5 py-3 text-brand-dark bg-brand-cream focus:outline-none"
          />
          <button
            type="submit"
            className="bg-brand-gold text-brand-dark font-semibold px-6 hover:brightness-95"
          >
            Talash Karein
          </button>
        </form>
      </section>

      {/* QUESTION LIST */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {loading && <p className="text-center text-gray-500">Load ho raha hai...</p>}

        {!loading && data.questions?.length === 0 && (
          <p className="text-center text-gray-500">
            Koi sawal nahi mila. Kisi aur lafz se talash karein.
          </p>
        )}

        <ul className="space-y-4">
          {data.questions?.map((q) => (
            <li
              key={q.id}
              className="border border-brand-gold/40 rounded-xl p-5 bg-white shadow-sm flex items-center justify-between gap-4"
            >
              <span className="text-lg text-brand-dark">{q.question}</span>
              <Link
                href={`/question/${q.id}`}
                className="shrink-0 bg-brand-dark text-brand-cream px-4 py-2 rounded-full text-sm hover:brightness-110"
              >
                Jawab Dekhein
              </Link>
            </li>
          ))}
        </ul>

        {/* PAGINATION */}
        {data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-full border border-brand-gold disabled:opacity-40"
            >
              Pichla
            </button>
            <span className="px-3 text-sm text-brand-dark">
              Page {page} / {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-full border border-brand-gold disabled:opacity-40"
            >
              Agla
            </button>
          </div>
        )}
      </section>
    </>
  );
}
