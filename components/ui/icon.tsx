import * as LucideIcons from "lucide-react"
import type { FC, SVGProps } from "react"

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export const Icon: FC<IconProps> = ({ name, ...props }) => {
  try {
    // Make sure we're using the correct capitalization for Lucide icon names
    // Lucide icons use PascalCase (e.g., "Coffee", not "coffee")
    const iconName = name.charAt(0).toUpperCase() + name.slice(1)

    // Check if the icon exists in Lucide
    const LucideIcon = (LucideIcons as Record<string, FC<SVGProps<SVGSVGElement>>>)[iconName]

    if (LucideIcon) {
      return <LucideIcon {...props} strokeWidth={1.8} />
    }

    // If the icon doesn't exist, use a fallback
    return <LucideIcons.HelpCircle {...props} strokeWidth={1.8} />
  } catch (error) {
    console.error(`Error rendering icon: ${name}`, error)
    return <LucideIcons.HelpCircle {...props} strokeWidth={1.8} />
  }
}
