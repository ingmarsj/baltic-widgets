# Reusable name-history PDF index

Read [NAMEDAYS_SOURCES.md](NAMEDAYS_SOURCES.md) first. Reuse a registered PDF before downloading or extracting it again. The cache is a private research aid; the public repository contains the tool and provenance, not books, scans or extracted full text.

## Index once

From `github-public/`, with Poppler's `pdftotext` on PATH:

```powershell
node scripts/nameday-source-cache.mjs index --id LT-SALYS83 --file ../var/namedays-research/round8-salys.pdf --url https://tautosmenta.lt/wp-content/uploads/lituanistika/Salys_1983_LT.pdf --title 'Antanas Salys, Raštai II, 1983'
node scripts/nameday-source-cache.mjs search --id LT-SALYS83 --query Mantvinas --word true
```

The index lives in `../var/namedays-sources/`, outside the portable repository. Each source ID has a manifest with its URL, title, SHA-256, parser version and PDF page count. Content-addressed objects retain the original PDF, UTF-8 text and NFC-normalized page JSON. Matching file bytes and parser version reuse the existing extraction even if the original filename changes or another source ID points to it. Changed bytes create a new object; old objects remain available. The index command registers a local original; fetch downloads and registers a new URL or reuses a cached URL. Consult only publicly accessible materials; indexing grants no republication rights.

Search preserves diacritics and searches case-insensitively. `--word true` excludes matches embedded in other words; omit it for discovery of inflections or OCR fragments. Search results give **one-based PDF pages**, not printed pages. An empty result is not proof of absence: extraction may lose accents, insert spaces or mistake glyphs. The tool rejects empty extraction.

For an image-only scan on Windows, run resumable OCR once using **Windows PowerShell 5.1**, with Poppler's `pdfinfo` and `pdftoppm` on PATH:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/nameday-pdf-ocr.ps1 -Pdf ../var/namedays-research/round13-russian.pdf -Language ru
```

The execution-policy flag applies only to this process; it does not change the machine policy. The helper prints the private `pages.json` path. Pass that path as `--ocr-json` to the normal `index` command, with the same PDF, source ID, title and URL. Import checks the PDF hash and consecutive page numbers. Per-page results are cached by PDF hash and OCR language, so interrupted runs resume and later runs avoid recognition. Rendered temporary PNGs are removed individually after recognition. OCR is a discovery aid only: the English recognizer may lose Baltic diacritics, and the Russian recognizer may confuse Latin/Cyrillic lookalikes. Inspect the original for every accepted spelling.

## Review an indexed page

Render only the relevant original pages with `pdftoppm`, inspect the name, columns and heading, and record both printed and PDF pages in the round notes. Do not repair letters by guessing. Preserve uncertain spelling bridges and conflicting root analyses as unverified. A dated dictionary record is not a birth registration or invention date. A source filename is not bibliographic evidence: a candidate labelled `magiste1936` in the private workspace actually contained the **1929** title page.

The private index includes `LT-SALYS83`, `EE-MAGISTE29`, `EE-TURK10`, `LT-PAKERYS09`, `LT-PAKERYS10`, `LT-PAKERYS11`, `LT-MACIEJAUSKIENE94`, `EE-LEOLE05`, `EE-LEOLE05-DEC`, `EE-EISEN-TOLL`, `EE-KALLASMAA17`, `EE-MUST62`, `LV-LVA-EN06`, `LV-LVA-NORDIC03`, `LV-LVA-LT61`, `LV-LVA-RU93`, `LV-ALL93`, `LV-IDENTITY25`, `LV-LILE24`, `INT-MUSE46`, `INT-KRAUS13`, `RU-PETROVSKY66` `LT-SINKEVICIUTE06` `LT-BURBA24` and `LV-SILINA15`. The source directory records exact productive locations and limitations. Cache files are optional: an offline public-data rebuild uses the committed narratives and provenance.

## Continuing a round

1. Search the source IDs already listed in the directory.
2. Index a useful new PDF once, using its stable source ID and actual title/year.
3. Inspect relevant original pages and save private screenshots if needed.
4. Add precise evidence and access limitations to the source directory and next numeric round notes.
5. Regenerate the name profiles and backlog. Keep unresolved hypotheses open and source links out of the widget UI.

December research added **Leole, December 2005** (8 pages), **Eisen, Tõll ja ta sugu** (170 pages; edition year not established in this review), and **Pakerys 2010** (15 pages). At the end of round 35, the 20 registered sources contained **2,328 indexed PDF pages**. Reuse the existing objects rather than fetching or extracting them again. Pakerys’s extraction loses accents: search `mintas` or the `Ei-` section if exact `Eimintas` yields nothing, then inspect PDF p. 5 / printed p. 92. The asterisk is defined on PDF p. 2 / printed p. 89: it means twentieth-century name formation, not an ancient attestation. Eisen PDF p. 138 / printed p. 132 qualifies the proposed Leiger derivation; a popular column’s stronger wording must not erase that qualification.

The 6–10 December rounds added `EE-TURK10` (165 pages), `INT-KRAUS13` (23-page publisher preview) and `RU-PETROVSKY66` (385-page scan). At the end of round 40, the cache had **23 sources and 2,901 pages**. Petrovsky was recognized once with Russian Windows OCR and indexed by its original PDF hash; repeated indexing reuses that extraction. Search the Cyrillic stem when accents or OCR errors prevent an exact hit. Relevant Vladilen/Vladlena entries span PDF pp. 79–80 / printed pp. 78–79; Nikandr/Nika/Nikiy are on PDF p. 166 / printed p. 165. Türk’s Niilas/Niilo passage is PDF/printed p. 80; Kraus’s related Russian name list is PDF p. 16 / printed p. 8. These are already saved: do not download or recognize them again. See the source directory for exact claims and limits.


Rounds 41–45 (11–15 December) add **LT-BURBA24**, the publisher’s 2024 Burba article, 23 pages. At the end of round 45, the cache held **24 sources and 2,924 pages**. It was extracted once by content hash; the accepted Kastytis episode was checked against original PDF p. 3 / printed p. 132. Reused originals include Pakerys 2011 PDF pp. 4 and 9, Mägiste 1929 PDF pp. 17–18, 22, 27 and 49, and Salys PDF pp. 229–230, 243 and 318. Exact spellings distinguish Kastantas from Kastautas and Fortūnatas from Fortunatas. Public documentation stores locators and limitations, not the full PDF or extracted text. Rajandi’s restricted DIGAR book is only a catalogue lead and is not part of the cache.


Rounds 46–50 add **LV-SILINA15**, Zane Šiliņa’s 2015 Interlitteraria article, **13 pages**, indexed once by its original PDF hash. The cache now holds **25 sources and 2,937 pages**. Original PDF p. 3 / printed p. 9 supports the Lelde/Tots literary episode; it does not resolve Tots’s proposed lexical origins. Reused Salys pp. 319, 255 and 152–153 distinguish exact spellings, personal names from place names, and modern Urbonas from the cited 1510 Urban spelling. Mägiste pp. 13, 17, 20 and 21 and Pakerys 2011 p. 2 were also checked in the originals. No recurring PDF was downloaded or extracted again.


## 21–25 December reuse (rounds 51–55)

No new PDF was needed: the private cache remains **25 source records / 2,937 indexed pages**. Reused original pages from Salys 1983 (PDF 213, 230, 243, 298, 309, 319), Pakerys 2010 (PDF 7), Pakerys 2011 (PDF 3), Mägiste 1929 (PDF 21, 23, 50) and Leole December 2005 (PDF 6). Page images were rendered privately for exact spelling and column checks; existing indexed full text was not extracted again.

Important corrections: Salys PDF 319 prints **Grožvydas**, whereas Pakerys 2010 PDF 7 / printed 94 independently gives **Graž̃vydas**. Salys PDF 233’s Mina-like text hit is not a Mina personal-name entry. Mägiste’s Toom comparison has a question mark; its running-text senni hit is not a personal-name entry. Leole’s Christmas/Natalie group is on **p. 6**, not p. 1. Record both printed and PDF page numbers as in [NAMEDAYS_SOURCES.md](NAMEDAYS_SOURCES.md). New HTML encyclopaedia/catalogue resources belong in that source directory; they do not require a PDF cache record.

The 12 November–25 December verification recheck (rounds 56–61) added **EE-RAJANDI66**, Edgar Rajandi, *Raamat nimedest* (Tallinn, 1966), **247 PDF pages**, indexed from its text layer. The OCR layer misreads letters and diacritics: always confirm a hit on the rendered page image and record printed as well as PDF page numbers.

## Search everything at once

`node scripts/nameday-source-cache.mjs search --query NAME --word true` (no `--id`, or `--id all`) searches every registered source and returns up to `--limit` hits per source (default 5). `node scripts/nameday-source-cache.mjs list` prints all manifests. The verification recheck also indexed the earlier working PDFs from `../var/namedays-research/` that had never been registered, under `LOCAL-<file name>` IDs; their URLs are recorded where they could be derived (Language Agency word exports) and otherwise marked `unrecorded:`. Two files there are HTML error pages rather than PDFs and one is an image-only scan that still needs OCR. `npm run sources:namedays` writes the private catalogue of all manifests to `../var/namedays-sources/CATALOG.md` and the public [source index](NAMEDAYS_SOURCE_INDEX.md).

## Save every new source automatically

`node scripts/nameday-source-cache.mjs fetch --url URL [--id ID --title TITLE]` downloads a PDF or web page once, stores the original and its text under a content hash and registers it; a URL that is already cached (ignoring the `#page` fragment) is reused without a download. HTML pages are stored as one searchable page with their fetch date; challenge pages and errors are not cached. Without `--id`, the source gets an automatic `WEB-<host-path>` ID; promote productive sources to a stable directory ID. In Claude Code, the project hook `.claude/settings.json` (outside this repository, in the parent workspace) runs `scripts/nameday-fetch-hook.mjs` after every WebFetch, so pages opened during research are cached without a manual step; each attempt, including failures, is appended to `../var/namedays-sources/fetch-log.jsonl`. Other agents should call `fetch` themselves.


## 26 December–1 January: URL reuse and exact spelling

Rounds 62–68 reuse the registered originals and text for Salys, Pakerys, Mägiste, Rajandi and the English/Nordic rendering manuals. New HTML pages were saved with fetch. One reusable 16-page PDF was added: **LT-SINKEVICIUTE12**, Sinkevičiūtė’s study of names given in 2007–2010, *Kalbos kultūra* 84, pp. 214–229; no exact Gaja result was found and the publication year is left unverified. See the source directory for all visually checked PDF/printed locators and failed leads.

For a cached URL, fetch --url URL --id STABLE-ID --title TITLE now registers the requested stable ID against the existing content object without downloading or extracting again. The old alias remains usable. An ID already assigned to a different URL causes an error before a request or write. Do not build IDs solely by removing Baltic diacritics: different spellings can collapse to the same ASCII string. Use a URL hash suffix or another explicitly distinct stable ID. Originals and extracted text stay private and content-addressed.

The public index includes source IDs documented in the shared directory or round notes; unregistered working-page IDs stay in the private catalogue. HTML contributes searchable text but never to the cached-PDF page count. The private catalogue explicitly labels HTML versus PDF. A cache hit is a discovery aid, and aliases to one object are not independent corroborating sources.


## 2–10 January: Armenian manual and accent/OCR checks

Rounds 69–77 added one reusable original: **LV-LVA-ARM09**, Valda Salmiņa, *Armēņu īpašvārdu atveide latviešu valodā* (Riga, 2009), **192 PDF pages**. Original title/imprint at PDF 1–2 and the exact Arams/Արամ/Aram row at PDF/printed 102 were checked. It was fetched through the shared cache, indexed once, and remains outside the public repository. Existing Salys, Pakerys, Sinkevičiūtė, Rajandi, Mägiste and rendering manuals were reused without re-downloading.

Diacritic-insensitive private discovery recovered Arvaidė in Pakerys’s accented 2011 text; the accepted spelling was then confirmed in the original PDF 8 / printed 97. Exact public spellings were not normalized to remove accents. Conversely, the extracted Talve on Mägiste AES PDF 26 visually reads **Valve**. The false hit is recorded in the directory and round 77, so it will not be researched again as new evidence. Search hits in surnames, place names, recommendations and birth registers retain those distinct scopes. Every new HTML reference and rejected submission page is also cached once and documented by stable ID.


## 11–15 January: registered original and table/OCR distinctions

Rounds78–82 reused registered originals and their extracted text. The existing private twelve-page r6-source-44 PDF was registered as **LT-MACIEJAUSKIENE04**, Vitalija Maciejauskienė, *Dar kartą apie lietuvių vardus*, *Kalbos kultūra77* (2004), pp84–95, with its repository URL. The content hash matched the already indexed object, so no download or re-extraction occurred. Productive original locations are PDF4/printed87 and PDF7/printed90.

A linked **LV-LVKJ73** candidate fetched through the shared tool yielded no text; no accepted indexed-source manifest was created. Keep its original private for targeted visual/OCR work and reuse the saved failure information rather than fetching again. The Armenian2009 manual and English/Russian/Nordic manuals already in the cache supplied the exact accepted rows without new PDF downloads.

Two important checks: Russian OCR missed Анисья→Aņisja on PDF76/printed183, while the original clearly confirms it. Conversely, the Swedish Felicia row on PDF204/printed327 prints Felīsia/*Felīsija; its asterisk cannot be discarded when evaluating the target spelling. The common word salvi in Rajandi PDF22 is not the name Salvi. All accepted locators and rejected contexts are recorded in the shared source directory and numeric round notes. New web originals, including negative botanical/submission/language-only leads, are cached once under stable IDs.

## 26 January–4 February: round 93 reuse

Round 93 reused the registered Salys, Rajandi, Mägiste, Pakerys, Maciejauskienė and English-rendering PDFs; no new PDF download was needed. Original pages were rendered privately to check diacritics, column alignment, grammatical labels and source spellings. New catalogue pages were fetched through the shared source-cache command, and productive pages received stable `LV-SILINS-<NAME>` cache IDs without downloading their originals again. The new Vytenis biography and the rejected botanical homonym were cached separately.

Critical distinctions include Salys PDF 302 / printed 287 **Rimantas (Rimas)** rather than the OCR's Eimantas, Mägiste AES PDF 44 / printed 38 **Melete (1255)** rather than a modern Meelit first-attestation claim, and Rajandi PDF 209 / printed 211 **Meeland** in the left column rather than a false Michael relationship from the right column. The bracketed Armiida on Rajandi PDF 28 is pronunciation, not an independently documented written variant. Exact pages, outcomes and remaining gaps are recorded in `research/namedays/round93-notes.json` and the shared source directory. Raw originals, page images and extracted text remain private.

## 5–14 February: round 94 reuse

Round 94 reused the registered PDF originals and rendered the accepted pages privately; no new PDF download was needed. The theatre encyclopedia page and the negative Richie/Rick queries were cached with stable IDs. Productive Latvian catalogue URLs received stable LV-SILINS IDs by reusing the already cached originals. Exact searches were supplemented by accent-insensitive discovery for missed OCR forms such as Joviltas, Elvyra, Lijana, Lilijana and Ugnė; the original page, not the folded text, determines accepted spelling. Iko’s declension was checked against Mägiste’s introductory key, and Salys as a given name was distinguished from surname hits. The 1964 calendar’s Mantiminas is not silently substituted for Mantminas. Source details and failed leads are recorded in the shared directory and round 94 notes; all raw files remain private.

## 15–24 February: round 95 reuse

Round 95 reused registered cached originals and exact per-name searches, with accent-insensitive discovery checked against page images. Every new Latvian catalogue page was fetched through the shared cache CLI; productive URLs were assigned stable LV-SILINS IDs without downloading an already cached URL twice. No new PDF download was needed. The Eivinas/Elvinas OCR trap was rejected after inspecting the original; dated uses retain their exact spelling and regional or cohort scope. Source locations and failed leads are recorded in the shared directory and round 95 notes. Raw archives, extracted text and page images remain private.

## 25 February reuse (round 96)

No new PDF was downloaded or extracted. Original page images were inspected from LT-SALYS83 (PDF 116 / printed 101; PDF 303 / printed 288) and EE-RAJANDI66 (PDF 8 / printed 9; PDF 158 / printed 160; PDF 165 / printed 167). New catalogue HTML pages were cached privately with stable LV-SILINS IDs; these are attributed transcriptions, not inspection of the printed dictionary. Exact spellings and qualified dates retain their source scope.

## 26 February–6 March reuse (round 97)

No PDF was downloaded or extracted again. Reused original page images: LT-SALYS83 PDF 235/printed220, 303/288, 315/300, 233/218 and 304/289; EE-RAJANDI66 PDF 75/77, 28/30, 179/181, 222/224, 46/48 and 104/106; EE-MAGISTE29-AES PDF19/13 and21/15. Exact Gùstis and Novilas were recovered from the original despite failed unaccented text queries. Catalogue HTML pages were fetched or reused by URL through the shared cache tool; their private snapshots are not part of the public repository. The Lrytas fetch failure is recorded in the source directory and fetch log.

## 7–21 March reuse and one new publisher preview (round 98)

Registered originals were reused without downloading or extracting them again. Original page images were inspected from LT-SALYS83 PDF27/printed12,148/133,149/134,303/288,304/289,306/291,316/301,317/302,318/303,319/304; LT-PAKERYS11 PDF1/printed90; EE-RAJANDI66 PDF17/19,45/47,56/58,64/66,66/68,67/69,87/89,88/90,95/97,125/127,127/129,148/150,173/175,205/207,220/222; LV-ALL93 PDF5,7,8 (matching printed pages). Exact text-layer searches were supplemented by accent-insensitive discovery; acceptance still depends on the original page.

One new eleven-page publisher preview was cached once as **LV-ZVAIGZNE-GEILA22-PDF** (SHA-256 aaee97709199e4ff5de5b467687e2b4c1cb99c32e2c6caae10dbb00cae3335c4). PDF2 was visually inspected for the Geila Bosa / Gayle Boss correspondence and Latvian 2022 edition date. Raw PDF, extracted text and images remain in the private cache. New HTML primary sources and exact catalogue entries use stable directory IDs; all downloads went through the cache CLI. See NAMEDAYS_SOURCES.md and research/namedays/round98-notes.json for source URLs, exact locations and rejected leads.

## 22 March–5 April reuse and one primary volume (round 99)

One new 186-page PDF was downloaded and extracted once: **LV-PLESUMA-BALODE13**, Valodas prakse8/2013, SHA-256 83326b7a744e8a9d11a62dcd29e83188bd1d44f3217a08365bb5bfb988a7141f. The first private alias ending12 was corrected to13 by cache reuse; it did not trigger another download or extraction. Original PDF3 establishes2013; PDF57/printed55 verifies authors/title; PDF63/61 establishes the corpus period and1 January2012 cutoff; PDF64/62 verifies Glauda; PDF75/73 distinguishes feminine Geda from the qualified Gēda proposal; PDF82/80 has exact Grācija. Raw volume, extracted text and page images stay private.

Reused and visually checked originals: LT-SALYS83 PDF304/printed289,305/290,308/293,314/299,316/301,284/269; EE-RAJANDI66 PDF19/21,190/192,114/116,121/123,122/124,123/125,103/105,104/106,202/204,27/29,28/30,76/78,82/84,52/54,53/55,70/72,71/73,167/169,23/25; EE-MAGISTE29-AES PDF17/11,21/15,29/23,28/22. Salys PDF27/12 was also inspected as a discovery check but does not itself list Ginas in the short-name examples; the accepted Ginas relationship comes from the exact calendar entry. No recurring PDF was downloaded or extracted again. New HTML pages use cache fetch and stable source IDs. See NAMEDAYS_SOURCES.md and research/namedays/round99-notes.json for exact limits and failed leads.

## 6–20 April cached reuse (round 100)

No new PDF was acquired. Reused original pages are listed with PDF/printed pagination in the round100 section of [NAMEDAYS_SOURCES.md](NAMEDAYS_SOURCES.md); individual evidence and discovery limits are in [round100 notes](research/namedays/round100-notes.json). Existing PDFs were neither downloaded nor extracted again. Exact Latvian catalogue pages use the cache fetch command and stable IDs.

The new **LV-LU-NAMEVARIATION** bitstream lead returned a short HTML security/CAPTCHA page, not a PDF. The response is cached once (SHA-256 1542adb0bdcd99ff0f20e98625e6703440773b76f3fe3e1ffa992b074ae27005); the intended study’s author, date and contents remain uninspected. It supplies no substantive evidence. No retry or access-control bypass was attempted. Raw originals, extracted text and page images remain private.

Additional original pages visually inspected for round100: LV-PLESUMA-BALODE13 PDF62/printed60,63/61,64/62,65/63 and73/71; EE-RAJANDI66 PDF168/printed170. The primary2013 study supplies exact Orhideja, Floransa and Floriāns formation evidence with its historical register cutoff.

## 21 April–5 May new acquisitions (round 101)

New originals were cached once with `nameday-source-cache.mjs fetch` and are searchable: EE-OMAKEEL-2011-2-03 (10 pp.), EE-HUSSAR-2014-SLIDES (34 pp.), EE-ESELTS-NIMEDE-NIMEL-2026 (415 pp.), EE-REZOLD1869 (10 pp., Fraktur; text layer unusable, inspect page images), LT-VU-ELABA-115477061 (22 pp.), LT-VU-ELABA-231782682 (19 pp.), LT-PASAULIOLIETUVIS-RETI-VARDAI (8 pp.), LT-VU-ELABA-20206206 (10 pp.), LT-KUZAVINIS-KALBOTYRA-X (14 pp.), LT-VU-ELABA-4017487 (8 pp.) and EE-OMAKEEL-2016-2-14 (9 pp.). Reused originals (Salys, Rajandi) were not downloaded again. Page images were rendered with PyMuPDF because `pdftoppm` is not on the PATH of every shell; images remain private in `var/namedays-research/round101/`.

## 6–10 May (round 102)

No new PDF was acquired. Page images were rendered privately in var/namedays-research/round102/.
