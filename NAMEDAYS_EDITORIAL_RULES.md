# Name-day history: reader-facing language

Applies to all five languages, reviewed histories, hypotheses, supplements, related-name sections and generated display text. Established on 17 November 2026 after the Aleksandris review.

Write about the name, its possible meaning and its history. Keep research instructions, verification procedures, missing-source explanations and evidence-transfer warnings in research notes and the backlog.

- Keep the translated **Hypothesis** label and qualified wording: “may be related to”, “probably a form of”, “its origin is uncertain”. Editing prose never changes verification status.
- Remove instructions such as “find a direct spelling link”, “still needs checking”, “an exact-form source is needed”, “dates cannot be transferred” and “similar spellings can guide research”. Do not repeat “this is a hypothesis” or “we have not found a documented explanation” after the label already conveys uncertainty.
- Describe competing explanations briefly. Preserve their uncertainty; do not choose a definitive meaning or invent a combined translation.
- Preserve concrete facts, dates, places, literary origins and publication events. Attribute dates to the correct exact form. A warning about a related name's dates is not a fact about the selected name and need not be displayed.
- Name dictionaries, research authors, source URLs and next verification steps only in working files and provenance. Historical books or calendars may be named as actual cultural events when relevant.
- Use the same meaning and degree of uncertainty in every language. If the original is editorial prose, fix the original display wording and every translation; do not describe the problem as translation alone.

## Worked example

**Before:** Aleksandris can be compared by spelling with Aleksandrs, but the explanation does not apply to this exact form. An explicit spelling connection still needs to be found. The Greek family remains a comparison rather than a verified etymology; historical dates cannot be transferred.

**After, under the Hypothesis label:**

| Language | Reader-facing text |
| --- | --- |
| LV | Aleksandris varētu būt vārda Aleksandrs variants. |
| RU | Aleksandris, возможно, вариант имени Aleksandrs. |
| EN | Aleksandris may be a variant of Aleksandrs. |
| LT | Aleksandris galbūt yra vardo Aleksandrs variantas. |
| ET | Aleksandris võib olla nime Aleksandrs variant. |

The possible link remains unverified. Its evidence limits and next step stay in the existing research notes. A separate related-name section may explain Aleksandrs, clearly headed with that name.

## Implementation and checks

`public/namedays-reader.js` removes or rewrites recurring editorial formulas. `public/namedays-reader-r168.js` provides explicit five-language versions of complex hypotheses. Raw research entries remain unchanged. The generator materializes the final text in each profile's `display_history`; use `scripts/nameday-text.mjs` to inspect exactly what the widget shows.

After copy edits, bump `WRITER_VERSION`, regenerate all affected countries, run the reader-language regression tests, the full test suite, build and backlog generation, and inspect changed examples in the browser. Check that origin hypotheses were not promoted to reviewed histories and that namesakes and structured facts remain intact.
