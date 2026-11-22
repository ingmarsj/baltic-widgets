# Horoscope editorial rules

These rules apply to the local copy in `parsers/horoscope-text/*.mjs`, to manual edits and to any future model/API writer. Read them before changing horoscope copy. The executable contract is `parsers/horoscope-policy.mjs` (`daily-reading-v2`); run `node scripts/check-horoscope-text.mjs <lang> --samples` after every change.

## How a reading is built

- The generator computes the real sky for the whole local day with Astronomy Engine (`parsers/horoscope-sky.mjs`): Moon sign changes with exact times, lunar phases, the Sun's ingress, planetary signs and retrograde stations. Times are Baltic local time (Riga, Vilnius and Tallinn share one zone).
- The day's main Moon sign is the sign that holds the Moon longer between 07:00 and 23:00 (the sign at 15:00). It gives every reader a whole-sign house counted from their own sign (house 1 = the Moon in the reader's sign), so all 12 signs get different copy on the same day.
- Each house has three entries per list. Entry *n* of every list is used on the same day; the entry changes on each day of a Moon transit, shifts every sidereal month and differs between signs. Adjacent days never share a sentence and a week never recycles house copy.
- At most one sentence about an exact event opens the text, in this order: the Sun enters the reader's sign, a full or new moon, Mercury/Venus/Mars turning retrograde or direct, the Moon changing sign, the Sun entering another sign.
- Ratings (1–5 stars) for love, work and money, and wellbeing come from the house (`houseProfiles` in `parsers/horoscope.mjs`); retrograde Mercury, Venus and Mars lower work, love and wellbeing by one star. They never fall below 2. Keep the copy's tone consistent with the rating.
- One stable reading per sign, day and mood. Every visitor sees the same text all day; reloading does not change it.

## Required structure per house and mood

- `headline`: 3 short headlines, 3–40 characters, no full stop.
- `day`: 3 texts of 1–2 sentences, 80–230 characters, describing the house theme and a suggestion. Do not name the Moon's zodiac sign (it varies by reader).
- `love`, `work`, `energy`: 3 entries each with `text` (45–200 characters), `do` (20–125) and `avoid` (15–125).
- Event sentences (40–185 characters) and special headlines for the Sun entering, and a full or new moon in, the reader's sign.
- The three entries of a list are different situations, not paraphrases. Every string in a language module is unique.

## Do and Avoid

Do is an affirmative, useful action in the imperative. Avoid names an undesirable behaviour, situation or habit that grammatically completes the heading. Never put a negative command under Avoid, and never repeat the heading inside an item.

- Latvian: heading „Izvairies no”; items are noun phrases in the genitive (singular) or dative (plural), capitalised and without a leading „No” („Solījumiem, kurus izpildīt var tikai ar veiksmi.”). Inline in the all-in-one view the first letter is lowercased: „Izvairies no solījumiem, …”.
- Russian: heading «Избегай»; a genitive noun phrase.
- English: heading “Avoid”; a gerund or noun phrase.
- Lithuanian: heading „Venk“; a genitive noun phrase.
- Estonian: heading „Väldi“; a partitive noun phrase.

A Do item and the Avoid item of the same entry and area must not be inversions or paraphrases. Bad: Do “Take a break.” / Avoid “Working without breaks.”

## Tone and realism

- Two moods: `serious` (normal) and `humor` (funny). Normal copy is warm, concrete and everyday, never bureaucratic or like a time-management course. Funny copy is witty in every single string: a concrete observation, an unexpected comparison or a punchline that still gives the advice. Keep humour warm; no jokes about gender, nationality, body weight, age or alcohol.
- Describe tendencies, not guarantees, especially for health, money and relationships. No medical advice, no fixed personality descriptions, no fear-mongering.
- Do not assume the reader has a partner, children, a car or an office job; address singles and couples alike.
- Astronomical statements come only from the calculation and are rendered by the language module's functions with exact times.

## Language and typography

- Write each language natively. Never translate another language's copy; re-create jokes so they work.
- Address the reader with the informal singular “you” (LV tu, RU ты, LT tu, ET sina). The reader's gender must never show: no gendered participles, adjectives, past tense (Russian) or “you yourself” forms about the reader. Rephrase impersonally: „ja vēl nav pienācis laiks”, not „ja neesi gatavs”; „tas izkritis no prāta”, not „esi aizmirsis”.
- No calques. Latvian examples to avoid: „cilvēcīgs teikums”, „tehniskais uzdevums”, „atsaukt pieteikumu”, „kalendārs pieprasa advokātu”, „viņš” for objects.
- Quotation marks: LV „…” · LT/ET „…“ · RU «…» · EN “…” and ’. Never a straight `"`.
- Dashes with spaces: LV/LT/ET/EN “ – ” (en dash), RU “ — ” (em dash). Use the ellipsis character … .
- Time and date formats belong to each language module (`time`, `on`, `until` helpers); Latvian uses „plkst. 9.23” and „24. novembrī”.

## Variation and publication

- Validate every result with `validateReading` before caching or publishing, including future model output. Validation checks structure, ratings, lengths, duplicates, typography, negative openings and known gendered patterns. Human review still checks meaning, idiom and whether the humour works.
- Run `node --test parsers/horoscope.test.mjs` after changing copy and `npm test` before publishing. The tests also check that adjacent days share no sentence and that a week does not recycle house copy.
- Bump `version` in `parsers/horoscope.mjs` when rules or copy change, regenerate the public horoscope JSON, and deploy matching code and data. Retain older cached versions as history.
