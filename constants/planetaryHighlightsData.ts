export type ImpactTone = "positive" | "neutral" | "challenging";
export type PlanetNature = "Benefic" | "Malefic" | "Neutral";

export interface PlanetImpactSet {
  overview: string;
  career: string;
  relationship: string;
  financial: string;
  health: string;
  spiritual: string;
  remedies: string;
  mantra: string;
  gemstoneRecommendations: string;
}

export interface PlanetDetail {
  origin: string;
  vedicSignificance: string;
  westernSignificance: string;
  strengthAnalysis: string;
  weaknessAnalysis: string;
  friendships: string[];
  enemies: string[];
  zodiacSigns: string[];
  exaltationSign: string;
  debilitationSign: string;
  moolTrikona: string;
  nakshatraInfluence: string;
  houseEffects: string[];
  transitEffects: string;
  retrogradeEffects: string;
  conjunctionEffects: string;
  aspectEffects: string;
}

export interface PlanetConfig {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  category: string;
  currentSign: string;
  currentHouse: string;
  strength: number;
  nature: PlanetNature;
  description: string;
  positiveEffects: string[];
  negativeEffects: string[];
  bestActivities: string[];
  avoidActivities: string[];
  luckyColor: string;
  luckyNumber: number;
  chakra: string;
  gemstone: string;
  deity: string;
  impacts: PlanetImpactSet;
  details: PlanetDetail;
}

export interface TransitConfig {
  id: string;
  planet: string;
  fromSign: string;
  toSign: string;
  date: string;
  time: string;
  impactLevel: ImpactTone;
  categories: Record<string, ImpactTone>;
}

export interface AspectConfig {
  id: string;
  name: string;
  angle: string;
  definition: string;
  meaning: string;
  strength: number;
  positiveEffects: string[];
  challenges: string[];
  bestPractices: string[];
}

export interface EventConfig {
  id: string;
  name: string;
  description: string;
  duration: string;
  globalInfluence: string;
  personalInfluence: string;
  recommendedActivities: string[];
  activitiesToAvoid: string[];
  spiritualPractices: string[];
  remedies: string[];
}

export interface EnergyScore {
  planet: string;
  score: number;
  trend: "up" | "down" | "steady";
  comparison: string;
}

export interface LifeAreaConfig {
  id: string;
  label: string;
  positiveInfluence: string;
  negativeInfluence: string;
  currentTrends: string;
  recommendedActions: string[];
  remedies: string[];
}

export interface RemedyConfig {
  planet: string;
  mantras: string[];
  pujaSuggestions: string[];
  fastingRecommendations: string;
  charityRecommendations: string[];
  gemstones: string[];
  colors: string[];
  meditationPractices: string[];
  yantras: string[];
}

export interface CombinationConfig {
  pair: string;
  meaning: string;
  effects: string;
  strengths: string[];
  weaknesses: string[];
  careerImpact: string;
  relationshipImpact: string;
}

export interface CosmicCalendarItem {
  id: string;
  date: string;
  planet: string;
  type: "Movement" | "Retrograde" | "Eclipse" | "Special Yoga";
  title: string;
  summary: string;
  impactLevel: ImpactTone;
}

const impactLabels = ["Career", "Business", "Love", "Marriage", "Education", "Health", "Finance", "Travel"];

function houseEffectsFor(planet: string, theme: string) {
  return Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} House: ${planet} emphasizes ${theme} through ${house <= 4 ? "identity, family, and foundations" : house <= 8 ? "work, relationships, and shared commitments" : "wisdom, public life, and completion"}.`;
  });
}

function buildImpacts(name: string, focus: string, mantra: string, gemstone: string): PlanetImpactSet {
  return {
    overview: `${name} brings attention to ${focus}, making the day useful for conscious choices and balanced timing.`,
    career: `Career decisions benefit when ${name}'s ${focus} is used with patience, clean communication, and a realistic plan.`,
    relationship: `Relationships improve through honest listening, emotional maturity, and avoiding reactive assumptions.`,
    financial: `Financially, this placement favors measured decisions, reviewing commitments, and avoiding impulse-led spending.`,
    health: `Health themes point toward rhythm, hydration, rest, breathwork, and steady routines over extremes.`,
    spiritual: `Spiritually, ${name} supports self-observation, mantra practice, and gratitude-led correction.`,
    remedies: `Offer water, light, charity, or focused prayer according to the planet's nature and your tradition.`,
    mantra,
    gemstoneRecommendations: `Use ${gemstone} only after personal chart review; choose a clean, ethically sourced stone and test suitability first.`,
  };
}

export const planetaryHighlightsConfig = {
  generatedAtLabel: "Updated for today's sky",
  planets: [
    {
      id: "sun",
      name: "Sun",
      sanskritName: "Surya",
      symbol: "☀",
      category: "Luminary",
      currentSign: "Gemini",
      currentHouse: "10th House",
      strength: 86,
      nature: "Benefic",
      description: "The Sun highlights authority, visibility, purpose, confidence, and leadership choices.",
      positiveEffects: ["Recognition", "Clear priorities", "Leadership courage"],
      negativeEffects: ["Ego clashes", "Impatience", "Overexposure"],
      bestActivities: ["Present ideas", "Meet mentors", "Define goals"],
      avoidActivities: ["Dominating conversations", "Ignoring rest", "Power struggles"],
      luckyColor: "Gold",
      luckyNumber: 1,
      chakra: "Solar Plexus",
      gemstone: "Ruby",
      deity: "Surya Narayana",
      impacts: buildImpacts("Sun", "purpose and public confidence", "Om Hram Hreem Hraum Sah Suryaya Namah", "Ruby"),
      details: {
        origin: "Surya is revered as the solar source of vitality, sight, discipline, and royal intelligence.",
        vedicSignificance: "In Vedic astrology the Sun represents soul force, fatherly authority, status, immunity, and dharma.",
        westernSignificance: "In Western astrology the Sun describes identity, vitality, creative will, and conscious self-expression.",
        strengthAnalysis: "Strong Sun gives courage, consistency, command, and the ability to lead without hiding.",
        weaknessAnalysis: "Weak Sun may show low confidence, authority issues, scattered purpose, or irregular energy.",
        friendships: ["Moon", "Mars", "Jupiter"],
        enemies: ["Venus", "Saturn"],
        zodiacSigns: ["Leo"],
        exaltationSign: "Aries",
        debilitationSign: "Libra",
        moolTrikona: "Leo",
        nakshatraInfluence: "Krittika, Uttara Phalguni, and Uttara Ashadha sharpen leadership, promise, and purification.",
        houseEffects: houseEffectsFor("Sun", "authority and identity"),
        transitEffects: "Sun transits reveal where visibility, responsibility, and decision-making become urgent.",
        retrogradeEffects: "The Sun is never retrograde from Earth's perspective in traditional astrology.",
        conjunctionEffects: "Conjunctions with the Sun intensify a planet and may create combustion themes.",
        aspectEffects: "Solar aspects illuminate motivation, pride, ambition, and the need for conscious leadership.",
      },
    },
    {
      id: "moon",
      name: "Moon",
      sanskritName: "Chandra",
      symbol: "☽",
      category: "Luminary",
      currentSign: "Cancer",
      currentHouse: "4th House",
      strength: 78,
      nature: "Benefic",
      description: "The Moon shapes emotions, home life, intuition, nourishment, and daily receptivity.",
      positiveEffects: ["Emotional insight", "Family healing", "Intuitive timing"],
      negativeEffects: ["Mood swings", "Attachment", "Overthinking"],
      bestActivities: ["Journal", "Cook nourishing meals", "Connect with family"],
      avoidActivities: ["Emotional decisions", "Late-night spirals", "Clinging to the past"],
      luckyColor: "Pearl White",
      luckyNumber: 2,
      chakra: "Sacral",
      gemstone: "Pearl",
      deity: "Gauri",
      impacts: buildImpacts("Moon", "emotional clarity and inner safety", "Om Shram Shreem Shraum Sah Chandraya Namah", "Pearl"),
      details: {
        origin: "Chandra carries the nectar of mind, fertility, beauty, memory, and changing emotional tides.",
        vedicSignificance: "The Moon indicates manas, mother, comfort, public mood, habit patterns, and psychological wellbeing.",
        westernSignificance: "Western astrology reads the Moon as instinct, memory, emotional needs, and private self.",
        strengthAnalysis: "Strong Moon supports empathy, adaptability, popularity, and calm emotional regulation.",
        weaknessAnalysis: "Weak Moon can bring restlessness, worry, dependency, and difficulty feeling settled.",
        friendships: ["Sun", "Mercury"],
        enemies: ["None"],
        zodiacSigns: ["Cancer"],
        exaltationSign: "Taurus",
        debilitationSign: "Scorpio",
        moolTrikona: "Taurus",
        nakshatraInfluence: "Rohini, Hasta, and Shravana strengthen receptivity, skill, and sacred listening.",
        houseEffects: houseEffectsFor("Moon", "emotional needs and belonging"),
        transitEffects: "Moon transits change daily mood, appetite, instinct, and social receptivity.",
        retrogradeEffects: "The Moon does not retrograde in standard geocentric astrology.",
        conjunctionEffects: "Conjunctions with the Moon color feelings and bring matters into personal experience.",
        aspectEffects: "Lunar aspects show how emotions receive, react, and integrate external pressure.",
      },
    },
    {
      id: "mercury",
      name: "Mercury",
      sanskritName: "Budh",
      symbol: "☿",
      category: "Inner Planet",
      currentSign: "Gemini",
      currentHouse: "11th House",
      strength: 72,
      nature: "Neutral",
      description: "Mercury governs speech, trade, analysis, learning, negotiation, and digital movement.",
      positiveEffects: ["Smart networking", "Quick learning", "Better planning"],
      negativeEffects: ["Nervous pace", "Mixed signals", "Over-analysis"],
      bestActivities: ["Write proposals", "Study", "Negotiate"],
      avoidActivities: ["Signing without review", "Gossip", "Multitasking too much"],
      luckyColor: "Emerald Green",
      luckyNumber: 5,
      chakra: "Throat",
      gemstone: "Emerald",
      deity: "Vishnu",
      impacts: buildImpacts("Mercury", "communication and intelligent exchange", "Om Bram Breem Braum Sah Budhaya Namah", "Emerald"),
      details: {
        origin: "Budh is linked with intelligence, wit, commerce, language, youthfulness, and adaptation.",
        vedicSignificance: "Mercury shows intellect, speech, calculation, business, friends, skills, and learning capacity.",
        westernSignificance: "Western astrology treats Mercury as cognition, messaging, analysis, and local movement.",
        strengthAnalysis: "Strong Mercury gives articulate speech, sharp learning, humor, trade ability, and flexible thinking.",
        weaknessAnalysis: "Weak Mercury may cause confusion, anxiety, scattered speech, or unreliable agreements.",
        friendships: ["Sun", "Venus"],
        enemies: ["Moon"],
        zodiacSigns: ["Gemini", "Virgo"],
        exaltationSign: "Virgo",
        debilitationSign: "Pisces",
        moolTrikona: "Virgo",
        nakshatraInfluence: "Ashlesha, Jyeshtha, and Revati deepen strategy, precision, and safe passage.",
        houseEffects: houseEffectsFor("Mercury", "communication and skill"),
        transitEffects: "Mercury transits shape messages, contracts, learning, commerce, and short travel.",
        retrogradeEffects: "Retrograde Mercury favors review, repair, renegotiation, and slower confirmation.",
        conjunctionEffects: "Mercury conjunctions sharpen analysis but can mimic the planets it joins.",
        aspectEffects: "Mercury aspects stimulate conversation, planning, curiosity, and mental flexibility.",
      },
    },
    {
      id: "venus",
      name: "Venus",
      sanskritName: "Shukra",
      symbol: "♀",
      category: "Inner Planet",
      currentSign: "Taurus",
      currentHouse: "2nd House",
      strength: 90,
      nature: "Benefic",
      description: "Venus brings harmony, pleasure, artistry, wealth, affection, and relationship refinement.",
      positiveEffects: ["Magnetism", "Financial ease", "Creative beauty"],
      negativeEffects: ["Indulgence", "Avoiding truth", "Attachment to comfort"],
      bestActivities: ["Create art", "Plan dates", "Beautify spaces"],
      avoidActivities: ["Overspending", "People pleasing", "Lazy promises"],
      luckyColor: "Rose",
      luckyNumber: 6,
      chakra: "Heart",
      gemstone: "Diamond",
      deity: "Lakshmi",
      impacts: buildImpacts("Venus", "love, beauty, and value", "Om Dram Dreem Draum Sah Shukraya Namah", "Diamond or White Sapphire"),
      details: {
        origin: "Shukra is the teacher of refinement, fertility, luxury, art, attraction, and restorative pleasures.",
        vedicSignificance: "Venus governs marriage happiness, comforts, vehicles, arts, semen, wealth, and diplomacy.",
        westernSignificance: "Western astrology reads Venus as attraction, taste, money style, values, and affection.",
        strengthAnalysis: "Strong Venus grants charm, artfulness, kindness, prosperity, and graceful partnership skills.",
        weaknessAnalysis: "Weak Venus may show dissatisfaction, overindulgence, relationship confusion, or weak boundaries.",
        friendships: ["Mercury", "Saturn"],
        enemies: ["Sun", "Moon"],
        zodiacSigns: ["Taurus", "Libra"],
        exaltationSign: "Pisces",
        debilitationSign: "Virgo",
        moolTrikona: "Libra",
        nakshatraInfluence: "Bharani, Purva Phalguni, and Purva Ashadha highlight creation, pleasure, and renewal.",
        houseEffects: houseEffectsFor("Venus", "relationship, beauty, and value"),
        transitEffects: "Venus transits favor relationships, design, purchases, alliances, and pleasure rituals.",
        retrogradeEffects: "Retrograde Venus reopens questions around love, worth, style, and unresolved attractions.",
        conjunctionEffects: "Venus conjunctions soften and beautify planets while increasing desire and attachment.",
        aspectEffects: "Venus aspects harmonize, attract, negotiate, and reveal where values need alignment.",
      },
    },
    {
      id: "mars",
      name: "Mars",
      sanskritName: "Mangal",
      symbol: "♂",
      category: "Inner Planet",
      currentSign: "Leo",
      currentHouse: "1st House",
      strength: 68,
      nature: "Malefic",
      description: "Mars activates courage, speed, competition, protection, discipline, and decisive action.",
      positiveEffects: ["Motivation", "Physical drive", "Courage"],
      negativeEffects: ["Conflict", "Burnout", "Impulsive risk"],
      bestActivities: ["Exercise", "Launch tasks", "Defend priorities"],
      avoidActivities: ["Arguments", "Speeding", "Unplanned expenses"],
      luckyColor: "Red",
      luckyNumber: 9,
      chakra: "Root",
      gemstone: "Red Coral",
      deity: "Hanuman",
      impacts: buildImpacts("Mars", "action and disciplined courage", "Om Kram Kreem Kraum Sah Bhaumaya Namah", "Red Coral"),
      details: {
        origin: "Mangal is associated with warrior force, land, siblings, protection, fire, and disciplined strength.",
        vedicSignificance: "Mars indicates courage, property, engineering, blood, competition, and conflict management.",
        westernSignificance: "Western astrology sees Mars as desire, assertion, libido, survival drive, and anger style.",
        strengthAnalysis: "Strong Mars provides stamina, leadership under pressure, technical ability, and brave execution.",
        weaknessAnalysis: "Weak Mars can manifest as fear, irritation, accidents, inflammation, or scattered aggression.",
        friendships: ["Sun", "Moon", "Jupiter"],
        enemies: ["Mercury"],
        zodiacSigns: ["Aries", "Scorpio"],
        exaltationSign: "Capricorn",
        debilitationSign: "Cancer",
        moolTrikona: "Aries",
        nakshatraInfluence: "Mrigashira, Chitra, and Dhanishta bring pursuit, craft, and rhythmic power.",
        houseEffects: houseEffectsFor("Mars", "action, courage, and boundaries"),
        transitEffects: "Mars transits heat up the house they cross, demanding movement and careful conflict handling.",
        retrogradeEffects: "Retrograde Mars redirects anger inward and asks for strategy before action.",
        conjunctionEffects: "Mars conjunctions energize planets but can make their themes urgent or volatile.",
        aspectEffects: "Mars aspects provoke action, defense, competition, and decisive correction.",
      },
    },
    {
      id: "jupiter",
      name: "Jupiter",
      sanskritName: "Guru",
      symbol: "♃",
      category: "Outer Classical Planet",
      currentSign: "Gemini",
      currentHouse: "9th House",
      strength: 82,
      nature: "Benefic",
      description: "Jupiter expands wisdom, faith, teaching, prosperity, children, law, and long-range optimism.",
      positiveEffects: ["Opportunity", "Wisdom", "Mentor support"],
      negativeEffects: ["Overpromising", "Excess", "Moral certainty"],
      bestActivities: ["Study scripture", "Teach", "Plan long-term growth"],
      avoidActivities: ["Taking too much on", "Ignoring details", "Preaching"],
      luckyColor: "Saffron",
      luckyNumber: 3,
      chakra: "Crown",
      gemstone: "Yellow Sapphire",
      deity: "Brihaspati",
      impacts: buildImpacts("Jupiter", "wisdom and expansion", "Om Gram Greem Graum Sah Gurave Namah", "Yellow Sapphire"),
      details: {
        origin: "Guru is the divine teacher, guardian of wisdom, ethics, blessings, and sacred counsel.",
        vedicSignificance: "Jupiter rules dharma, children, teachers, wealth, grace, learning, and protection.",
        westernSignificance: "Western astrology associates Jupiter with growth, belief, luck, travel, law, and abundance.",
        strengthAnalysis: "Strong Jupiter gives optimism, guidance, generosity, education, protection, and wise expansion.",
        weaknessAnalysis: "Weak Jupiter may show poor judgment, weak faith, excess, or difficulty receiving guidance.",
        friendships: ["Sun", "Moon", "Mars"],
        enemies: ["Mercury", "Venus"],
        zodiacSigns: ["Sagittarius", "Pisces"],
        exaltationSign: "Cancer",
        debilitationSign: "Capricorn",
        moolTrikona: "Sagittarius",
        nakshatraInfluence: "Punarvasu, Vishakha, and Purva Bhadrapada grow wisdom through return, purpose, and depth.",
        houseEffects: houseEffectsFor("Jupiter", "wisdom, growth, and blessing"),
        transitEffects: "Jupiter transits open long-range opportunities and lessons around faith and maturity.",
        retrogradeEffects: "Retrograde Jupiter internalizes learning and revisits belief, ethics, and unfinished education.",
        conjunctionEffects: "Jupiter conjunctions expand planets and can protect or exaggerate their expressions.",
        aspectEffects: "Jupiter aspects bless, teach, widen perspective, and encourage ethical growth.",
      },
    },
    {
      id: "saturn",
      name: "Saturn",
      sanskritName: "Shani",
      symbol: "♄",
      category: "Outer Classical Planet",
      currentSign: "Pisces",
      currentHouse: "8th House",
      strength: 64,
      nature: "Malefic",
      description: "Saturn teaches patience, karma, structure, responsibility, delay, endurance, and mastery.",
      positiveEffects: ["Discipline", "Long-term stability", "Maturity"],
      negativeEffects: ["Delay", "Fear", "Heaviness"],
      bestActivities: ["Budget", "Finish pending work", "Set boundaries"],
      avoidActivities: ["Shortcuts", "Neglecting elders", "Avoiding accountability"],
      luckyColor: "Indigo",
      luckyNumber: 8,
      chakra: "Root",
      gemstone: "Blue Sapphire",
      deity: "Shani Dev",
      impacts: buildImpacts("Saturn", "discipline and karmic correction", "Om Pram Preem Praum Sah Shanaischaraya Namah", "Blue Sapphire"),
      details: {
        origin: "Shani is the slow teacher of karma, justice, humility, endurance, and time-tested results.",
        vedicSignificance: "Saturn rules labor, aging, poverty, service, discipline, fear, and eventual mastery.",
        westernSignificance: "Western astrology treats Saturn as boundaries, structure, responsibility, authority, and lessons.",
        strengthAnalysis: "Strong Saturn grants patience, realism, endurance, organization, and respect for duty.",
        weaknessAnalysis: "Weak Saturn may bring fear, delay, isolation, chronic pressure, or avoidance of responsibility.",
        friendships: ["Mercury", "Venus"],
        enemies: ["Sun", "Moon", "Mars"],
        zodiacSigns: ["Capricorn", "Aquarius"],
        exaltationSign: "Libra",
        debilitationSign: "Aries",
        moolTrikona: "Aquarius",
        nakshatraInfluence: "Pushya, Anuradha, and Uttara Bhadrapada deepen devotion, loyalty, and spiritual endurance.",
        houseEffects: houseEffectsFor("Saturn", "discipline, karma, and structure"),
        transitEffects: "Saturn transits demand maturity in the life area they touch and reward patient effort.",
        retrogradeEffects: "Retrograde Saturn rechecks commitments, boundaries, karmic lessons, and delayed duties.",
        conjunctionEffects: "Saturn conjunctions cool, slow, stabilize, and test the planet involved.",
        aspectEffects: "Saturn aspects require accountability, careful pacing, and durable structure.",
      },
    },
    {
      id: "uranus",
      name: "Uranus",
      sanskritName: "Aruna",
      symbol: "♅",
      category: "Modern Planet",
      currentSign: "Taurus",
      currentHouse: "6th House",
      strength: 59,
      nature: "Neutral",
      description: "Uranus introduces innovation, disruption, awakening, independence, and unusual breakthroughs.",
      positiveEffects: ["Innovation", "Freedom", "Fresh solutions"],
      negativeEffects: ["Instability", "Rebellion", "Sudden changes"],
      bestActivities: ["Upgrade systems", "Experiment", "Solve technical issues"],
      avoidActivities: ["Rigid plans", "Reactivity", "Needless disruption"],
      luckyColor: "Electric Blue",
      luckyNumber: 4,
      chakra: "Third Eye",
      gemstone: "Labradorite",
      deity: "Varuna",
      impacts: buildImpacts("Uranus", "innovation and awakening", "Om Vam Varunaya Namah", "Labradorite"),
      details: {
        origin: "Modern astrology links Uranus with sky-force, rebellion, invention, and sudden liberation.",
        vedicSignificance: "Used by many modern Vedic practitioners as a marker of unconventional change and social rupture.",
        westernSignificance: "Uranus signifies awakening, originality, technology, disruption, and liberation from stale patterns.",
        strengthAnalysis: "Strong Uranus brings inventiveness, independence, technical insight, and courage to change.",
        weaknessAnalysis: "Weak Uranus can produce nervous volatility, contrarian behavior, or chaos without integration.",
        friendships: ["Mercury", "Saturn"],
        enemies: ["Moon"],
        zodiacSigns: ["Aquarius"],
        exaltationSign: "Scorpio",
        debilitationSign: "Taurus",
        moolTrikona: "Aquarius",
        nakshatraInfluence: "Shatabhisha themes are often used for Uranian healing, networks, and unconventional research.",
        houseEffects: houseEffectsFor("Uranus", "innovation and independence"),
        transitEffects: "Uranus transits shake routines and reveal where freedom has become necessary.",
        retrogradeEffects: "Retrograde Uranus internalizes rebellion and awakens private truth before outer change.",
        conjunctionEffects: "Uranus conjunctions electrify planets and can produce sudden reversals or breakthroughs.",
        aspectEffects: "Uranus aspects disrupt, liberate, modernize, and demand flexibility.",
      },
    },
    {
      id: "neptune",
      name: "Neptune",
      sanskritName: "Varuna",
      symbol: "♆",
      category: "Modern Planet",
      currentSign: "Aries",
      currentHouse: "12th House",
      strength: 55,
      nature: "Neutral",
      description: "Neptune dissolves boundaries, heightens dreams, compassion, imagination, devotion, and mystery.",
      positiveEffects: ["Compassion", "Vision", "Mystical sensitivity"],
      negativeEffects: ["Confusion", "Escapism", "Unclear promises"],
      bestActivities: ["Meditate", "Create music", "Serve quietly"],
      avoidActivities: ["Vague agreements", "Avoiding facts", "Over-idealizing"],
      luckyColor: "Sea Green",
      luckyNumber: 7,
      chakra: "Crown",
      gemstone: "Aquamarine",
      deity: "Narayana",
      impacts: buildImpacts("Neptune", "imagination and spiritual surrender", "Om Namo Narayanaya", "Aquamarine"),
      details: {
        origin: "Neptune is associated with oceanic consciousness, dreams, devotion, illusion, and transcendence.",
        vedicSignificance: "Modern Vedic usage treats Neptune as subtle intuition, maya, collective longing, and spiritual fog.",
        westernSignificance: "Western astrology reads Neptune as dreams, mysticism, compassion, glamour, and dissolution.",
        strengthAnalysis: "Strong Neptune supports vision, empathy, artistic flow, devotion, and deep symbolic perception.",
        weaknessAnalysis: "Weak Neptune can bring confusion, avoidance, porous boundaries, or misplaced trust.",
        friendships: ["Moon", "Venus", "Jupiter"],
        enemies: ["Mars", "Saturn"],
        zodiacSigns: ["Pisces"],
        exaltationSign: "Leo",
        debilitationSign: "Aquarius",
        moolTrikona: "Pisces",
        nakshatraInfluence: "Revati and Purva Bhadrapada themes support surrender, endings, and sacred imagination.",
        houseEffects: houseEffectsFor("Neptune", "dreams, compassion, and surrender"),
        transitEffects: "Neptune transits dissolve certainty and invite faith, creativity, and better boundaries.",
        retrogradeEffects: "Retrograde Neptune strips illusions internally and clarifies spiritual longing.",
        conjunctionEffects: "Neptune conjunctions soften planets, increasing inspiration but lowering certainty.",
        aspectEffects: "Neptune aspects sensitize, spiritualize, blur, and ask for discernment.",
      },
    },
    {
      id: "pluto",
      name: "Pluto",
      sanskritName: "Yama",
      symbol: "♇",
      category: "Modern Planet",
      currentSign: "Aquarius",
      currentHouse: "7th House",
      strength: 61,
      nature: "Malefic",
      description: "Pluto reveals transformation, power, endings, shadow work, regeneration, and deep truth.",
      positiveEffects: ["Transformation", "Truth", "Resilience"],
      negativeEffects: ["Control issues", "Obsession", "Power struggles"],
      bestActivities: ["Therapy", "Declutter", "Research deeply"],
      avoidActivities: ["Manipulation", "Fixating", "Forcing outcomes"],
      luckyColor: "Burgundy",
      luckyNumber: 0,
      chakra: "Root",
      gemstone: "Black Tourmaline",
      deity: "Yama",
      impacts: buildImpacts("Pluto", "transformation and hidden power", "Om Yamaya Namah", "Black Tourmaline"),
      details: {
        origin: "Pluto is linked with underworld symbolism, death-rebirth cycles, hidden wealth, and irreversible truth.",
        vedicSignificance: "Modern Vedic practitioners may use Pluto for collective karma, deep purification, and shadow themes.",
        westernSignificance: "Western astrology reads Pluto as power, compulsion, transformation, trauma, and regeneration.",
        strengthAnalysis: "Strong Pluto provides psychological courage, strategic depth, resilience, and transformative focus.",
        weaknessAnalysis: "Weak Pluto can show fear of loss, control patterns, secrecy, or crisis-driven choices.",
        friendships: ["Mars", "Saturn"],
        enemies: ["Venus", "Moon"],
        zodiacSigns: ["Scorpio"],
        exaltationSign: "Aries",
        debilitationSign: "Libra",
        moolTrikona: "Scorpio",
        nakshatraInfluence: "Mula themes echo Plutonian uprooting, truth-seeking, and karmic excavation.",
        houseEffects: houseEffectsFor("Pluto", "transformation and power"),
        transitEffects: "Pluto transits slowly transform identity, attachments, and power dynamics in the affected house.",
        retrogradeEffects: "Retrograde Pluto intensifies inner shadow work and releases buried control patterns.",
        conjunctionEffects: "Pluto conjunctions deepen, intensify, and transform the planet involved.",
        aspectEffects: "Pluto aspects expose buried material and demand honest regeneration.",
      },
    },
  ] satisfies PlanetConfig[],
  transits: [
    ["sun-gemini-cancer", "Sun", "Gemini", "Cancer", "2026-06-21", "08:18", "positive"],
    ["mercury-cancer-leo", "Mercury", "Cancer", "Leo", "2026-06-26", "17:44", "neutral"],
    ["venus-taurus-gemini", "Venus", "Taurus", "Gemini", "2026-06-29", "10:12", "positive"],
    ["mars-leo-virgo", "Mars", "Leo", "Virgo", "2026-07-04", "22:05", "challenging"],
    ["jupiter-gemini-cancer", "Jupiter", "Gemini", "Cancer", "2026-07-09", "06:36", "positive"],
  ].map(([id, planet, fromSign, toSign, date, time, impactLevel], index) => ({
    id,
    planet,
    fromSign,
    toSign,
    date,
    time,
    impactLevel,
    categories: Object.fromEntries(
      impactLabels.map((label, labelIndex) => [
        label,
        (labelIndex + index) % 3 === 0 ? "positive" : (labelIndex + index) % 3 === 1 ? "neutral" : "challenging",
      ])
    ),
  })) as TransitConfig[],
  aspects: [
    {
      id: "conjunction",
      name: "Conjunction",
      angle: "0°",
      definition: "Two planets occupy the same zodiac zone and blend their forces.",
      meaning: "Intense focus, amplified themes, and new beginnings around shared planetary meaning.",
      strength: 88,
      positiveEffects: ["Clarity of focus", "Fast manifestation", "Unified intent"],
      challenges: ["Over-identification", "Intensity", "Blind spots"],
      bestPractices: ["Choose one priority", "Pause before reacting", "Track repeating signals"],
    },
    {
      id: "sextile",
      name: "Sextile",
      angle: "60°",
      definition: "Planets cooperate through compatible elements and practical opportunity.",
      meaning: "Supportive openings arrive when action is taken consciously.",
      strength: 62,
      positiveEffects: ["Ease", "Useful contacts", "Skill development"],
      challenges: ["Missing the opening", "Comfort zone", "Low urgency"],
      bestPractices: ["Act on invitations", "Practice the skill", "Say yes selectively"],
    },
    {
      id: "square",
      name: "Square",
      angle: "90°",
      definition: "Planets press against each other and create friction that demands growth.",
      meaning: "A constructive challenge that reveals where effort, courage, and correction are needed.",
      strength: 79,
      positiveEffects: ["Motivation", "Problem solving", "Breakthrough pressure"],
      challenges: ["Conflict", "Stress", "Forced decisions"],
      bestPractices: ["Move slowly", "Name the tension", "Use clear boundaries"],
    },
    {
      id: "trine",
      name: "Trine",
      angle: "120°",
      definition: "Planets flow through harmonious elements and naturally support each other.",
      meaning: "Grace, talent, ease, and protection become easier to access.",
      strength: 84,
      positiveEffects: ["Flow", "Confidence", "Supportive timing"],
      challenges: ["Complacency", "Assumption", "Passive waiting"],
      bestPractices: ["Use the momentum", "Share the benefit", "Keep discipline alive"],
    },
    {
      id: "opposition",
      name: "Opposition",
      angle: "180°",
      definition: "Planets face each other across the zodiac and seek balance through awareness.",
      meaning: "Relationship mirrors, polarities, and external feedback become important teachers.",
      strength: 76,
      positiveEffects: ["Perspective", "Negotiation", "Awareness"],
      challenges: ["Projection", "Push-pull dynamics", "Decision fatigue"],
      bestPractices: ["Listen first", "Balance extremes", "Clarify shared expectations"],
    },
  ] satisfies AspectConfig[],
  events: [
    "New Moon",
    "Full Moon",
    "Solar Eclipse",
    "Lunar Eclipse",
    "Mercury Retrograde",
    "Venus Retrograde",
    "Mars Retrograde",
    "Saturn Retrograde",
  ].map((name, index) => ({
    id: name.toLowerCase().replaceAll(" ", "-"),
    name,
    description: `${name} opens a focused window for reflection, adjustment, and conscious timing.`,
    duration: index < 2 ? "1-2 days peak influence" : index < 4 ? "2-6 weeks influence" : "Several weeks of review",
    globalInfluence: "Collective mood, markets, leadership tone, and social narratives may shift noticeably.",
    personalInfluence: "Personal charts feel this most strongly where natal planets or angles are contacted.",
    recommendedActivities: ["Reflect", "Review priorities", "Practice patience"],
    activitiesToAvoid: ["Rushing commitments", "Ignoring intuition", "Escalating conflict"],
    spiritualPractices: ["Mantra japa", "Lamp lighting", "Journaling"],
    remedies: ["Donate mindfully", "Keep routine simple", "Offer gratitude"],
  })) satisfies EventConfig[],
  energyScores: [
    ["Sun", 86, "up", "+8 from yesterday"],
    ["Moon", 78, "steady", "same as yesterday"],
    ["Mercury", 72, "down", "-4 from yesterday"],
    ["Venus", 90, "up", "+6 from yesterday"],
    ["Mars", 68, "down", "-7 from yesterday"],
    ["Jupiter", 82, "up", "+3 from yesterday"],
    ["Saturn", 64, "steady", "+1 from yesterday"],
  ].map(([planet, score, trend, comparison]) => ({ planet, score, trend, comparison })) as EnergyScore[],
  lifeAreas: [
    "Career",
    "Love",
    "Marriage",
    "Finance",
    "Health",
    "Education",
    "Business",
    "Spirituality",
  ].map((label) => ({
    id: label.toLowerCase(),
    label,
    positiveInfluence: `${label} benefits from calm timing, wise communication, and using the strongest planet of the day with discipline.`,
    negativeInfluence: `Pressure may appear when expectations move faster than preparation or emotional clarity.`,
    currentTrends: `Current planetary patterns favor thoughtful review, mature choices, and practical rituals for ${label.toLowerCase()}.`,
    recommendedActions: ["Pick one priority", "Avoid reactive promises", "Review timing before big moves"],
    remedies: ["Short mantra practice", "Charity aligned with the day", "Simple breathwork"],
  })) satisfies LifeAreaConfig[],
  remedies: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"].map((planet) => ({
    planet,
    mantras: [`Daily ${planet} bija mantra`, `${planet} gratitude affirmation`],
    pujaSuggestions: [`Offer a clean lamp for ${planet}`, "Keep the altar uncluttered"],
    fastingRecommendations: `Choose a gentle fast or sattvic meal on the weekday associated with ${planet}, if suitable for your health.`,
    charityRecommendations: ["Donate food", "Support students or elders", "Offer service without display"],
    gemstones: [planet === "Sun" ? "Ruby" : planet === "Moon" ? "Pearl" : planet === "Saturn" ? "Blue Sapphire" : "Chart-specific gemstone"],
    colors: [planet === "Mars" ? "Red" : planet === "Venus" ? "White" : "Planetary color"],
    meditationPractices: ["Nine-minute breath meditation", "Visualize the planet's light at its chakra"],
    yantras: [`${planet} yantra`, "Navagraha yantra"],
  })) satisfies RemedyConfig[],
  combinations: [
    ["Sun + Moon", "Conscious will meets emotional instinct"],
    ["Sun + Jupiter", "Leadership expands through wisdom"],
    ["Moon + Venus", "Affection, beauty, and emotional sweetness"],
    ["Mars + Saturn", "Pressure, discipline, and controlled force"],
    ["Jupiter + Venus", "Grace, learning, wealth, and generosity"],
    ["Mercury + Jupiter", "Knowledge, teaching, counsel, and strategy"],
  ].map(([pair, meaning]) => ({
    pair,
    meaning,
    effects: `${pair} creates a blended field that can become powerful when the faster impulse respects the slower lesson.`,
    strengths: ["Focused growth", "Clearer timing", "Useful self-awareness"],
    weaknesses: ["Excess", "Mixed priorities", "Unintegrated pressure"],
    careerImpact: "Career improves through intentional planning, mentorship, and avoiding scattered execution.",
    relationshipImpact: "Relationships benefit from naming needs, balancing pace, and choosing repair over pride.",
  })) satisfies CombinationConfig[],
  calendar: Array.from({ length: 12 }, (_, index) => {
    const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
    const types = ["Movement", "Retrograde", "Eclipse", "Special Yoga"] as const;
    const tone = ["positive", "neutral", "challenging"][index % 3] as ImpactTone;
    return {
      id: `cosmic-event-${index + 1}`,
      date: `2026-07-${String(index + 1).padStart(2, "0")}`,
      planet: planets[index % planets.length],
      type: types[index % types.length],
      title: `${planets[index % planets.length]} ${types[index % types.length]}`,
      summary: "A practical timing note for planning, reflection, and balanced action.",
      impactLevel: tone,
    };
  }) satisfies CosmicCalendarItem[],
  faqs: [
    "What are planetary transits?",
    "How do planets affect life?",
    "What is retrograde motion?",
    "Which planet controls career?",
    "Which planet controls marriage?",
    "How can remedies help?",
    "Which planet rules wealth?",
    "What is planetary strength?",
    "Are malefic planets always bad?",
    "How often do transits change?",
    "What is a conjunction?",
    "What is a trine?",
    "Why do eclipses matter?",
    "Can gemstones change results?",
    "What is Mool Trikona?",
    "What are exalted planets?",
    "What are debilitated planets?",
    "How do houses affect interpretation?",
    "Do Western and Vedic systems differ?",
    "How should I use daily highlights?",
  ].map((question) => ({
    question,
    answer:
      "Planetary guidance is best used as reflective timing support. Combine it with your chart, practical judgment, and professional advice for important decisions.",
  })),
};

export async function fetchPlanetaryHighlightsConfig() {
  return planetaryHighlightsConfig;
}
