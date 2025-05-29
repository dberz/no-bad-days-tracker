import type { FC, SVGProps } from "react"
import { Icon } from "@/components/ui/icon"

// Custom SVG icons for substances not available in lucide-react
export const AtomicIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="M5 12a7 7 0 0 1 14 0" />
    <path d="M12 3a7 7 0 0 1 0 14" />
  </svg>
)

export const KetamineIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 3h6v6h-6z" />
    <path d="m5 3 4 4" />
    <path d="m15 3 4 4" />
    <path d="M5 21h14" />
    <path d="M9 9v12" />
    <path d="M15 9v12" />
  </svg>
)

// Custom cannabis icon since it's not available in lucide-react
export const CannabisIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22V10" />
    <path d="M8 10c0-4 4-8 4-8s4 4 4 8" />
    <path d="M16 14c0 4-4 8-4 8s-4-4-4-8" />
    <path d="M16 10c3.535 0 7-1.79 7-4s-3.5-4-7-4" />
    <path d="M8 10c-3.535 0-7-1.79-7-4s3.5-4 7-4" />
  </svg>
)

export const MushroomIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 7v8a7 7 0 0 0 14 0V7" />
    <path d="M2 7h20" />
    <path d="M6 7a2 2 0 1 0-4 0" />
    <path d="M10 7a2 2 0 1 0-4 0" />
    <path d="M14 7a2 2 0 1 0-4 0" />
    <path d="M18 7a2 2 0 1 0-4 0" />
    <path d="M22 7a2 2 0 1 0-4 0" />
  </svg>
)

// Custom MDMA icon
export const MDMAIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2a10 10 0 0 0-10 10" />
    <path d="M12 22a10 10 0 0 1-10-10" />
    <path d="M12 22a10 10 0 0 0 10-10" />
  </svg>
)

// Custom LSD icon
export const LSDIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2a10 10 0 0 0-10 10" />
    <path d="M12 22a10 10 0 0 1-10-10" />
    <path d="M12 22a10 10 0 0 0 10-10" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// Map substance types to icon components or Lucide icon names
const substanceIconMap: Record<string, string | FC<SVGProps<SVGSVGElement>>> = {
  // Alcohol
  alcohol: "Wine",
  beer: "Beer",
  wine: "Wine",
  liquor: "Cocktail",
  spirits: "Cocktail",
  
  // Cannabis
  cannabis: CannabisIcon,
  marijuana: CannabisIcon,
  weed: CannabisIcon,
  smoked: CannabisIcon,
  edible: "Cookie",
  vape: "Cloud",
  
  // Psychedelics
  mdma: MDMAIcon,
  ecstasy: MDMAIcon,
  molly: MDMAIcon,
  ketamine: KetamineIcon,
  psychedelics: AtomicIcon,
  lsd: LSDIcon,
  acid: LSDIcon,
  psilocybin: MushroomIcon,
  mushrooms: MushroomIcon,
  shrooms: MushroomIcon,
  
  // Stimulants
  nicotine: "Cigarette",
  caffeine: "Coffee",
  stimulants: "Zap",
  prescription: "Pill",
  adderall: "Pill",
  ritalin: "Pill",
  cocaine: "Snowflake",
  crack: "Snowflake",
  meth: "Zap",
  amphetamine: "Zap",
  
  // Interventions
  sleep: "Moon",
  exercise: "Dumbbell",
  meditation: "Heart",
  hydration: "Droplets",
  nutrition: "Apple",
  abstinence: "ShieldCheck",
  social: "Users",
  therapy: "HeartHandshake",
  recovery: "Leaf",
  
  // Default
  default: "Pill",
}

interface SubstanceIconProps extends SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export const SubstanceIcon: FC<SubstanceIconProps> = ({ name, className = "", ...props }) => {
  // Convert to lowercase and remove spaces for consistent mapping
  const normalizedName = name?.toLowerCase().replace(/\s+/g, "") || ""

  // Get the icon from the map, or use a default
  const iconValue = substanceIconMap[normalizedName] || substanceIconMap.default

  // If the icon is a component (custom SVG), render it directly
  if (typeof iconValue !== "string") {
    const IconComponent = iconValue
    return <IconComponent className={className} {...props} />
  }

  // Otherwise, use the Icon component with the Lucide icon name
  return <Icon name={iconValue} className={className} {...props} />
}

// Helper function to get the appropriate icon for a substance type
export function getSubstanceIcon(type: string): FC<SVGProps<SVGSVGElement>> | string {
  const normalizedType = type?.toLowerCase().replace(/\s+/g, "") || ""
  return substanceIconMap[normalizedType] || substanceIconMap.default
}
