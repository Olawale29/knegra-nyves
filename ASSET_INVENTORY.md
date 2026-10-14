# KNEGRA NYVES — Asset inventory

Every image and film on the site is registered once in `src/data/media.ts`; swap a file in `public/media/` (same name) or change its path there.
Originals came from two places supplied by the client: the **Google Drive** folder (`drive-download-20261014…zip`) and the **Instagram** feed export (`MassDownloader_knegranyves_user_feed_2026-10-14.zip`).
Photos were auto-oriented, capped at 2000 px on the long edge and saved as progressive JPEG (q84). Next.js serves resized AVIF/WebP versions at runtime.

## Brand marks

| File | Source | Notes |
|---|---|---|
| `public/brand/wordmark-stacked.png` | Instagram post 3706789642205705269 (camel logo on black) | Traced to a transparent mask; recoloured in CSS |
| `public/brand/wordmark.png` | same | KNEGRA line only — used in the header |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.jpg` | derived | Favicon / share card built from the wordmark + Art of Flight photo |

## Photographs (58)

| Key | Path | Original file | From | Size | Used in |
|---|---|---|---|---|---|
| `camelFlight` | `/media/scarves/camel-monogram-flight.jpg` | IMG_1609.JPG | Google Drive | 1028×1024 | data/products, home/HeroCampaign, layout/MobileNavigation, layout/SiteHeader |
| `camelSculpture` | `/media/scarves/camel-monogram-sculpture.jpg` | IMG_1611.JPG | Google Drive | 1028×1024 | data/products, home/EditorialSection |
| `camelHat` | `/media/scarves/camel-monogram-hat.jpg` | IMG_1612.JPG | Google Drive | 1028×1024 | data/products, home/EditorialSection |
| `camelStudio` | `/media/scarves/camel-monogram-studio.jpg` | IMG_1630.JPG | Google Drive | 2000×1116 | data/products |
| `noirMarble` | `/media/scarves/noir-monogram-marble.jpg` | IMG_1617.JPG | Google Drive | 1024×1029 | data/products, home/EditorialSection |
| `noirDraped` | `/media/scarves/noir-monogram-draped.jpg` | IMG_1618.JPG | Google Drive | 1024×1029 | data/collections, data/products |
| `noirRail` | `/media/scarves/noir-monogram-rail.jpg` | b55b5133-41b2-4aee-a610-136bef0b713c.jpg | Google Drive | 1000×691 | data/products |
| `noirStudio` | `/media/scarves/noir-monogram-studio.jpg` | IMG_1628.JPG | Google Drive | 2000×1116 | data/products |
| `flightFlat` | `/media/scarves/flight-ivory-flat.jpg` | IMG_1626.JPG | Google Drive | 1622×1624 | data/products, home/RegisterTeaser |
| `flightStudio` | `/media/scarves/flight-ivory-studio.jpg` | IMG_1627.JPG | Google Drive | 2000×1116 | data/collections, data/content, data/products |
| `flightRail` | `/media/scarves/flight-ivory-rail.jpg` | 59489ca2-4837-43ed-a85a-8e01d62283e5.jpg | Google Drive | 1000×691 | data/products, home/EditorialSection |
| `flightPoster` | `/media/campaign/art-of-flight-poster.jpg` | IMG_1623.JPG | Google Drive | 1024×1025 | data/products |
| `coordTrouserFront` | `/media/coord/shirt-trouser-front.jpg` | IMG_1635.JPG | Google Drive | 2000×2000 | data/collections, data/products |
| `coordTrouserBack` | `/media/coord/shirt-trouser-back.jpg` | IMG_1637.JPG | Google Drive | 2000×2000 | data/products |
| `coordShortA` | `/media/coord/shirt-short-a.jpg` | IMG_1640.JPG | Google Drive | 2000×2000 | data/products |
| `coordShortB` | `/media/coord/shirt-short-b.jpg` | IMG_1641.JPG | Google Drive | 2000×2000 | data/collections, data/products |
| `coordShortC` | `/media/coord/shirt-short-c.jpg` | IMG_1642.JPG | Google Drive | 2000×2000 | data/products |
| `headbandNoir` | `/media/headband/noir-pair.jpg` | 3888214771723588544_64493989386_2.jpg | Instagram | 1080×1350 | data/products |
| `headbandOlive` | `/media/headband/olive.jpg` | 3890199572412705500_64493989386.jpg | Instagram | 1350×1687 | data/products |
| `headbandCobaltWorn` | `/media/headband/cobalt-worn.jpg` | 3752474939475785084_64493989386_5.jpg | Instagram | 1242×1656 | data/collections, data/products, layout/SiteHeader |
| `headbandFlatlay` | `/media/headband/flatlay.jpg` | 3752474939475785084_64493989386_7.jpg | Instagram | 1440×1920 | data/collections, data/products |
| `headbandFlatlayAlt` | `/media/headband/flatlay-alt.jpg` | 3752474939475785084_64493989386_1.jpg | Instagram | 1440×1920 | data/products |
| `headbandColours` | `/media/headband/colours.jpg` | 3706789642205705269_64493989386_2.jpg | Instagram | 1080×1080 | data/products |
| `headbandPricePost` | `/media/headband/price-post.jpg` | 3706789642205705269_64493989386_1.jpg | Instagram | 1080×1080 | spare — registered for easy swaps |
| `formsCover` | `/media/forms/cover.jpg` | 3838197194431800797_64493989386_1.jpg | Instagram | 1080×1350 | data/collections, data/products |
| `formsOrbis` | `/media/forms/orbis.jpg` | 3838197194431800797_64493989386_2.jpg | Instagram | 1080×1350 | data/products, layout/SiteHeader |
| `formsLinea` | `/media/forms/linea.jpg` | 3838197194431800797_64493989386_3.jpg | Instagram | 1080×1350 | data/products |
| `formsQuadrum` | `/media/forms/quadrum.jpg` | 3838197194431800797_64493989386_4.jpg | Instagram | 1080×1350 | data/collections, data/products |
| `teeNoir` | `/media/tees/embossed-noir.jpg` | 3846674432538113051_64493989386_1.jpg | Instagram | 1440×1920 | data/products |
| `teeA` | `/media/tees/embossed-a.jpg` | 3846674432538113051_64493989386_2.jpg | Instagram | 1440×1920 | data/products |
| `teeB` | `/media/tees/embossed-b.jpg` | 3846674432538113051_64493989386_3.jpg | Instagram | 1440×1920 | data/products |
| `teeC` | `/media/tees/embossed-c.jpg` | 3846674432538113051_64493989386_4.jpg | Instagram | 1440×1920 | data/products |
| `teeD` | `/media/tees/embossed-d.jpg` | 3846674432538113051_64493989386_5.jpg | Instagram | 1440×1920 | data/products |
| `randolphShoreHat` | `/media/randolph/shore-hat.jpg` | 3854783019349052870_64493989386_4.jpg | Instagram | 1277×1699 | data/collections, data/content, data/products, home/Lookbook, layout/SiteHeader |
| `randolphDuneSeated` | `/media/randolph/dune-seated.jpg` | 3854783019349052870_64493989386_2.jpg | Instagram | 1276×1698 | data/products |
| `randolphPortrait` | `/media/randolph/portrait-close.jpg` | 3854783019349052870_64493989386_5.jpg | Instagram | 1284×1709 | data/products, home/Lookbook |
| `randolphShoreBag` | `/media/randolph/shore-bag.jpg` | 3854783019349052870_64493989386_6.jpg | Instagram | 1279×1702 | data/products, home/Lookbook |
| `randolphHat` | `/media/randolph/hat-adjust.jpg` | 3854783019349052870_64493989386_1.jpg | Instagram | 1290×1717 | spare — registered for easy swaps |
| `randolphDuneWide` | `/media/randolph/dune-wide.jpg` | 3855381412572199451_64493989386_2.jpg | Instagram | 1279×1598 | data/collections, data/products |
| `randolphDuneLying` | `/media/randolph/dune-lying.jpg` | 3855381412572199451_64493989386_3.jpg | Instagram | 1276×1595 | spare — registered for easy swaps |
| `randolphFace` | `/media/randolph/face.jpg` | 3855381412572199451_64493989386_4.jpg | Instagram | 781×976 | data/products |
| `randolphDetail` | `/media/randolph/detail.jpg` | 3855381412572199451_64493989386_5.jpg | Instagram | 1274×1592 | data/products, home/Lookbook |
| `shortFlat` | `/media/sport/short-flat.jpg` | 3856244312355158185_64493989386_1.jpg | Instagram | 1264×1685 | data/products |
| `shortBack` | `/media/sport/short-back.jpg` | 3856244312355158185_64493989386_2.jpg | Instagram | 1271×1694 | data/products |
| `shortZip` | `/media/sport/short-zip.jpg` | 3856244312355158185_64493989386_3.jpg | Instagram | 1290×1720 | data/products |
| `shortPocket` | `/media/sport/short-pocket.jpg` | 3856244312355158185_64493989386_4.jpg | Instagram | 1290×1720 | data/products |
| `capsSand` | `/media/caps/caps-sand.jpg` | A77D6105-9306-411E-828B-EFA7999654FE.mov (frame at 5.4s, cropped) | Google Drive | 1080×1350 | data/collections, data/products |
| `recognizedHer` | `/media/social/recognized-her.jpg` | 3887330046796550375_64493989386.jpg | Instagram | 1350×1687 | home/SocialGrid |
| `recognizedHerAlt` | `/media/social/recognized-her-alt.jpg` | 3887628955481675560_64493989386_1.jpg | Instagram | 1080×1350 | spare — registered for easy swaps |
| `recognizedHim` | `/media/social/recognized-him.jpg` | 3887949631455383884_64493989386.jpg | Instagram | 1350×1687 | home/SocialGrid |
| `recognizedDuo` | `/media/social/recognized-duo.jpg` | 3888370353080286281_64493989386.jpg | Instagram | 1440×1920 | home/Pillars, layout/SiteHeader, route: shop |
| `mamafela` | `/media/social/mamafela.jpg` | 3769875774996359568_64493989386_1.jpg | Instagram | 1080×1346 | home/SocialGrid, route: the-house |
| `mamafelaAlt` | `/media/social/mamafela-alt.jpg` | 3769875774996359568_64493989386_4.jpg | Instagram | 1080×1346 | spare — registered for easy swaps |
| `anniversary` | `/media/social/anniversary.jpg` | 3797497809524109462_64493989386.jpg | Instagram | 1347×1679 | home/SocialGrid |
| `inMyBag` | `/media/social/what-in-my-bag.jpg` | 3854337915404613670_64493989386.jpg | Instagram | 1440×1920 | spare — registered for easy swaps |
| `storeWall` | `/media/social/store-wall.jpg` | 3846674432538113051_64493989386_1.jpg | Instagram | 1440×1920 | data/collections, route: shop |
| `futureOfStyle` | `/media/social/the-future-of-style.jpg` | 3855381412572199451_64493989386_1.jpg | Instagram | 1080×1350 | home/SocialGrid |
| `headbandIconic` | `/media/social/headband-iconic.jpg` | 3753527851270437340_64493989386_3.jpg | Instagram | 1080×1346 | home/SocialGrid |

## Films (4)

| Key | Path | Original | Used in |
|---|---|---|---|
| `headbandPortrait` | `/media/video/headband-portrait.mp4` | 3887228602211351800_64493989386.mp4 (Instagram) — first 4.4 s, black border cropped, muted | data/products, home/HeroCampaign |
| `flightScarf` | `/media/video/flight-scarf.mp4` | Silk_scarf_in_gentle_breeze_20261009181432.mp4 (Drive), muted | data/content, data/products |
| `camelScarf` | `/media/video/camel-scarf.mp4` | Silk_scarf_ripples_in_studio_20261009190142.mp4 (Drive), muted | data/products (Monogram Silk Scarf film) |
| `noirScarf` | `/media/video/noir-scarf.mp4` | KNEGRA_NYVES_scarf_ripples_gently_20261009184201.mp4 (Drive), muted | spare — registered for easy swaps |

## Supplied but not used (and why)

- **IMG_1574.PNG** — screenshot of the *Shepherd trench coat* Instagram post. Too low-resolution and UI-framed for a product page; the trench needs its own photography.
- **IMG_5983.HEIC** — HEIC not converted in this pass (no HEIC decoder in the build tools); please re-export as JPEG if it should be used.
- **IMG_0684.JPG** — 392 px headband render; the Instagram version of the same render is used instead at 1080 px.
- **IMG_6726 / IMG_7662 / "White and Black Elegant Fashion Instagram Post.png"** — campaign artwork with type baked in; the clean Instagram equivalents are used.
- **2FA0CBCB… .mov / copy_F689FAE8… .mov** — beach running film carries a baked-in logo; kept for a future campaign page.
- Instagram letter tiles (K, N, E, G, R, A …), festival flyers, holiday and Independence Day posts, and reels with on-screen captions — not product or campaign imagery.
- **Mamafela x KNEGRA NYVES** editorial (used on The House and in the social grid) — has text overlays; a clean frame from that shoot would make a stronger editorial page.

## Still needed from the client

1. **Prices** for everything except the NYVES Coquette headband (the only price verified, from her Instagram pricing post).
2. **Sizes and a size chart**, composition and care for each garment.
3. **Studio photography** for the Shepherd trench coat, the KN baseball caps (currently a video frame), the red KN Forms tee and the women's pink sport set seen in reels.
4. **Clean campaign stills** (no text overlays) from the Recognized and Mamafela shoots.
5. **Founder story**, delivery areas/fees, returns policy, privacy and terms, phone number and studio address.
6. Confirmation that `house@knegranyves.com` (from her draft Base44 site) is a live mailbox, and the production domain.
