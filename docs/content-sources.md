# Content provenance

The supplied mission brief is the primary seed for `content/*.json`. It specifies permanent hall names and descriptions, floors, exhibition dates, theaters, the Sturm Family Wing, opening hours, address, closure dates, and collection divisions. No additional exhibit objects, staff, prices, programs, or collection claims have been invented.

The [official museum home page](https://www.dmns.org/) was retrieved during this build. It supplied the exact land acknowledgment, policy paths, social destinations, purchase destination, and the current cleaning notice. Outbound theater destinations are the actual Films & Shows purchase links. The donation link preserves the official home page's campaign URL. These are ordinary outbound links; no commerce UI or endpoint has been recreated.

The museum's page confirms an Oct. 16, 2026 opening for Mythic Creatures. The build uses `content/site.json`'s `asOf` date, or an explicit `BUILD_DATE`, to choose the status label. This concept's checked content date is 2026-10-16. Runtime hours use America/Denver and retain the “most Fridays” caveat instead of claiming an unconfirmed extended opening.

`notices.json` separates display start, closure start, and display end. The upcoming Prehistoric Journey closure is displayed ahead of Oct. 27. Build-time filtering removes notices after their inclusive end date. Runtime filtering prevents a previously built expired notice from continuing to display in the persistent strip when JavaScript is available. Static deployments should be rebuilt when facts or notices change.

`TODO: confirm with DMNS` is intentional published placeholder copy, required by the brief where approved source material is absent. All placeholder art is inventoried in `content/media.json` and `docs/illustration-brief.md`. Fictional invitations and editorial display copy make no factual claims.

## Font sources

Self-hosted Latin-subset variable WOFF2 files are from [Google Fonts Archivo](https://fonts.google.com/specimen/Archivo) and [Google Fonts Jost](https://fonts.google.com/specimen/Jost). Their SIL Open Font License text is included alongside the files. The site makes no runtime font or third-party requests.
