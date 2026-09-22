# Tahaffuz-E-Iman Library

Deobandiyon ke sawalaat ka mudallal jawab — har jawab ke sath kitab ka reference,
screenshot, PDF ya audio/video hawala. Stack: **Next.js 14 + Supabase + Vercel**.

## 1. Supabase Setup

1. https://supabase.com par account banayein, **New Project** banayein.
2. Project ke andar **SQL Editor** kholein, `supabase_schema.sql` file ka pura content
   copy-paste karke **Run** karein. Isse `questions` aur `proofs` table ban jayenge.
3. **Project Settings -> API** me jayein, yaha se 3 cheezein copy karein:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY` (isko kabhi public na karein)

## 2. Local Setup (optional, testing ke liye)

```bash
npm install
cp .env.example .env.local
# .env.local file kholkar apni Supabase keys aur admin password bharein
npm run dev
```

Browser me `http://localhost:3000` kholein.

## 3. Deploy on Vercel

1. Is poore folder ko GitHub par ek naye repository me push karein.
2. https://vercel.com par login karein -> **Add New Project** -> apna GitHub repo select karein.
3. Vercel apne aap Next.js detect kar lega. **Environment Variables** section me ye
   5 values add karein (jaise `.env.example` me hain):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. **Deploy** button dabayein. 1-2 minute me aapki website live ho jayegi
   (`yourproject.vercel.app`).

## 4. Website kaise use karein

- **Home page**: sawalaat ki list, upar search bar, neeche "Jawab Dekhein" button,
  pagination (10 sawal per page).
- **Answer page** (`/question/[id]`): sawal, jawab, aur uske neeche sare proofs
  (text quote, image, PDF link, video, YouTube, Instagram reel) apne format me
  render hote hain.
- **Admin panel** (`/admin`): password se login karke naya sawal add karein,
  jawab likhein, aur jitne chahein proof rows add karke unka type chunein
  (Text/Image/PDF/Video/YouTube/Instagram) aur URL/quote daalein. Purane
  sawalaat ko edit ya delete bhi kar sakte hain.

## Notes

- Koi bhi category system nahi hai — jaisa aapne bola, sirf plain sawal-jawab-proof
  collection hai.
- Proofs ke liye sirf **URL** dalna hota hai (image hosting, PDF link, YouTube link,
  Instagram reel link, ya direct video file link) — website khud usko sahi tarah
  se dikha/play kar degi.
- Admin password sirf ek hi hai (`ADMIN_PASSWORD` env var). Agar future me
  multiple admins ya zyada security chahiye ho to Supabase Auth (email/password)
  add kiya ja sakta hai.
