/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDITORIAL RULE FOR THIS FILE — read before editing any prose below
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * No one at PhiloFragrancy has sprayed these bottles. The house publishes no
 * performance figures, and neither do we. So the review prose here may not
 * claim first-hand experience of any kind — not "our testing room", not "our
 * wear-tests", not "our panel found", not "in our experience". A stated
 * measurement we did not make is a false statement about our own process, which
 * is worse than a vague sentence, and when it is repeated as a Review entity in
 * structured data it becomes a manual-action risk under Google's policy.
 *
 * What the prose IS allowed to do is describe the composition: the notes are
 * public, the concentration and family are public, the year and perfumer are
 * public. Performance can be discussed *qualitatively* and derived from the
 * note pyramid, because that is chemistry rather than measurement — citrus and
 * floral top notes are volatile and fade early, resins, woods and musks in the
 * base are not. "The opening is the volatile part" is a true statement about
 * the materials. "It lasted nine and a half hours" is not a statement we are
 * entitled to make.
 *
 * Two things are therefore banned here as firmly as the first-hand claims:
 *   - hours, or any other measured performance figure, stated as fact
 *   - a number attributed to a named third party ("Fragrantica reports 12+ hrs")
 *     that we have not actually read at a recorded date. Unsourced figures
 *     laundered through someone else's name are still fabrications, and they are
 *     worse, because now we have misrepresented a specific third party.
 *
 * `longevity` and `sillage` below are editorial estimates on a 1–10 scale, and
 * the product page labels them as exactly that. They are not measurements.
 *
 * Pricing does not live in this file either. `originalPrice` and
 * `discountedPrice` below are legacy: the UI no longer renders them, and the
 * current retailer figures come from `deals.ts`, labelled as sample data until
 * a checked feed replaces them. Do not put a price into prose.
 *
 * One loose end to be aware of: `server/lib/catalog/seed.ts` still reads these
 * two fields and writes them into the `retailer_offers` table, so the database
 * currently holds eight offers whose prices came from here rather than from a
 * retailer. Nothing on the site reads those rows yet. If anyone points the
 * comparison page at `retailer_offers`, those figures will surface as though
 * they were checked — so seed the table from a real source, or leave it empty,
 * before wiring anything to it.
 *
 * External review-site links are deliberately absent from the product page.
 */

export interface Perfume {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandLogo?: string;
  concentration: string; // Eau de Parfum, Parfum, etc.
  family: string; // Woody, Floral, Oriental, etc.
  image?: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  longevity: number; // 1-10, editorial estimate — not a measurement
  sillage: number; // 1-10, editorial estimate — not a measurement
  /**
   * Legacy. 4.7–4.9 for every entry, and `reviewCount` in the thousands, none
   * of it gathered from anyone. Nothing renders either field any more: not the
   * product page, not the homepage, not the structured data. A review count is
   * the number readers treat most as evidence, which is exactly why inventing
   * one is a mislead rather than an error of taste.
   *
   * They are kept only so the shape of the record does not change, and so that
   * if a real verified-review integration is ever added there is somewhere to
   * put it. Do not reintroduce them into the UI, and do not treat them as a
   * sorting signal — an earlier version of the homepage ranked its featured
   * reviews by this number, which meant fabricated data was choosing what a
   * visitor saw first.
   */
  rating: number; // unused — legacy
  reviewCount: number; // unused — legacy
  imageGradient: string; // fallback CSS gradient
  season: string[];
  occasion: string[];
  originalPrice: number;
  discountedPrice: number;
  pros: string[];
  cons: string[];
  expertVerdict: string;
  fullReview: string;
  affiliateUrl: string;
}

/**
 * Legacy. Retained only for the fields the UI still reads.
 *
 * `retailer` and `retailLink` are used by the product page's "where to buy"
 * card, and that is the whole reason this array still exists.
 *
 * `code`, `discount`, `discountValue`, `minPurchase`, `usesLeft` and
 * `expiresAt` are a fabrication that outlived its feature. None of these codes
 * is issued by any retailer, and the "verified"/"guaranteed authentic" wording
 * in `description` was never backed by a process. The coupon UI was removed
 * precisely because a "reveal code" button that copies a string no retailer
 * honours is a broken promise. Do not render these fields again, and do not
 * repopulate them with real-looking placeholders — a code that does not work is
 * worse than no code at all.
 */
export interface Coupon {
  id: string;
  perfumeId: string;
  code: string;
  discount: string; // "25% OFF" or "$30 OFF"
  discountValue: number; // numeric for sorting
  description: string;
  expiresAt: string; // ISO date string
  isExclusive: boolean;
  isFeatured: boolean;
  retailLink: string;
  retailer: string;
  minPurchase?: number;
  usesLeft?: number;
}

export const PERFUMES: Perfume[] = [
  {
    id: "chanel-bleu",
    slug: "bleu-de-chanel",
    name: "Bleu de Chanel",
    brand: "Chanel",
    concentration: "Eau de Parfum",
    family: "Woody Aromatic",
    image: "/images/bleu-de-chanel.jpg",
    topNotes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    heartNotes: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    baseNotes: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli"],
    description:
      "An ode to masculine freedom written in an aromatic-woody fragrance with a captivating trail. A timeless scent housed in an enigmatic blue bottle. Bleu de Chanel expresses an accomplished character through a pure and even composition.",
    longevity: 9,
    sillage: 8,
    rating: 4.9,
    reviewCount: 18420,
    imageGradient: "linear-gradient(135deg, #091428 0%, #112240 50%, #1e3a5f 100%)",
    season: ["Spring", "Summer", "Fall", "Winter"],
    occasion: ["Signature", "Office", "Evening", "Formal"],
    originalPrice: 165,
    discountedPrice: 132,
    pros: [
      "Widely considered the most versatile blue fragrance sold",
      "Dry, resinous incense drydown rather than a sweet or powdery one",
      "Layered structure: a bright opening over a woody base",
      "Sits close enough to skin to wear in an office"
    ],
    cons: [
      "Very widely worn, so it is not a distinctive scent profile",
      "Rarely discounted directly by Chanel — the offers listed here come from third-party retailers"
    ],
    expertVerdict:
      "Bleu de Chanel Eau de Parfum is the reference point for the modern blue fragrance. It balances mass appeal with Parisian craft, and the reason it wears as well as it does is structural: the citrus opening is loud for an hour, and everything after it is incense, vetiver and woods that stay close to the skin.",
    fullReview:
      "Bleu de Chanel EDP layers a bright citrus-and-mint opening over an incense drydown, which is the whole idea of the fragrance. Grapefruit, lemon and pink pepper are the most volatile notes in the pyramid and fade first; ginger, nutmeg and jasmine sit under them; incense, vetiver, cedar, sandalwood and patchouli make up the base and do most of the lasting. Because that base is resinous rather than sweet, the result reads dry and woody instead of heavy, and it is why the scent is usually described as season-spanning. Jacques Polge composed it, and the composition is closer to a classic fougère than the name suggests. Chanel does not publish performance figures and this review does not measure any — the current retailer offers are on the comparison page.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/chanel/bleu-de-chanel/eau-de-parfum?coupon=BLEU20&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "creed-aventus",
    slug: "creed-aventus",
    name: "Aventus",
    brand: "Creed",
    concentration: "Eau de Parfum",
    family: "Chypre Fruity",
    image: "/images/creed-aventus.jpg",
    topNotes: ["Pineapple", "Bergamot", "Blackcurrant Leaves", "Apple"],
    heartNotes: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    baseNotes: ["Musk", "Oakmoss", "Ambergris", "Vanilla"],
    description:
      "A legendary fragrance that celebrates strength, vision, and success. Inspired by the dramatic life of a historic emperor, Aventus opens with a vibrant burst of Italian bergamot and pineapple before giving way to smoky birch and rich ambergris.",
    longevity: 9,
    sillage: 9,
    rating: 4.8,
    reviewCount: 14280,
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    season: ["Spring", "Summer", "Fall"],
    occasion: ["Executive", "Evening", "Celebrations", "Signature"],
    originalPrice: 495,
    discountedPrice: 371,
    pros: [
      "The pineapple-against-birch contrast is unusual in a release this well known",
      "Strong, recognisable opening that reads clearly across a room",
      "Ambergris and musk in the base give it staying power on skin",
      "Widely available, so counterfeits are the main risk rather than supply"
    ],
    cons: [
      "Sits at the top of the designer-adjacent price tier",
      "Very widely worn — the bottle in the room is usually recognisable",
      "Batch variation is a recurring discussion among buyers of this release"
    ],
    expertVerdict:
      "Aventus has become a reference point rather than simply a good fragrance. What holds it up is the contrast at the centre of the pyramid — cold fruit over smoke — and the fact that the ambergris and musk in the base keep the whole thing sitting on skin instead of vanishing.",
    fullReview:
      "Aventus was released in 2010 on a fruit-to-wood structure: pineapple, bergamot, blackcurrant leaves and apple open it, birch and patchouli carry the middle, and musk, oakmoss, ambergris and vanilla hold the drydown. The pineapple and bergamot are the volatile part and give way within the first hour or two; what remains recognisable at a distance is the birch, and that is the note the fragrance is bought for. Ambergris and musk in the base are why it lingers rather than disappearing. It is a niche-leaning release priced at the top of the designer tier, and the argument against it is mostly that the birch reads as more divisive than the fruit once the opening has passed. Creed does not publish performance figures and this review does not measure any — the retailer offers are on the comparison page.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/creed/creed-aventus/eau-de-parfum?coupon=AVENTUS25&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "dior-sauvage",
    slug: "dior-sauvage",
    name: "Sauvage Parfum",
    brand: "Dior",
    concentration: "Parfum",
    family: "Aromatic Amber",
    image: "/images/dior-sauvage.jpg",
    topNotes: ["Calabrian Bergamot", "Mandarin", "Elemi"],
    heartNotes: ["Sandalwood", "Virginia Cedar"],
    baseNotes: ["Vanilla Absolute", "Tonka Bean", "Frankincense"],
    description:
      "A highly concentrated interpretation of Sauvage that fuses extreme freshness with warm oriental tones. François Demachy, Dior Perfumer-Creator, drew inspiration from untouched wilderness beneath a blue-tinged night sky as intense aromas of a crackling fire rise into the air.",
    longevity: 10,
    sillage: 9,
    rating: 4.7,
    reviewCount: 22150,
    imageGradient: "linear-gradient(135deg, #0d1117 0%, #1c2a3a 50%, #2d4a6e 100%)",
    season: ["Fall", "Winter", "Spring"],
    occasion: ["Evening", "Date Night", "Special Events"],
    originalPrice: 185,
    discountedPrice: 148,
    pros: [
      "Heavier and rounder than the Sauvage EDT, with the sharp edges taken off",
      "A base built on sandalwood, vanilla absolute and frankincense, which is what keeps it going",
      "Reads as a finished scent rather than a fresh one from the first hour",
      "Sits at a noticeably lower price than most of the niche tier"
    ],
    cons: [
      "The density is too much for high heat — it flattens in summer",
      "Easy to overspray; the base is not subtle about being there"
    ],
    expertVerdict:
      "Sauvage Parfum is the version of the line worth buying. The EDT is a fresh fragrance that happens to last; the Parfum is a composed scent with a woody base, and that base is what makes it work past the first few hours.",
    fullReview:
      "Sauvage Parfum is a higher concentrate of the Sauvage line, and the difference is mostly in the base. Bergamot, mandarin and elemi open it — all three are volatile, so the opening reads as brightness rather than depth — while Sri Lankan sandalwood and Virginia cedar form the body, and vanilla absolute, tonka bean and frankincense the base. That base is the reason it behaves like a Parfum rather than a stronger EDT: the materials are heavier, so it stays on skin rather than fading out. François Demachy composed it. Dior publishes no longevity figures and this review does not measure any; the sandalwood and vanilla in the base are the reason it is usually worn in the evening rather than through the day.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/christian-dior/sauvage/parfum?coupon=SAUVAGE20&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "tom-ford-oud",
    slug: "tom-ford-oud-wood",
    name: "Oud Wood",
    brand: "Tom Ford",
    concentration: "Eau de Parfum",
    family: "Woody Oriental",
    image: "/images/tom-ford-oud-wood.jpg",
    topNotes: ["Rare Oud Wood", "Rosewood", "Cardamom"],
    heartNotes: ["Sichuan Pepper", "Sandalwood", "Vetiver"],
    baseNotes: ["Tonka Bean", "Vanilla", "Amber"],
    description:
      "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal, oud wood is often burned in incense-filled temples. Exotic rosewood and cardamom give way to a smoky blend of rare oud wood, sandalwood and vetiver.",
    longevity: 8,
    sillage: 8,
    rating: 4.9,
    reviewCount: 9423,
    imageGradient: "linear-gradient(135deg, #2d1b00 0%, #5c3d11 50%, #8b5e2a 100%)",
    season: ["Fall", "Winter"],
    occasion: ["Evening", "Special Occasion", "Date Night", "Black Tie"],
    originalPrice: 295,
    discountedPrice: 236,
    pros: [
      "A restrained reading of oud — a note in a composition rather than the whole thing",
      "Cardamom and rosewood make the opening more approachable than the material usually is",
      "Sandalwood in the middle keeps the drydown soft rather than leathery",
      "Wearable in a way raw Middle Eastern oud is not"
    ],
    cons: [
      "Moderate projection compared to a true oud attar",
      "Expensive per millilitre"
    ],
    expertVerdict:
      "Oud Wood is the westernised oud, done carefully. It is not trying to imitate an attar — it uses oud as a texture underneath rosewood and sandalwood, which is what makes it wearable in a way the raw material is not.",
    fullReview:
      "Oud Wood is Tom Ford's take on agarwood, and it is a restrained one: the oud is used as texture rather than as a statement. Cardamom and rosewood open it, Sichuan pepper and vetiver give the middle a dry heat, and tonka bean, vanilla and amber round the wood off in the base. Set against a Middle Eastern attar, where oud is the entire perfume, here it is one note among six, and that is the point — the sandalwood in the middle is doing much of the work of making the drydown soft. It reads as intimate rather than as a room-filler, and it is unisex in the way the woody-amber base allows. Tom Ford does not publish performance figures and this review does not measure any; the retailer offers are on the comparison page.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/tom-ford/tom-ford-oud-wood/eau-de-parfum?coupon=TFOUD20&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "maison-margiela-fireplace",
    slug: "replica-by-the-fireplace",
    name: "Replica — By the Fireplace",
    brand: "Maison Margiela",
    concentration: "Eau de Toilette",
    family: "Warm Spicy Gourmand",
    topNotes: ["Clove Oil", "Pink Pepper", "Orange Flower Petals"],
    heartNotes: ["Chestnut Accord", "Guaiac Wood Oil", "Cade Oil"],
    baseNotes: ["Vanilla Accord", "Peru Balsam", "Cashmeran"],
    description:
      "Close your eyes and imagine a crackling fireplace on a snowy winter evening in Chamonix, 1971. Maison Margiela captures memories in a bottle with comforting notes of roasted chestnuts, warm woods, and enveloping sweet vanilla smoke.",
    longevity: 8,
    sillage: 8,
    rating: 4.8,
    reviewCount: 11200,
    imageGradient: "linear-gradient(135deg, #3d0c02 0%, #6b2b1a 50%, #c4622d 100%)",
    season: ["Fall", "Winter"],
    occasion: ["Cozy Days", "Casual", "Evening", "Holidays"],
    originalPrice: 165,
    discountedPrice: 135,
    pros: [
      "Cade oil and guaiac wood do the smoke honestly rather than as an effect",
      "Chestnut accord is roasted rather than sweet, which keeps it from tasting like dessert",
      "Reads as a specific place and season rather than as a signature"
    ],
    cons: [
      "Too warm and smoky for hot weather",
      "Affects how warmly a room reads — it is not a neutral scent"
    ],
    expertVerdict:
      "By the Fireplace captures a memory rather than a mood: a wood fire, roasting chestnuts, cold outside. It is the strongest idea in the Replica line, and it works because the materials are the right ones for the job rather than approximations of them.",
    fullReview:
      "By the Fireplace is built to smell like a wood fire, and the materials are the right ones for it: cade oil and guaiac wood give the smoke, chestnut accord gives the roasted nuttiness, clove oil and pink pepper the sharpness of flame. It is an Eau de Toilette, so the concentration is lower than the parfum versions of the same idea, and the orange blossom in the opening is among the first things to go. Cashmeran and Peru balsam in the base are what leave it sitting on wool rather than disappearing by lunchtime. It is a cold-weather scent in every sense of the word — less a signature than a temperature.",
    affiliateUrl: "https://www.sephora.com/product/replica-by-the-fireplace-P404758?coupon=REPLICA15&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "byredo-bal-dafrique",
    slug: "byredo-bal-dafrique",
    name: "Bal d'Afrique",
    brand: "Byredo",
    concentration: "Eau de Parfum",
    family: "Floral Woody Musk",
    topNotes: ["African Marigold", "Bergamot", "Lemon", "Neroli"],
    heartNotes: ["Violet", "Cyclamen", "Jasmine"],
    baseNotes: ["Black Amber", "Musk", "Vetiver", "Moroccan Cedarwood"],
    description:
      "A warm and romantic vetiver inspired by late 1920s Paris and its infatuation with African culture, art, music and dance. A celebration of Bohemian glamour with radiant citrus, delicate florals, and grounded woods.",
    longevity: 7,
    sillage: 7,
    rating: 4.7,
    reviewCount: 6840,
    imageGradient: "linear-gradient(135deg, #0d2b1d 0%, #1a5c3a 50%, #2d8a56 100%)",
    season: ["Spring", "Summer", "Fall"],
    occasion: ["Casual Chic", "Office", "Daytime", "Brunch"],
    originalPrice: 225,
    discountedPrice: 180,
    pros: [
      "African marigold is a note almost nothing else uses",
      "Citrus and neroli on top of a woody base, so it reads sunny and still wears like a skin scent",
      "Simple enough to wear every day, which is unusual for a niche release"
    ],
    cons: [
      "The bright part fades early, leaving a quieter woody scent",
      "Low projection for anyone who wants a fragrance to announce itself"
    ],
    expertVerdict:
      "Bal d'Afrique is a fresh-woody formula executed without fuss. The marigold makes the opening distinctive and the vetiver and cedar in the base are what stop it being only a summer scent.",
    fullReview:
      "Bal d'Afrique is a citrus-and-floral composition sitting on a woody base, and the African marigold in the opening is the part nobody forgets. Bergamot, lemon and neroli carry the brightness, violet and cyclamen soften the middle, and black amber, vetiver and Moroccan cedarwood give the drydown enough weight to work outside summer. Musk in the base is what makes it read as skin rather than as a fragrance worn on top of skin. Ben Gorham composed it, and the formula is a fairly conventional fresh-woody one — which is a large part of why it wears as easily as it does. Byredo does not publish performance figures and this review does not measure any.",
    affiliateUrl: "https://www.fragrancenet.com/perfume/byredo/byredo-bal-dafrique/eau-de-parfum?coupon=BYREDO20&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "parfums-de-marly-layton",
    slug: "parfums-de-marly-layton",
    name: "Layton",
    brand: "Parfums de Marly",
    concentration: "Eau de Parfum",
    family: "Oriental Floral Fougere",
    topNotes: ["Crisp Apple", "Bergamot", "Lavender"],
    heartNotes: ["Jasmine", "Violet", "Geranium"],
    baseNotes: ["Vanilla", "Pepper", "Guaiac Wood", "Patchouli"],
    description:
      "Parfums de Marly Layton is a seductive oriental and floral composition with an intense olfactory signature that opens with bergamot and passion apple, leading down to spicy vanilla and noble woods.",
    longevity: 9,
    sillage: 9,
    rating: 4.9,
    reviewCount: 16400,
    imageGradient: "linear-gradient(135deg, #1a0a3d 0%, #3d1a7a 50%, #6b35c4 100%)",
    season: ["Fall", "Winter", "Spring"],
    occasion: ["Date Night", "Evening", "Parties", "Signature"],
    originalPrice: 350,
    discountedPrice: 280,
    pros: [
      "Lavender and apple on top, vanilla and woods underneath — the fougère structure is legible",
      "Guaiac wood with vanilla gives a barbershop-adjacent drydown rather than a plain sweet one",
      "Widely available at the top of the niche tier"
    ],
    cons: [
      "The vanilla is heavy enough to be too sweet for a conservative office",
      "A crowded shelf — the barbershop-adjacent niche is full of similar things"
    ],
    expertVerdict:
      "Layton is a well-executed sweet fragrance rather than an unusual one. The barbershop structure is familiar, but the guaiac wood in the base keeps it from being merely sugary, and that is what separates it from the rest of that shelf.",
    fullReview:
      "Layton is built on the fougère structure — lavender and apple on top, vanilla and woods underneath — and pushed toward sweetness. Bergamot, apple and lavender are the opening and the first to fade; jasmine, violet and geranium sit underneath; vanilla, black pepper, guaiac wood and patchouli make up the base, and it is the guaiac wood with vanilla that gives it a barbershop-adjacent drydown rather than a plain sweet one. The base is the heaviest part of the composition, which is why it is usually worn in cooler weather and why a light application goes a long way. Hamid Merati-Kashani composed it. Parfums de Marly does not publish performance figures and this review does not measure any — the retailer offers are on the comparison page.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/parfums-de-marly/layton/eau-de-parfum?coupon=LAYTON20&utm_source=philofragrancy&utm_medium=affiliate",
  },
  {
    id: "amouage-reflection-man",
    slug: "amouage-reflection-man",
    name: "Reflection Man",
    brand: "Amouage",
    concentration: "Eau de Parfum",
    family: "Woody Floral Musk",
    topNotes: ["Rosemary", "Red Pepper Berries", "Bitter Orange Leaves"],
    heartNotes: ["Neroli", "Orris Root", "Jasmine", "Ylang-Ylang"],
    baseNotes: ["Vetiver", "Cedarwood", "Sandalwood", "Patchouli"],
    description:
      "Capturing the seductive power of a man's inner strength, Reflection Man embodies an unmistakable masculine spirit with refined floral heart and timeless woody base.",
    longevity: 10,
    sillage: 8,
    rating: 4.9,
    reviewCount: 7800,
    imageGradient: "linear-gradient(135deg, #001a3d 0%, #002d6b 50%, #0056b3 100%)",
    season: ["Spring", "Summer", "Fall"],
    occasion: ["Executive", "Weddings", "Formal", "Luxury Daytime"],
    originalPrice: 395,
    discountedPrice: 295,
    pros: [
      "White flowers on a woody base rather than a sweet or powdery one",
      "The orris gives the middle a texture that reads expensive without reading sweet",
      "Vetiver, cedar and sandalwood in the base make it work in cool weather",
      "Bottled in a weight that justifies the shelf it sits on"
    ],
    cons: [
      "The floral direction is distinctive — not a substitute for a conventional blue or fresh scent",
      "Expensive for what it is"
    ],
    expertVerdict:
      "Reflection Man is a floral for someone who does not think of themselves as wearing florals. The trick is the base: woody, not powdery, which keeps the neroli and orris from reading as soft.",
    fullReview:
      "Reflection Man is a floral fragrance built on a woody base, which is what separates it from the usual sweet or powdery ones. Bitter orange leaf and red pepper berries give the opening some snap, neroli, orris, jasmine and ylang-ylang are the middle, and vetiver, cedarwood, sandalwood and patchouli are the base. The orris is doing much of the work — it is what gives the centre a powdery texture without the sweetness that usually arrives with it. Amouage is an Omani house and this is one of its heavier compositions, with enough vetiver and sandalwood in the base to read as formal rather than casual. Amouage does not publish performance figures and this review does not measure any; the retailer offers are on the comparison page.",
    affiliateUrl: "https://www.fragrancenet.com/cologne/amouage/amouage-reflection/eau-de-parfum?coupon=AMOUAGE25&utm_source=philofragrancy&utm_medium=affiliate",
  },
];

export const COUPONS: Coupon[] = [
  {
    id: "c-chanel",
    perfumeId: "chanel-bleu",
    code: "BLEU20",
    discount: "20% OFF",
    discountValue: 20,
    description: "Exclusive 20% discount on Bleu de Chanel Eau de Parfum with verified gift wrapping",
    expiresAt: "2026-12-31T23:59:59Z",
    isExclusive: true,
    isFeatured: true,
    retailLink: "https://www.fragrancenet.com/cologne/chanel/bleu-de-chanel/eau-de-parfum?coupon=BLEU20&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 100,
    usesLeft: 42,
  },
  {
    id: "c-aventus",
    perfumeId: "creed-aventus",
    code: "AVENTUS25",
    discount: "25% OFF",
    discountValue: 25,
    description: "Legacy copy. Not rendered anywhere.",
    expiresAt: "2026-12-31T23:59:59Z",
    isExclusive: true,
    isFeatured: true,
    retailLink: "https://www.fragrancenet.com/cologne/creed/creed-aventus/eau-de-parfum?coupon=AVENTUS25&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 200,
    usesLeft: 18,
  },
  {
    id: "c-sauvage",
    perfumeId: "dior-sauvage",
    code: "SAUVAGE20",
    discount: "20% OFF",
    discountValue: 20,
    description: "20% off Dior Sauvage Parfum 100ml with complimentary luxury sample vials",
    expiresAt: "2026-11-30T23:59:59Z",
    isExclusive: true,
    isFeatured: true,
    retailLink: "https://www.fragrancenet.com/cologne/christian-dior/sauvage/parfum?coupon=SAUVAGE20&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 120,
    usesLeft: 64,
  },
  {
    id: "c-tfoud",
    perfumeId: "tom-ford-oud",
    code: "TFOUD20",
    discount: "$59 OFF",
    discountValue: 59,
    description: "Save $59 on Tom Ford Private Blend Oud Wood Eau de Parfum 50ml",
    expiresAt: "2026-12-15T23:59:59Z",
    isExclusive: true,
    isFeatured: true,
    retailLink: "https://www.fragrancenet.com/cologne/tom-ford/tom-ford-oud-wood/eau-de-parfum?coupon=TFOUD20&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 180,
    usesLeft: 31,
  },
  {
    id: "c-fireplace",
    perfumeId: "maison-margiela-fireplace",
    code: "REPLICA15",
    discount: "15% OFF",
    discountValue: 15,
    description: "15% off Maison Margiela Replica By the Fireplace + free two-day delivery",
    expiresAt: "2026-11-15T23:59:59Z",
    isExclusive: false,
    isFeatured: true,
    retailLink: "https://www.sephora.com/product/replica-by-the-fireplace-P404758?coupon=REPLICA15&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "Sephora",
    usesLeft: 120,
  },
  {
    id: "c-byredo",
    perfumeId: "byredo-bal-dafrique",
    code: "BYREDO20",
    discount: "20% OFF",
    discountValue: 20,
    description: "Exclusive 20% savings on Byredo Bal d'Afrique Eau de Parfum",
    expiresAt: "2026-10-31T23:59:59Z",
    isExclusive: true,
    isFeatured: false,
    retailLink: "https://www.fragrancenet.com/perfume/byredo/byredo-bal-dafrique/eau-de-parfum?coupon=BYREDO20&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 150,
    usesLeft: 22,
  },
  {
    id: "c-layton",
    perfumeId: "parfums-de-marly-layton",
    code: "LAYTON20",
    discount: "20% OFF",
    discountValue: 20,
    description: "Reader exclusive: Save 20% on Parfums de Marly Layton Royal Essence",
    expiresAt: "2026-12-31T23:59:59Z",
    isExclusive: true,
    isFeatured: true,
    retailLink: "https://www.fragrancenet.com/cologne/parfums-de-marly/layton/eau-de-parfum?coupon=LAYTON20&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 220,
    usesLeft: 14,
  },
  {
    id: "c-amouage",
    perfumeId: "amouage-reflection-man",
    code: "AMOUAGE25",
    discount: "25% OFF",
    discountValue: 25,
    description: "Legacy copy. Not rendered anywhere.",
    expiresAt: "2026-11-30T23:59:59Z",
    isExclusive: true,
    isFeatured: false,
    retailLink: "https://www.fragrancenet.com/cologne/amouage/amouage-reflection/eau-de-parfum?coupon=AMOUAGE25&utm_source=philofragrancy&utm_medium=affiliate",
    retailer: "FragranceNet",
    minPurchase: 250,
    usesLeft: 27,
  },
];

export function getPerfumeBySlug(slug: string): Perfume | undefined {
  return PERFUMES.find((p) => p.slug === slug);
}

export function getPerfumeById(id: string): Perfume | undefined {
  return PERFUMES.find((p) => p.id === id);
}

export function getCouponByPerfumeId(perfumeId: string): Coupon | undefined {
  return COUPONS.find((c) => c.perfumeId === perfumeId);
}

export function getCouponByPerfumeSlug(slug: string): Coupon | undefined {
  const perfume = getPerfumeBySlug(slug);
  if (!perfume) return undefined;
  return getCouponByPerfumeId(perfume.id);
}

export function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
