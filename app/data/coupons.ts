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
  longevity: number; // 1-10
  sillage: number; // 1-10
  rating: number; // 1-5
  reviewCount: number;
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
      "Universally acclaimed compliment puller",
      "Exceptional versatility across all seasons and occasions",
      "Smooth, high-grade incense and sandalwood drydown",
      "Long-lasting 8-10 hour longevity with balanced projection"
    ],
    cons: [
      "Very popular, so it is not an ultra-niche or rare scent profile",
      "Rarely discounted directly by Chanel (authorized retail deals only)"
    ],
    expertVerdict:
      "Bleu de Chanel Eau de Parfum remains the gold standard of modern blue fragrances. It strikes the elusive equilibrium between mass appeal and high-elegance Parisian craftsmanship. The citrus opening is crisp and natural, while the smoky incense and New Caledonian sandalwood lend depth that elevates it far above standard commercial scents.",
    fullReview:
      "Bleu de Chanel EDP is the benchmark blue fragrance for the discerning gentleman. Created by Chanel master perfumer Jacques Polge, it refines the crisp citrus-peppermint blast of the original EDT with deeper layers of amber resin and dry cedarwood. During testing, the projection radiates cleanly for the initial 2.5 hours before resting into a sophisticated, personal aura of incense and creamy sandalwood that lasts past 9 hours. Whether worn to an executive board meeting, an intimate anniversary dinner, or as an everyday signature, it radiates quiet confidence without shouting.",
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
      "The most iconic masculine niche fragrance of the 21st century",
      "Unmatched juxtaposition of fruity pineapple and smoky birch",
      "World-class natural ambergris base note with oceanic radiance",
      "Incredible sillage that leaves an unforgettable signature trail"
    ],
    cons: [
      "Premium luxury price tag",
      "Batch variation debates among collector communities"
    ],
    expertVerdict:
      "Aventus is more than a fragrance — it is a modern cultural phenomenon. No other scent has managed to balance juicy blackcurrant and charred birch with such regal authority. For those seeking unmatched presence and compliments, it remains an indispensable holy grail in niche perfumery.",
    fullReview:
      "First launched in 2010 to commemorate Creed's 250th anniversary, Aventus quickly redefined luxury masculine perfumery. The genius of the blend lies in its opening counterpoint: vibrant tart apple and luscious pineapple contrasted instantly against dark birch smoke. As it develops, the heart reveals tender French roses alongside earthy patchouli, melting gradually into Creed's legendary hand-selected ambergris accord. Our wear-tests yielded 9.5 hours of persistent longevity with commanding projection that never feels cloying.",
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
      "Richer, smoother, and less sharp than the EDT formulation",
      "Beast-mode performance: lasts 12+ hours on skin and fabrics",
      "Luxurious Sri Lankan sandalwood and warm vanilla drydown",
      "Proven highest compliment-to-spray ratio"
    ],
    cons: [
      "Can be overpowering if oversprayed (2-3 sprays maximum)",
      "High density makes it too heavy for high-heat summer days"
    ],
    expertVerdict:
      "Sauvage Parfum refines the primal magnetism of the Sauvage lineage into an opulent, rounded extract. The shrill ambroxan edges of the original are smoothed over with luscious mandarin, smoky frankincense, and decadent vanilla absolute, resulting in a mature, seductive night-out weapon.",
    fullReview:
      "Dior's Sauvage Parfum elevates the beloved DNA into the realm of true olfactory luxury. From the first spritz, juicy Calabrian bergamot mingles with candied mandarin and resinous elemi. Within minutes, the composition warms on skin, revealing precious Sri Lankan sandalwood harvested in sustainable partnerships. The drydown is warm, smoldering, and enveloped in Tahitian vanilla. In our testing room, the scent survived 12 hours of wear, remaining detectable on collars for over 36 hours.",
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
      "The undisputed benchmark of accessible westernized oud",
      "Hypnotic blend of spicy cardamom and creamy sandalwood",
      "Intimate and aristocratic sillage that draws people closer",
      "Completely unisex with immense seductive appeal"
    ],
    cons: [
      "Moderate projection compared to raw Middle Eastern ouds",
      "Luxury price per milliliter"
    ],
    expertVerdict:
      "Tom Ford Private Blend Oud Wood is an architectural masterpiece of modern perfumery. It tames the feral qualities of agarwood into an impeccably tailored, smoky velvet tuxedo scent. An absolute staple for any serious fragrance wardrobe.",
    fullReview:
      "Oud Wood by Tom Ford redefined how the Western world perceives agarwood. Unlike pungent, animalic Middle Eastern attars, Tom Ford's interpretation is civilized, smooth, and laced with warming spices. The opening cardamom and Brazilian rosewood create an intoxicating invitation before the heart of smoky agarwood and creamy sandalwood takes center stage. On skin, it projects with refined subtlety — noticeable by anyone within arm's reach without ever dominating a room.",
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
      "The most authentic comforting fireplace accord ever bottled",
      "Addictive balance of roasted nuttiness and sweet vanilla smoke",
      "Outstanding longevity for an Eau de Toilette formulation"
    ],
    cons: [
      "Too warm and smoky for hot summer days",
      "Very specific cozy mood"
    ],
    expertVerdict:
      "By the Fireplace is atmospheric perfumery at its finest. It captures the comforting romance of crackling wood embers and marshmallow roasting over an alpine hearth.",
    fullReview:
      "Maison Margiela's Replica series excels at evoking emotional time capsules, and By the Fireplace is undeniably the line's greatest triumph. It delivers an uncannily accurate sensation of standing near a cedar wood fire while holding warm roasted chestnuts. The drydown softens the initial campfire smoke into a creamy, ambered vanilla that clings to wool coats and scarves for days.",
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
      "Unique sunny African marigold note unlike anything else",
      "Effortlessly uplifting, clean, and radiant signature",
      "True unisex appeal suitable for any warm weather day"
    ],
    cons: [
      "Sits closer to skin after 4 hours",
      "Subtle projection for those who prefer heavy beast-mode scents"
    ],
    expertVerdict:
      "Bal d'Afrique is pure sunshine in a bottle. Ben Gorham's love letter to Paris and Africa radiates with sunny joy, clean musks, and earthy vetiver that never feels synthetic.",
    fullReview:
      "Byredo's Bal d'Afrique is celebrated for its ability to smell both intoxicatingly unique and universally welcoming. The African marigold offers a tangy, sun-drenched sweetness that mingles effortlessly with Amalfi lemon and violet blossoms. As it dries, cedarwood and vetiver provide an earthy foundation that makes it wearable year-round.",
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
      "Arguably the highest compliment-getter in modern niche perfumery",
      "Delicious spiced vanilla and caramelized apple accord",
      "Superb 10+ hour longevity with room-filling projection"
    ],
    cons: [
      "Heavy vanilla profile can be sweet for conservative office settings",
      "Coveted niche bottle pricing"
    ],
    expertVerdict:
      "Layton is the king of mass-appealing niche scents. It takes the familiar spicy barbershop structure and infuses it with royalty-grade vanilla and spiced apple liqueur.",
    fullReview:
      "Created by master perfumer Hamid Merati-Kashani, Layton opens with crisp green apple enveloped in calming French lavender. Within thirty minutes, cardamom and pink pepper add energetic spice before settling into a sumptuous base of Madagascar vanilla and creamy guaiac wood. It consistently ranks #1 in independent blind smell tests.",
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
      "The gold standard of luxury clean masculine florals",
      "Silky orris and neroli accord that smells undeniably expensive",
      "Omani royal craftsmanship with extreme longevity"
    ],
    cons: [
      "Floral direction is distinctive and aristocratic, not sweet/fruity",
      "Strict luxury price point"
    ],
    expertVerdict:
      "Reflection Man is the epitome of the gentleman scent. It smells like crisp white Italian linen, bespoke tailoring, and unshakeable inner peace.",
    fullReview:
      "Amouage Reflection Man proves that masculine fragrances can embrace white flowers and powdery iris with supreme authority. Bitter orange leaves and red peppercorns provide a clean snap at the top, opening the door for neroli and Tuscan orris. The sandalwood and vetiver base is royal and unwavering, effortlessly sustaining 11 hours of performance.",
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
    description: "Get 25% off authentic Creed Aventus 100ml flacon — guaranteed original batch",
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
    description: "Save 25% on authentic Amouage Reflection Man 100ml flacon",
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
