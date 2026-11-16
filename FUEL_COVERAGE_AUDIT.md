# Fuel coverage audit — 16 November 2026

The current collection succeeds, but only 153 of 174 network/fuel pairs have prices within the shared 48-hour limit. The 21 gaps below are source limitations, rather than failed primary requests. Missing fuel reports do not prove that a station does not sell that fuel. All pairs remain in the coverage denominator; no old observation is made current by fetching it again.

## Remaining gaps

| Country | Network | Fuel without a fresh quote | Latest original observation / finding |
| --- | --- | --- | --- |
| LV | Neste | 95, diesel | Official site publishes no prices; eligible reserve reports are expired. |
| LV | Rietumu Nafta | 95 | Connected official page publishes regular and reduced-excise diesel only. |
| LT | Utentra | 95 | Official LEA feed reports diesel at Pramonės g. 16; no 95 quote is provided. |
| EE | Hepa | 95, diesel | 11 November / 13 November. |
| EE | Eksar-Transoil | 95, diesel | 12 September / 3 November. |
| EE | Texor | 95, diesel | 4 October for both products. |
| EE | Anna Kütus | 95 | 29 August; its diesel quote is recent. |
| EE | Herm Trade OÜ | 95, diesel | 29 September for both products. |
| EE | Kudina Tankla | 95, diesel | 24 September / 14 November at 06:43 UTC (already older than 48 hours). |
| EE | Levax JK OÜ | 95, diesel | No 95 report; diesel dated 13 November. Its 98 quote cannot substitute for 95. |
| EE | MT Oil OÜ | 95, diesel | 2 October / 8 November. |
| EE | OBB Kaubanduse OÜ | 95, diesel | 9 September for both products. |

Dates describe the inspected snapshot and will change when new observations arrive. FuelEst's network averages include older observations, so those averages cannot replace current station quotes.

## Sources checked and limits

- [Neste official price page](https://www.neste.lv/privatpersonam/stacijas/degvielas-cenas): directs customers to the station price display and pump. No online current quote to collect. Existing [EnergijasCenas reserve](https://energijascenas.lv/lv/degvielas-cenas/riga): four eligible Waze reports, all expired; zero accepted quotes. Preserve original observation dates in diagnostics.
- [Rietumu Nafta retail](https://rietumunafta.lv/degvielas-mazumtirdznieciba/): regular diesel remains supported; no 95 quote. Agricultural reduced-excise fuel remains excluded.
- [LEA official price feed](https://degalukainos.ena.lt/): Utentra supplies a diesel record, with no 95 record. Other LEA-powered comparison sites show the same absence; copying them would not add evidence.
- [FuelEst](https://fuelest.ee/): station-level original timestamps confirm the EE gaps. Its public client computes company averages from the ten latest station observations without enforcing our 48-hour limit. Do not import those averages as fresh evidence.
- [Liitrihind public API](https://liitrihind.ee/api/kartta.json), described in its [service documentation](https://liitrihind.ee/teave): 490 stations; latest 95/diesel observation 8 November 2026 at 12:46:39 UTC, zero within 48 hours. Not enabled as a fresh-price fallback.
- [PildiLētāk public feed](https://pildiletak.lv/api/prices?payload=24): snapshot generated 2 November 2026 at 13:23 UTC. Neste has no official price. Reject snapshot generation time and carried-forward prices as new observations.
- [Hepa official stations](https://hepa.ee/): locations and fuel availability, no pump price feed found. [Eksar-Transoil stations](https://eksar.ee/eksar-transoil-tanklad/) and [Texor](https://texor.ee/) likewise publish locations/services without a usable current retail price.
- [Kudina](https://kudina.ee/): no dated retail price found; the fetched page also contained unrelated injected advertising, so it is unsuitable for automatic price extraction.
- [EestiHinnad](https://eestihinnad.ee/kutusehinnad): automated request returned HTTP 403. No challenge bypass or replacement of original observations attempted. [Tanklad.ee](https://tanklad.ee/) primarily exposes brand averages and cannot establish fresh prices for the missing small networks.
- Searches for Anna Kütus, Herm Trade, Levax JK, MT Oil and OBB Kaubanduse found no additional verified current retail-price source. Future integration requires station identity, fuel grade, retail scope and original observation time.

## Changes and repeatable checks

Reserve-fetch failures now enter collector errors and the final update error summary. A changed Straujupīte page cannot silently clear successful station prices by returning an empty result. Coverage distinguishes an unreported fuel from an expired quote, retains the newest original reserve evidence, reports its age and includes the source status. The final PowerShell output repeats the remaining gaps after build/publication.

Run `node scripts/diagnose-fuel-coverage.mjs` from the public repository to inspect the private SQLite fuel snapshot without network requests, collection, generation or publication. Set an absolute `DATA_DIR` if the database is elsewhere. It writes only `artifacts/fuel-coverage-report.json`; it opens SQLite read-only and does not access name-day content.

Use `scripts/update-widgets.ps1 -Profile Prices -Force` for an explicitly requested current-price refresh and publication. This profile does not run the name-day statistics or history tasks. A future source can improve coverage only when it supplies new eligible evidence. Keep `partial` while real gaps remain.
