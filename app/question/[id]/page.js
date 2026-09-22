"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProofItem from "@/components/ProofItem";

export default function QuestionPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/questions/${id}`);
      if (!res.ok) {
        setState({ loading: false, data: null, error: "Sawal nahi mila." });
        return;
      }
      const json = await res.json();
      setState({ loading: false, data: json, error: null });
    }
    load();
  }, [id]);

  if (state.loading) {
    return <p className="text-center py-16 text-gray-500">Load ho raha hai...</p>;
  }

  if (state.error) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">{state.error}</p>
        <Link href="/" className="text-brand-gold underline">
          Home par wapas jayein
        </Link>
      </div>
    );
  }

  const { question, proofs } = state.data;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-brand-gold text-sm mb-6 inline-block">
        &larr; Sab sawalaat
      </Link>

      <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark mb-6">
        {question.question}
      </h1>

      <div className="bg-white border border-brand-gold/40 rounded-xl p-6 mb-8">
        <h2 className="text-brand-gold text-sm font-semibold tracking-wide mb-3">
          JAWAB
        </h2>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
          {question.answer}
        </p>
      </div>

      {proofs?.length > 0 && (
        <div>
          <h2 className="text-brand-gold text-sm font-semibold tracking-wide mb-4">
            PROOF / HAWALA
          </h2>
          <div className="space-y-5">
            {proofs.map((p) => (
              <ProofItem key={p.id} proof={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
