import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidSessionCookie, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

function requireAdmin() {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionCookie(session);
}

// GET /api/questions/:id -> question + answer + proofs (public)
export async function GET(_req, { params }) {
  const { id } = params;

  const { data: question, error: qError } = await supabaseAdmin
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (qError || !question) {
    return NextResponse.json({ error: "Sawal nahi mila" }, { status: 404 });
  }

  const { data: proofs, error: pError } = await supabaseAdmin
    .from("proofs")
    .select("*")
    .eq("question_id", id)
    .order("sort_order", { ascending: true });

  if (pError) {
    return NextResponse.json({ error: pError.message }, { status: 500 });
  }

  return NextResponse.json({ question, proofs: proofs || [] });
}

// PUT /api/questions/:id (admin only) — update question/answer, replace proofs
export async function PUT(req, { params }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();
  const { question, answer, proofs } = body;

  const { error: qError } = await supabaseAdmin
    .from("questions")
    .update({
      question: question?.trim(),
      answer: answer?.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (qError) {
    return NextResponse.json({ error: qError.message }, { status: 500 });
  }

  // Simplest approach: purane proofs delete karke naye insert karein
  const { error: delError } = await supabaseAdmin
    .from("proofs")
    .delete()
    .eq("question_id", id);

  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  if (Array.isArray(proofs) && proofs.length > 0) {
    const rows = proofs
      .filter((p) => p.type && (p.url?.trim() || p.note?.trim()))
      .map((p, idx) => ({
        question_id: id,
        type: p.type,
        url: p.url?.trim() || null,
        label: p.label?.trim() || null,
        note: p.note?.trim() || null,
        sort_order: idx,
      }));

    if (rows.length > 0) {
      const { error: insError } = await supabaseAdmin.from("proofs").insert(rows);
      if (insError) {
        return NextResponse.json({ error: insError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/questions/:id (admin only)
export async function DELETE(_req, { params }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const { error } = await supabaseAdmin.from("questions").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
