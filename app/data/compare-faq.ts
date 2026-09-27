import type { Perfume } from "./coupons";

/**
 * Per-perfume FAQ for the comparison page.
 *
 * Two questions per fragrance, both answerable from data we actually have: the
 * note pyramid, the concentration, and the season/occasion fields. The third
 * question on the page — about price — is shared and lives in the route, because
 * one honest answer serves all eight and eight copies of it would be eight
 * opportunities to drift apart.
 *
 * These answers deliberately contain no rankings, no superlatives, no price
 * comparisons and no performance figures. There is no measured basis for any of
 * those here, and a FAQ is the last place to put one: it is written to be quoted
 * out of context, so a claim that survives only inside a full paragraph will not
 * survive being pulled out of one.
 *
 * A slug with no entry is not an error — the page renders without its per-fragrance
 * questions rather than inventing them.
 */

type CompareFaq = {
  question: string;
  answer: string;
};

const COMPARE_FAQ: Record<string, CompareFaq[]> = {
  "creed-aventus": [
    {
      question: "What does Aventus actually smell like?",
      answer:
        "Cold fruit over smoke. Pineapple, bergamot, blackcurrant leaves and apple open it, and those are the notes that fade within the first hour or two. What replaces them is birch — that is the note the fragrance is identified by, and it is why people recognise it across a room. Musk, oakmoss, ambergris and vanilla in the base are what keep it on skin rather than letting it disappear.",
    },
    {
      question: "When should I wear it?",
      answer:
        "It leans warm for a citrus opening — spring, summer and autumn suit it, and the birch and patchouli give it enough weight for a cool evening. It is a scent people buy as a signature rather than for a single occasion, which is a fair way to describe how it behaves across a week.",
    },
  ],

  "dior-sauvage": [
    {
      question: "What does Sauvage Parfum actually smell like?",
      answer:
        "Brightness first, then something much heavier. Bergamot, mandarin and elemi open it, and all three are volatile, so the opening reads as light rather than deep. Underneath is Sri Lankan sandalwood and Virginia cedar, with vanilla absolute, tonka bean and frankincense in the base. That base is the whole difference between this and the EDT: the materials are heavy enough that it stays on skin instead of fading out.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Evenings, dates and occasions rather than daylight hours. The base is dense enough that a light application is enough, and in high heat it flattens — this is one of those fragrances that suits autumn and winter much better than summer. Two or three sprays is plenty.",
    },
  ],

  "bleu-de-chanel": [
    {
      question: "What does Bleu de Chanel actually smell like?",
      answer:
        "A bright citrus-and-mint opening sitting on incense. Grapefruit, lemon and pink pepper are the most volatile notes in the pyramid and go first; ginger, nutmeg and jasmine sit underneath; incense, vetiver, cedar, sandalwood and patchouli make up the base and do most of the lasting. Because that base is resinous rather than sweet, the result reads dry and woody rather than heavy, which is the reason it wears as well as it does.",
    },
    {
      question: "When should I wear it?",
      answer:
        "It works in most settings, which is the argument for it. It is close enough to the skin for an office, and the incense base gives it enough depth for evening and formal occasions. If you are deciding between a blue fragrance and something sharper, this is the one that stays wearable all day.",
    },
  ],

  "tom-ford-oud-wood": [
    {
      question: "What does Oud Wood actually smell like?",
      answer:
        "A restrained oud. Cardamom and rosewood open it, Sichuan pepper and vetiver give the middle a dry heat, and tonka bean, vanilla and amber round the wood off in the base. The difference from a Middle Eastern attar is scale — in an attar, oud is the entire fragrance, and here it is one note among six. The sandalwood in the middle is doing much of the work of keeping the drydown soft.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Autumn and winter, evenings and occasions where you want to be close to one person rather than a room. The projection is intimate by design, so it works better in a smaller space than a large one. It is unisex in the way the woody-amber base allows, and the warmth suits cooler weather.",
    },
  ],

  "replica-by-the-fireplace": [
    {
      question: "What does By the Fireplace actually smell like?",
      answer:
        "A wood fire, built from the materials that make one. Cade oil and guaiac wood give the smoke, chestnut accord gives the roasted nuttiness, and clove oil with pink pepper give the sharpness of flame. It is an Eau de Toilette, so the concentration is lower than the parfum versions of the same idea, and the orange blossom in the opening is among the first notes to go. Cashmeran and Peru balsam in the base leave it sitting on wool rather than disappearing by lunchtime.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Cold weather, indoors, evenings. It is a scent that changes the temperature of a room, which is the point and also the limitation — if you want something neutral, this is the opposite of it. Casual and holiday settings suit it better than anything requiring restraint.",
    },
  ],

  "byredo-bal-dafrique": [
    {
      question: "What does Bal d'Afrique actually smell like?",
      answer:
        "Sunlight with a woody floor under it. African marigold is the note in the opening that nothing else quite uses, sitting with bergamot, lemon and neroli; violet and cyclamen soften the middle; black amber, vetiver and Moroccan cedarwood give the drydown enough weight to work outside summer. The musk in the base is what makes it read as skin rather than as a fragrance worn on top of skin.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Daytime and warmer months, though the woody base stops it being a strictly summer scent. It suits casual and office settings because it is a level above a plain citrus without becoming formal. The projection is on the quieter side, so if you want a fragrance to announce itself, this is not one.",
    },
  ],

  "parfums-de-marly-layton": [
    {
      question: "What does Layton actually smell like?",
      answer:
        "The barbershop fougère structure pushed toward sweetness. Bergamot, apple and lavender are the opening and the first to fade; jasmine, violet and geranium sit under them; vanilla, black pepper, guaiac wood and patchouli are the base. It is the guaiac wood alongside the vanilla that produces a barbershop-adjacent drydown rather than a plain sweet one, and that is most of what separates it from a crowded shelf.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Cooler weather and evenings. The base is the heaviest part of the composition, so it flattens in heat, and the vanilla is sweet enough to be much in an office. A light application goes a long way. It is at home at a date, an evening out, or as an evening signature.",
    },
  ],

  "amouage-reflection-man": [
    {
      question: "What does Reflection Man actually smell like?",
      answer:
        "A floral built on a woody base, which is what separates it from the usual sweet or powdery ones. Bitter orange leaf and red pepper berries give the opening some snap, neroli, orris, jasmine and ylang-ylang are the middle, and vetiver, cedarwood, sandalwood and patchouli are the base. The orris is doing much of the work — it gives the centre a powdery texture without the sweetness that usually arrives with it.",
    },
    {
      question: "When should I wear it?",
      answer:
        "Formal and daytime-warmer occasions — executive settings, weddings, anything where a lighter floral would disappear. There is enough vetiver and sandalwood in the base to read as formal rather than casual. If you are looking for a conventional fresh or blue scent, this is deliberately not one.",
    },
  ],
};

export function compareFaqFor(perfume: Perfume): CompareFaq[] {
  return COMPARE_FAQ[perfume.slug] ?? [];
}

export const HAS_COMPARE_FAQ = (slug: string) => Boolean(COMPARE_FAQ[slug]);
