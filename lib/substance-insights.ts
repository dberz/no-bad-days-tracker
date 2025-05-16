// Define the insight type
interface SubstanceInsight {
  tip: string
  category: string
}

// Database of substance-specific insights
const insightsDatabase: Record<string, SubstanceInsight[]> = {
  alcohol: [
    {
      tip: "Drinking water between alcoholic drinks can help prevent dehydration and reduce hangover symptoms.",
      category: "harm-reduction",
    },
    {
      tip: "Eating before drinking slows alcohol absorption and helps protect your stomach lining.",
      category: "harm-reduction",
    },
    {
      tip: "Taking B vitamins before drinking and the morning after may help reduce hangover symptoms.",
      category: "supplement",
    },
    {
      tip: "NAC (N-Acetyl Cysteine) taken before drinking may help protect your liver from alcohol damage.",
      category: "supplement",
    },
    {
      tip: "Alcohol affects your sleep quality even if it makes you feel drowsy initially.",
      category: "education",
    },
  ],
  cannabis: [
    {
      tip: "CBD can help reduce anxiety that sometimes occurs with THC use.",
      category: "harm-reduction",
    },
    {
      tip: "Vaporizing cannabis instead of smoking may reduce respiratory risks.",
      category: "harm-reduction",
    },
    {
      tip: "Start with a low dose of edibles (5-10mg) and wait at least 2 hours before taking more.",
      category: "harm-reduction",
    },
    {
      tip: "Black pepper contains terpenes that may help reduce THC-induced anxiety.",
      category: "supplement",
    },
    {
      tip: "Regular cannabis use can affect REM sleep and dream recall.",
      category: "education",
    },
  ],
  psychedelics: {
    lsd: [
      {
        tip: "Set and setting are crucial for a positive psychedelic experience.",
        category: "harm-reduction",
      },
      {
        tip: "Having a trusted, sober trip sitter can help navigate challenging experiences.",
        category: "harm-reduction",
      },
      {
        tip: "Magnesium supplements may help reduce muscle tension during LSD experiences.",
        category: "supplement",
      },
      {
        tip: "LSD effects typically last 8-12 hours, so plan your day accordingly.",
        category: "education",
      },
    ],
    psilocybin: [
      {
        tip: "Ginger tea can help reduce nausea sometimes associated with psilocybin.",
        category: "harm-reduction",
      },
      {
        tip: "Grinding mushrooms into a powder and making tea can reduce digestive discomfort.",
        category: "harm-reduction",
      },
      {
        tip: "Lion's Mane mushroom supplements may have synergistic effects with psilocybin.",
        category: "supplement",
      },
      {
        tip: "Psilocybin effects typically last 4-6 hours, with after-effects for several hours more.",
        category: "education",
      },
    ],
    ketamine: [
      {
        tip: "Stay hydrated but don't drink excessive amounts of water with ketamine.",
        category: "harm-reduction",
      },
      {
        tip: "Avoid combining ketamine with alcohol or other depressants.",
        category: "harm-reduction",
      },
      {
        tip: "Green tea extract may help protect against some of ketamine's negative effects.",
        category: "supplement",
      },
      {
        tip: "Regular ketamine use can lead to bladder and urinary tract issues.",
        category: "education",
      },
    ],
    mdma: [
      {
        tip: "Stay hydrated but don't drink excessive amounts of water with MDMA.",
        category: "harm-reduction",
      },
      {
        tip: "Take regular breaks when dancing to prevent overheating.",
        category: "harm-reduction",
      },
      {
        tip: "5-HTP supplements taken a day AFTER MDMA use (never before or during) may help with recovery.",
        category: "supplement",
      },
      {
        tip: "MDMA depletes serotonin, which can lead to low mood for days after use.",
        category: "education",
      },
    ],
  },
  stimulants: {
    caffeine: [
      {
        tip: "L-Theanine (found in green tea) can reduce jitters from caffeine.",
        category: "supplement",
      },
      {
        tip: "Avoid caffeine at least 6 hours before bedtime to prevent sleep disruption.",
        category: "harm-reduction",
      },
      {
        tip: "Stay hydrated as caffeine has a mild diuretic effect.",
        category: "harm-reduction",
      },
      {
        tip: "Caffeine tolerance develops quickly, and withdrawal can cause headaches.",
        category: "education",
      },
    ],
    nicotine: [
      {
        tip: "Nicotine gum or patches are less harmful than smoking or vaping.",
        category: "harm-reduction",
      },
      {
        tip: "NAC supplements may help reduce cravings for nicotine.",
        category: "supplement",
      },
      {
        tip: "Nicotine withdrawal peaks within 1-3 days and gradually subsides over 2-4 weeks.",
        category: "education",
      },
    ],
    cocaine: [
      {
        tip: "Stay hydrated and take breaks to prevent overheating.",
        category: "harm-reduction",
      },
      {
        tip: "Magnesium supplements may help reduce jaw clenching.",
        category: "supplement",
      },
      {
        tip: "Cocaine can cause significant cardiovascular stress even in healthy individuals.",
        category: "education",
      },
    ],
    prescription: [
      {
        tip: "Take as prescribed and avoid crushing or snorting pills.",
        category: "harm-reduction",
      },
      {
        tip: "Magnesium supplements may help reduce tolerance development.",
        category: "supplement",
      },
      {
        tip: "Stimulant medications can suppress appetite, so plan nutritious meals.",
        category: "education",
      },
    ],
  },
}

// Function to get random insights for a specific substance
export function getSubstanceInsights(
  substanceType: string,
  substanceSubtype: string | undefined,
  count = 3,
): SubstanceInsight[] {
  let insights: SubstanceInsight[] = []

  // Convert to lowercase for consistency
  const type = substanceType.toLowerCase()
  const subtype = substanceSubtype?.toLowerCase()

  // Get insights based on substance type and subtype
  if (type === "psychedelics" || type === "stimulants") {
    // These categories have subtypes
    if (subtype && insightsDatabase[type][subtype]) {
      insights = [...insightsDatabase[type][subtype]]
    } else {
      // If subtype not found, get general insights for the type
      const allSubtypeInsights = Object.values(insightsDatabase[type]).flat()
      insights = allSubtypeInsights
    }
  } else if (insightsDatabase[type]) {
    // Direct access for types without subtypes
    insights = [...insightsDatabase[type]]
  }

  // If no specific insights found, return general harm reduction tips
  if (insights.length === 0) {
    return [
      {
        tip: "Stay hydrated when using any substance.",
        category: "harm-reduction",
      },
      {
        tip: "Always start with a lower dose, especially with new substances.",
        category: "harm-reduction",
      },
      {
        tip: "Have a trusted friend present when trying new substances.",
        category: "harm-reduction",
      },
    ]
  }

  // Shuffle the insights
  insights = insights.sort(() => Math.random() - 0.5)

  // Return the requested number of insights
  return insights.slice(0, count)
}

// Function to get random tips for a substance
export function getRandomTips(substance: string, count = 3): string[] {
  const tips = [
    "Stay hydrated when using any substance.",
    "Always start with a lower dose, especially with new substances.",
    "Have a trusted friend present when trying new substances.",
    "Wait at least 1-3 months between MDMA sessions to allow your brain to recover.",
    "Test your substances with reagent kits when possible.",
    "Avoid mixing different substances, especially depressants.",
    "Create a comfortable environment before using psychedelics.",
    "Plan your transportation in advance if you'll be drinking.",
    "Set limits for yourself before you start using any substance.",
    "Keep track of your usage patterns to maintain awareness.",
  ]

  // Shuffle the tips
  const shuffledTips = [...tips].sort(() => Math.random() - 0.5)

  // Return the requested number of tips
  return shuffledTips.slice(0, count)
}
