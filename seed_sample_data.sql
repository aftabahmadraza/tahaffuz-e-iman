-- ============================================================
-- Tahaffuz-E-Iman Library — Sample/Demo Data
-- supabase_schema.sql chalane ke BAAD is file ko Supabase SQL Editor
-- me run karein taaki 3 demo sawal-jawab proofs ke sath ban jayein.
-- Baad me inhe Admin panel se edit/delete kiya ja sakta hai.
-- ============================================================

-- Sawal 1: Milad
with q1 as (
  insert into questions (question, answer)
  values (
    'Kya Milad manana jaiz hai?',
    'Milad manane ka masla Ulama ke darmiyan ikhtilafi raha hai. Neeche kitabon ke hawalon, ek video bayan aur ek Instagram clip ke zariye dono taraf ki dalail rakhi gayi hain taaki mutala karne wala khud roshni hasil kar sake.'
  )
  returning id
)
insert into proofs (question_id, type, url, label, note, sort_order)
select id, 'text', null,
  'Fatawa Rahimiya, Jild 2, Safha 45',
  'Is safhe par Milad ki mashroohiyat aur uske tareeqe par tafseeli bahas mojood hai.',
  0
from q1
union all
select id, 'pdf', 'https://example.com/sample-fatawa.pdf',
  'Fatawa Rahimiya (Poora Scan PDF)',
  null, 1
from q1
union all
select id, 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Molana ka Bayan — Milad ke Ahkaam',
  'Bayan me 12 minute se masla shuru hota hai.', 2
from q1
union all
select id, 'instagram', 'https://www.instagram.com/reel/CxampleReel123/',
  'Chhota Clip — Zaroori Nukta',
  null, 3
from q1;

-- Sawal 2: Qabar Parasti
with q2 as (
  insert into questions (question, answer)
  values (
    'Qabar Parasti aur Qabar ki ziyarat me kya farq hai?',
    'Qabar ki ziyarat (ibrat ke liye jana, dua karna) jaiz o mustahsan amal hai, lekin Qabar Parasti — yani qabar ko sajda karna, usse madad maangna, ya usse ibadat ka markaz banana — sareeh shirk hai. Neeche is farq ko wazeh karne wali ek tasveer/screenshot aur ek kitab ka hawala diya gaya hai.'
  )
  returning id
)
insert into proofs (question_id, type, url, label, note, sort_order)
select id, 'image', 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800',
  'Sahih Bukhari, Kitab-ul-Janaiz ka Screenshot',
  null, 0
from q2
union all
select id, 'text', null,
  'Sahih Muslim, Hadees No. 972',
  'Nabi (SAW) ne farmaya: qabron ki ziyarat karo kyunki ye aakhirat ko yaad dilati hai — lekin qabron par sajda karne se saaf mana farmaya gaya.',
  1
from q2;

-- Sawal 3: Taqleed
with q3 as (
  insert into questions (question, answer)
  values (
    'Taqleed-e-Shakhsi kya hai aur iski zaroorat kyun hai?',
    'Taqleed-e-Shakhsi se murad ye hai ke ek aam Muslim, jo khud Quran o Hadees se seedha masail akhz karne ki salahiyat nahi rakhta, kisi mustanad Imam (jaise Imam Abu Hanifa) ki fiqh ki pairavi kare. Neeche iski tafseel kitab aur ek direct video clip me di gayi hai.'
  )
  returning id
)
insert into proofs (question_id, type, url, label, note, sort_order)
select id, 'text', null,
  'Al-Iqtisad Fil Itiqad',
  'Imam Ghazali ne is kitab me aam aadmi ke liye taqleed ki zaroorat par tafseel se roshni dali hai.',
  0
from q3
union all
select id, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'Sample Video Bayan (demo link)',
  'Ye ek placeholder video hai — asli bayan ka direct video URL yaha lagayein.', 1
from q3;
