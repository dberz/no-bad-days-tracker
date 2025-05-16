export const SUBSTANCE_HARM_POINTS = {
  // Alcohol
  beer: 3, // per 12oz drink
  wine: 3, // per 5oz drink
  liquor: 3, // per 1.5oz drink

  // Cannabis
  cannabis_smoked: 0.5, // per puff
  cannabis_edible: 0.2, // per mg (2 points per 10mg)

  // Psychedelics
  lsd: 2, // per moderate dose
  psilocybin: 2, // per moderate dose
  ketamine: 0.1, // per mg (5 points per 50mg)
  mdma: 0.12, // per mg (6 points per 50mg)

  // Stimulants
  nicotine: 1, // per cigarette
  caffeine: 0.0025, // per mg (0.25 points per 100mg/coffee)
  prescription_stimulant: 3, // per standard dose
  cocaine: 0.14, // per mg (7 points per 50mg/line)
}

// Context multipliers
export const CONTEXT_MULTIPLIERS = {
  "social-party": 1.2, // Social Party / Large Event
  solo: 1.5, // Solo (stress, boredom)
  therapeutic: 0.7, // Therapeutic/medical
  "social-small": 1.0, // Small social gathering
  work: 1.1, // Work context (added)
  other: 1.0, // Default
}

// Risk multipliers
export const RISK_MULTIPLIERS = {
  age_18_25: 1.3, // Young adult
  age_over_65: 1.3, // Older adult
  female_alcohol_mdma: 1.2, // Female with alcohol or MDMA
  cardiovascular: 1.5, // Cardiovascular issues
  liver: 1.5, // Liver issues
  kidney: 1.5, // Kidney issues
  anxiety: 1.7, // Anxiety
  depression: 1.7, // Depression
  bipolar: 1.7, // Bipolar
  multiple_substances: 1.5, // Multiple substances at once
}

// Half-life of harm in days for each substance
export const SUBSTANCE_HALF_LIVES = {
  alcohol: 2,
  cannabis: 3,
  mdma: 5,
  lsd: 4,
  psilocybin: 4,
  ketamine: 3,
  nicotine: 2,
  prescription_stimulant: 3,
  caffeine: 1,
  cocaine: 2,
  default: 3, // Default for substances not listed
}

// Positive interventions harm reduction
export const INTERVENTION_REDUCTION = {
  sleep: 3, // 7-9 hrs/night
  exercise: 2, // >30 min moderate
  mindfulness: 1.5, // >10 min session
  hydration: 1, // >64 oz/day
  nutrition: 1, // Balanced meals
  abstinence: 4, // 24 hrs no use
  social_connection: 1, // Positive interaction
  therapy: 2.5, // Per session
  recovery: 1.5, // Sauna, massage, etc.
}

// Calculate decay constant (lambda) from half-life
export function calculateLambda(halfLifeDays: number): number {
  return Math.log(2) / halfLifeDays
}

// Calculate harm decay over time
export function calculateHarmDecay(initialHarm: number, halfLifeDays: number, daysPassed: number): number {
  const lambda = calculateLambda(halfLifeDays)
  return initialHarm * Math.exp(-lambda * daysPassed)
}

// Calculate harm points for a substance log
export function calculateSubstanceHarmPoints(
  substanceType: string,
  substanceSubtype: string | null,
  amount: number | string,
  context: string,
  riskMultiplier = 1.0,
  multipleSubstances = false,
): number {
  // Determine base harm points per unit
  let basePoints = 0
  const amountNum = typeof amount === "string" ? Number.parseFloat(amount) || 1 : amount

  if (substanceType === "alcohol") {
    basePoints = SUBSTANCE_HARM_POINTS.beer // All alcohol types use same base points
  } else if (substanceType === "cannabis") {
    if (substanceSubtype === "edible") {
      basePoints = SUBSTANCE_HARM_POINTS.cannabis_edible
    } else {
      basePoints = SUBSTANCE_HARM_POINTS.cannabis_smoked
    }
  } else if (substanceType === "psychedelics") {
    if (substanceSubtype === "ketamine") {
      basePoints = SUBSTANCE_HARM_POINTS.ketamine
    } else if (substanceSubtype === "lsd") {
      basePoints = SUBSTANCE_HARM_POINTS.lsd
    } else if (substanceSubtype === "psilocybin") {
      basePoints = SUBSTANCE_HARM_POINTS.psilocybin
    } else if (substanceSubtype === "mdma") {
      basePoints = SUBSTANCE_HARM_POINTS.mdma
    } else {
      basePoints = SUBSTANCE_HARM_POINTS.lsd // Default to LSD if subtype not specified
    }
  } else if (substanceType === "stimulants") {
    if (substanceSubtype === "nicotine") {
      basePoints = SUBSTANCE_HARM_POINTS.nicotine
    } else if (substanceSubtype === "caffeine") {
      basePoints = SUBSTANCE_HARM_POINTS.caffeine
    } else if (substanceSubtype === "prescription") {
      basePoints = SUBSTANCE_HARM_POINTS.prescription_stimulant
    } else if (substanceSubtype === "cocaine") {
      basePoints = SUBSTANCE_HARM_POINTS.cocaine
    } else {
      basePoints = SUBSTANCE_HARM_POINTS.caffeine // Default to caffeine if subtype not specified
    }
  } else {
    // Default for custom substances
    basePoints = 1
  }

  // Apply context multiplier
  const contextMultiplier = CONTEXT_MULTIPLIERS[context as keyof typeof CONTEXT_MULTIPLIERS] || 1.0

  let harmPoints = basePoints * amountNum * contextMultiplier

  // Apply risk multiplier
  harmPoints *= riskMultiplier

  // Apply multiple substances multiplier
  if (multipleSubstances) {
    harmPoints *= RISK_MULTIPLIERS.multiple_substances
  }

  return Number(harmPoints.toFixed(2))
}

// Add the calculateHarmPoints function as an alias to calculateSubstanceHarmPoints
// This ensures backward compatibility with existing code
export function calculateHarmPoints(
  substanceType: string,
  substanceSubtype: string | undefined,
  quantity: number,
  context: string,
  userRiskMultiplier = 1.0,
  multipleSubstances = false,
): number {
  return calculateSubstanceHarmPoints(
    substanceType,
    substanceSubtype || null,
    quantity,
    context,
    userRiskMultiplier,
    multipleSubstances,
  )
}

// Calculate intervention reduction points
export function calculateInterventionReduction(
  interventionType: string,
  duration: number | undefined,
  quantity: number | undefined,
): number {
  switch (interventionType) {
    case "sleep":
      // Assuming duration is in hours
      if (duration && duration >= 7 && duration <= 9) {
        return INTERVENTION_REDUCTION.sleep
      } else if (duration && duration >= 6) {
        return INTERVENTION_REDUCTION.sleep * 0.7 // Partial benefit
      }
      return 0

    case "exercise":
      // Assuming duration is in minutes
      if (duration && duration >= 30) {
        return INTERVENTION_REDUCTION.exercise
      } else if (duration && duration >= 15) {
        return INTERVENTION_REDUCTION.exercise * 0.5 // Partial benefit
      }
      return 0

    case "mindfulness":
      // Assuming duration is in minutes
      if (duration && duration >= 10) {
        return INTERVENTION_REDUCTION.mindfulness
      } else if (duration && duration >= 5) {
        return INTERVENTION_REDUCTION.mindfulness * 0.5 // Partial benefit
      }
      return 0

    case "hydration":
      // Assuming quantity is in oz
      if (quantity && quantity >= 64) {
        return INTERVENTION_REDUCTION.hydration
      } else if (quantity && quantity >= 32) {
        return INTERVENTION_REDUCTION.hydration * 0.5 // Partial benefit
      }
      return 0

    case "nutrition":
      return INTERVENTION_REDUCTION.nutrition

    case "abstinence":
      // Assuming duration is in days
      if (duration) {
        return INTERVENTION_REDUCTION.abstinence * duration
      }
      return 0

    case "social_connection":
      return INTERVENTION_REDUCTION.social_connection

    case "therapy":
      return INTERVENTION_REDUCTION.therapy

    case "recovery":
      return INTERVENTION_REDUCTION.recovery

    default:
      return 0
  }
}

// Get half-life for a substance
export function getSubstanceHalfLife(substanceType: string): number {
  const type = substanceType.toLowerCase()
  if (type === "alcohol") {
    return SUBSTANCE_HALF_LIVES.alcohol
  } else if (type === "cannabis") {
    return SUBSTANCE_HALF_LIVES.cannabis
  } else if (type === "mdma") {
    return SUBSTANCE_HALF_LIVES.mdma
  } else if (type === "lsd" || type === "psychedelics") {
    return SUBSTANCE_HALF_LIVES.lsd
  } else if (type === "psilocybin") {
    return SUBSTANCE_HALF_LIVES.psilocybin
  } else if (type === "ketamine") {
    return SUBSTANCE_HALF_LIVES.ketamine
  } else if (type === "nicotine") {
    return SUBSTANCE_HALF_LIVES.nicotine
  } else if (type === "caffeine") {
    return SUBSTANCE_HALF_LIVES.caffeine
  } else if (type === "cocaine") {
    return SUBSTANCE_HALF_LIVES.cocaine
  } else {
    return SUBSTANCE_HALF_LIVES.default
  }
}

export function calculateUserRiskMultiplier(
  age: number | undefined,
  gender: string | undefined,
  healthConditions: string[] | undefined,
  psychiatricConditions: string[] | undefined,
  substanceType: string,
): number {
  let riskMultiplier = 1.0

  // Age risk
  if (age !== undefined) {
    if ((age >= 18 && age <= 25) || age > 65) {
      riskMultiplier *= RISK_MULTIPLIERS.age_18_25
    }
  }

  // Gender risk (specific to alcohol and MDMA)
  if (gender === "female" && (substanceType === "alcohol" || substanceType === "mdma")) {
    riskMultiplier *= RISK_MULTIPLIERS.female_alcohol_mdma
  }

  // Health conditions
  if (healthConditions) {
    if (
      healthConditions.includes("cardiovascular") ||
      healthConditions.includes("liver") ||
      healthConditions.includes("kidney")
    ) {
      riskMultiplier *= RISK_MULTIPLIERS.cardiovascular
    }
  }

  // Psychiatric conditions
  if (psychiatricConditions) {
    if (
      psychiatricConditions.includes("anxiety") ||
      psychiatricConditions.includes("depression") ||
      psychiatricConditions.includes("bipolar")
    ) {
      riskMultiplier *= RISK_MULTIPLIERS.anxiety
    }
  }

  return riskMultiplier
}
