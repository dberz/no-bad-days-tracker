// This file manages the substance harm reduction tips

// Define the structure of a tip
export interface SubstanceTip {
  id: number
  substance: string
  category: string
  tip: string
}

// Parse the CSV data into an array of tips
export function parseTipsFromCSV(csvData: string): SubstanceTip[] {
  const lines = csvData.split("\n")
  const tips: SubstanceTip[] = []

  // Skip header row if present
  const startIndex = lines[0].includes("substance") || lines[0].includes("category") ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Split by comma, but handle commas within quotes
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

    if (parts.length >= 3) {
      const id = i
      const substance = parts[0].trim().replace(/"/g, "")
      const category = parts[1].trim().replace(/"/g, "")
      const tip = parts[2].trim().replace(/"/g, "")

      tips.push({ id, substance, category, tip })
    }
  }

  return tips
}

// Get tips for a specific substance
export function getTipsForSubstance(tips: SubstanceTip[], substance: string, limit = 3): SubstanceTip[] {
  // Normalize substance name for comparison
  const normalizedSubstance = substance.toLowerCase()

  // Map substance types to their corresponding tip categories
  const substanceMap: Record<string, string[]> = {
    alcohol: ["alcohol", "general"],
    beer: ["alcohol", "general"],
    wine: ["alcohol", "general"],
    liquor: ["alcohol", "general"],
    cannabis: ["cannabis", "general"],
    marijuana: ["cannabis", "general"],
    weed: ["cannabis", "general"],
    mdma: ["mdma", "psychedelics", "general"],
    ecstasy: ["mdma", "psychedelics", "general"],
    lsd: ["psychedelics", "general"],
    psilocybin: ["psychedelics", "general"],
    mushrooms: ["psychedelics", "general"],
    ketamine: ["ketamine", "general"],
    cocaine: ["stimulants", "general"],
    stimulants: ["stimulants", "general"],
    caffeine: ["caffeine", "general"],
  }

  // Get the categories for this substance
  const categories = substanceMap[normalizedSubstance] || ["general"]

  // Filter tips by the relevant categories
  const relevantTips = tips.filter(
    (tip) => categories.includes(tip.substance.toLowerCase()) || categories.includes(tip.category.toLowerCase()),
  )

  // Shuffle the tips to get random ones each time
  const shuffled = [...relevantTips].sort(() => 0.5 - Math.random())

  // Return the specified number of tips
  return shuffled.slice(0, limit)
}

// Get a random general tip
export function getRandomGeneralTip(tips: SubstanceTip[]): SubstanceTip | null {
  const generalTips = tips.filter(
    (tip) => tip.substance.toLowerCase() === "general" || tip.category.toLowerCase() === "general",
  )

  if (generalTips.length === 0) return null

  const randomIndex = Math.floor(Math.random() * generalTips.length)
  return generalTips[randomIndex]
}

// Cache for the tips data
let tipsCache: SubstanceTip[] | null = null

// Function to load tips from the CSV URL
export async function loadTips(): Promise<SubstanceTip[]> {
  if (tipsCache) return tipsCache

  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/social%20substance%20tips-m3FPJHTgKMl58qwQy5kWhGZajdFFHe.csv",
    )
    const csvData = await response.text()
    tipsCache = parseTipsFromCSV(csvData)
    return tipsCache
  } catch (error) {
    console.error("Error loading substance tips:", error)
    return []
  }
}
