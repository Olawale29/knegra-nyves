import type { MediaAsset, VideoAsset } from "@/lib/types";

/**
 * Central asset registry. Every image used on the site is declared here once,
 * so swapping a photograph means editing one line. Paths live in /public/media.
 * See ASSET_INVENTORY.md for where each original came from.
 */

const img = (
  src: string,
  width: number,
  height: number,
  alt: string,
  origin: MediaAsset["origin"],
  focus?: string,
): MediaAsset => ({ src, width, height, alt, origin, focus });

export const media = {
  // ---------- Silk scarves (Google Drive) ----------
  camelFlight: img("/media/scarves/camel-monogram-flight.jpg", 1028, 1024, "The camel monogram silk scarf caught mid-flight above a sea cliff", "drive", "45% 50%"),
  camelSculpture: img("/media/scarves/camel-monogram-sculpture.jpg", 1028, 1024, "Camel monogram silk scarf knotted around a carved wooden sculpture on a terrace", "drive"),
  camelHat: img("/media/scarves/camel-monogram-hat.jpg", 1028, 1024, "Camel monogram silk scarf tied around a straw hat", "drive"),
  camelStudio: img("/media/scarves/camel-monogram-studio.jpg", 2000, 1116, "Camel monogram silk scarf laid flat, showing the espresso border", "drive"),
  noirMarble: img("/media/scarves/noir-monogram-marble.jpg", 1024, 1029, "Noir monogram silk scarf floating over a marble surface", "drive"),
  noirDraped: img("/media/scarves/noir-monogram-draped.jpg", 1024, 1029, "Noir monogram silk scarf draped over a dark display stand", "drive"),
  noirRail: img("/media/scarves/noir-monogram-rail.jpg", 1000, 691, "Noir monogram silk scarf hanging from a rail against ochre", "drive"),
  noirStudio: img("/media/scarves/noir-monogram-studio.jpg", 2000, 1116, "Noir monogram silk scarf laid flat on grey", "drive"),
  flightFlat: img("/media/scarves/flight-ivory-flat.jpg", 1622, 1624, "The Art of Flight silk scarf: ivory ground, galloping horses and the KN medallion", "drive"),
  flightStudio: img("/media/scarves/flight-ivory-studio.jpg", 2000, 1116, "The Art of Flight silk scarf laid flat on warm stone", "drive"),
  flightRail: img("/media/scarves/flight-ivory-rail.jpg", 1000, 691, "The Art of Flight silk scarf hanging from a rail against black", "drive"),
  flightPoster: img("/media/campaign/art-of-flight-poster.jpg", 1024, 1025, "The Art of Flight campaign: a woman releasing the ivory scarf into the wind", "drive"),

  // ---------- Monogram co-ords (Google Drive renders) ----------
  coordTrouserFront: img("/media/coord/shirt-trouser-front.jpg", 2000, 2000, "Monogram camp shirt and trouser set, front view", "drive"),
  coordTrouserBack: img("/media/coord/shirt-trouser-back.jpg", 2000, 2000, "Monogram camp shirt and trouser set, back view", "drive"),
  coordShortA: img("/media/coord/shirt-short-a.jpg", 2000, 2000, "Monogram camp shirt and short set, front view", "drive"),
  coordShortB: img("/media/coord/shirt-short-b.jpg", 2000, 2000, "Monogram camp shirt and short set, styled together", "drive"),
  coordShortC: img("/media/coord/shirt-short-c.jpg", 2000, 2000, "Monogram camp shirt and short set on a pale ground", "drive"),

  // ---------- NYVES Coquette Headband (Instagram) ----------
  headbandNoir: img("/media/headband/noir-pair.jpg", 1080, 1350, "Two noir Coquette headbands, one with a silver KN monogram and one tonal", "instagram"),
  headbandOlive: img("/media/headband/olive.jpg", 1350, 1687, "Olive Coquette headband with a black KN monogram", "instagram"),
  headbandCobaltWorn: img("/media/headband/cobalt-worn.jpg", 1242, 1656, "A woman wearing the cobalt Coquette headband and holding its box", "instagram", "50% 25%"),
  headbandFlatlay: img("/media/headband/flatlay.jpg", 1440, 1920, "Coquette headbands in cobalt, noir, rouge and tangerine with their gift packaging", "instagram"),
  headbandFlatlayAlt: img("/media/headband/flatlay-alt.jpg", 1440, 1920, "Coquette headband packaging laid out with ribbon-tied boxes", "instagram"),
  headbandColours: img("/media/headband/colours.jpg", 1080, 1080, "Coquette headbands in cobalt, lilac and tangerine", "instagram"),
  headbandPricePost: img("/media/headband/price-post.jpg", 1080, 1080, "The Coquette headband pricing post from Instagram", "instagram"),

  // ---------- KN Forms SS26 (Instagram) ----------
  formsCover: img("/media/forms/cover.jpg", 1080, 1350, "KN Forms SS26 campaign cover", "instagram"),
  formsOrbis: img("/media/forms/orbis.jpg", 1080, 1350, "KN Forms Orbis tee in black with the circle motif", "instagram"),
  formsLinea: img("/media/forms/linea.jpg", 1080, 1350, "KN Forms Linea tee in ecru with the straight-line motif", "instagram"),
  formsQuadrum: img("/media/forms/quadrum.jpg", 1080, 1350, "KN Forms Quadrum tees in black and ecru with the square motif", "instagram"),

  // ---------- Signature embossed tee (Instagram) ----------
  teeNoir: img("/media/tees/embossed-noir.jpg", 1440, 1920, "Noir signature tee with tonal embossed wordmark, on a mannequin", "instagram", "50% 35%"),
  teeA: img("/media/tees/embossed-a.jpg", 1440, 1920, "White signature tee with embossed wordmark beneath the KNEGRA NYVES sign", "instagram", "50% 35%"),
  teeB: img("/media/tees/embossed-b.jpg", 1440, 1920, "White signature tee, three-quarter view", "instagram", "50% 35%"),
  teeC: img("/media/tees/embossed-c.jpg", 1440, 1920, "White signature tee, close view of the embossing", "instagram", "50% 35%"),
  teeD: img("/media/tees/embossed-d.jpg", 1440, 1920, "White signature tee on a mannequin", "instagram", "50% 35%"),

  // ---------- The Randolph pajama duo (Instagram) ----------
  randolphShoreHat: img("/media/randolph/shore-hat.jpg", 1277, 1699, "The Randolph pajama duo in red stripe, worn at the shoreline with a white bucket hat", "instagram"),
  randolphDuneSeated: img("/media/randolph/dune-seated.jpg", 1276, 1698, "Seated on a sand dune in the Randolph pajama duo", "instagram"),
  randolphPortrait: img("/media/randolph/portrait-close.jpg", 1284, 1709, "Close portrait in the Randolph shirt with green sunglasses", "instagram"),
  randolphShoreBag: img("/media/randolph/shore-bag.jpg", 1279, 1702, "Raising a KNEGRA NYVES shopping bag at the water's edge", "instagram"),
  randolphHat: img("/media/randolph/hat-adjust.jpg", 1290, 1717, "Adjusting a bucket hat in the Randolph pajama duo", "instagram"),
  randolphDuneWide: img("/media/randolph/dune-wide.jpg", 1279, 1598, "Wide view of the Randolph duo against a sunlit dune", "instagram"),
  randolphDuneLying: img("/media/randolph/dune-lying.jpg", 1276, 1595, "Reclining on the dune in the Randolph duo", "instagram"),
  randolphFace: img("/media/randolph/face.jpg", 781, 976, "Close-up with green sunglasses and the striped piped collar", "instagram"),
  randolphDetail: img("/media/randolph/detail.jpg", 1274, 1592, "Detail of the Randolph stripe, piping and KN monogram", "instagram"),

  // ---------- Sport (Instagram) ----------
  shortFlat: img("/media/sport/short-flat.jpg", 1264, 1685, "Noir sport short laid flat on sand", "instagram"),
  shortBack: img("/media/sport/short-back.jpg", 1271, 1694, "Back view of the noir sport short", "instagram"),
  shortZip: img("/media/sport/short-zip.jpg", 1290, 1720, "Zip pocket with reflective trim on the noir sport short", "instagram"),
  shortPocket: img("/media/sport/short-pocket.jpg", 1290, 1720, "Back welt pocket on the noir sport short", "instagram"),

  // ---------- Caps (frame from a client video) ----------
  capsSand: img("/media/caps/caps-sand.jpg", 1080, 1350, "KN baseball caps in emerald, navy, sky and noir on sand", "derived"),

  // ---------- Campaign & social posts (Instagram) ----------
  recognizedHer: img("/media/social/recognized-her.jpg", 1350, 1687, "Recognized campaign: portrait in a noir KN headband against camel", "instagram"),
  recognizedHerAlt: img("/media/social/recognized-her-alt.jpg", 1080, 1350, "Recognized campaign portrait, alternate frame", "instagram"),
  recognizedHim: img("/media/social/recognized-him.jpg", 1350, 1687, "Recognized campaign: portrait in a noir KN headband against black", "instagram"),
  recognizedDuo: img("/media/social/recognized-duo.jpg", 1440, 1920, "Recognized campaign: two portraits in noir KN headbands", "instagram"),
  mamafela: img("/media/social/mamafela.jpg", 1080, 1346, "Mamafela x KNEGRA NYVES editorial cover", "instagram"),
  mamafelaAlt: img("/media/social/mamafela-alt.jpg", 1080, 1346, "Mamafela x KNEGRA NYVES editorial, seated look", "instagram"),
  anniversary: img("/media/social/anniversary.jpg", 1347, 1679, "KNEGRA NYVES one-year anniversary, 2024 to 2025", "instagram"),
  inMyBag: img("/media/social/what-in-my-bag.jpg", 1440, 1920, "A KNEGRA NYVES shopping bag on sand", "instagram"),
  storeWall: img("/media/social/store-wall.jpg", 1440, 1920, "Mannequin before the KNEGRA NYVES wall sign", "instagram", "50% 30%"),
  futureOfStyle: img("/media/social/the-future-of-style.jpg", 1080, 1350, "The Future of Style: the Randolph duo editorial", "instagram"),
  headbandIconic: img("/media/social/headband-iconic.jpg", 1080, 1346, "Iconic: the white Coquette headband worn on a clay court", "instagram"),
} satisfies Record<string, MediaAsset>;

const video = (src: string, poster: MediaAsset, label: string): VideoAsset => ({
  src,
  poster,
  width: poster.width,
  height: poster.height,
  label,
});

export const videos = {
  headbandPortrait: video(
    "/media/video/headband-portrait.mp4",
    img("/media/video/headband-portrait.jpg", 720, 1280, "Portrait in the noir Coquette headband, light moving across her face", "instagram", "50% 30%"),
    "Portrait in the noir Coquette headband",
  ),
  flightScarf: video(
    "/media/video/flight-scarf.mp4",
    img("/media/video/flight-scarf.jpg", 1280, 720, "The Art of Flight silk scarf rippling on a stone surface", "drive"),
    "The Art of Flight scarf in motion",
  ),
  camelScarf: video(
    "/media/video/camel-scarf.mp4",
    img("/media/video/camel-scarf.jpg", 1280, 720, "The camel monogram scarf rippling in the studio", "drive"),
    "The camel monogram scarf in motion",
  ),
  noirScarf: video(
    "/media/video/noir-scarf.mp4",
    img("/media/video/noir-scarf.jpg", 1280, 720, "The noir monogram scarf rippling in the studio", "drive"),
    "The noir monogram scarf in motion",
  ),
} satisfies Record<string, VideoAsset>;

export const brandMarks = {
  wordmark: { src: "/brand/wordmark.png", width: 728, height: 203 },
  stacked: { src: "/brand/wordmark-stacked.png", width: 728, height: 292 },
};
