import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidSessionCookie, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

const PAGE_SIZE = 10;

// GET /api/questions?search=...&page=1
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabaseAdmin
    .from("questions")
    .select("id, question, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.ilike("question", `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    questions: data,
    total: count,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)),
  });
}

// POST /api/questions  (admin only) - create a new question+answer+proofs
export async function POST(req) {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionCookie(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { question, answer, proofs } = body;

  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json(
      { error: "Sawal aur jawab dono zaroori hain" },
      { status: 400 }
    );
  }

  const { data: qData, error: qError } = await supabaseAdmin
    .from("questions")
    .insert({ question: question.trim(), answer: answer.trim() })
    .select()
    .single();

  if (qError) {
    return NextResponse.json({ error: qError.message }, { status: 500 });
  }

  if (Array.isArray(proofs) && proofs.length > 0) {
    const rows = proofs
      .filter((p) => p.type && (p.url?.trim() || p.note?.trim()))
      .map((p, idx) => ({
        question_id: qData.id,
        type: p.type,
        url: p.url?.trim() || null,
        label: p.label?.trim() || null,
        note: p.note?.trim() || null,
        sort_order: idx,
      }));

    if (rows.length > 0) {
      const { error: pError } = await supabaseAdmin.from("proofs").insert(rows);
      if (pError) {
        return NextResponse.json({ error: pError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true, id: qData.id });
}
