import type { DivisionInfo } from "@/types"

export const DIVISIONS: Record<string, DivisionInfo> = {
  rx_male: { key: "rx_male", label: "RX Masculino", gender: "M", description: "Avanzado" },
  rx_female: { key: "rx_female", label: "RX Femenino", gender: "F", description: "Avanzado" },
  foundation_male: { key: "foundation_male", label: "Foundation Masculino", gender: "M", description: "Principiante" },
  foundation_female: { key: "foundation_female", label: "Foundation Femenino", gender: "F", description: "Principiante" },
  masters45_male: { key: "masters45_male", label: "Masters 45+ Masculino", gender: "M", description: "45 años o más" },
  masters45_female: { key: "masters45_female", label: "Masters 45+ Femenino", gender: "F", description: "45 años o más" },
  teens_male: { key: "teens_male", label: "Teens Masculino", gender: "M", description: "13-17 años" },
  teens_female: { key: "teens_female", label: "Teens Femenino", gender: "F", description: "13-17 años" },
}

export function getDivisionsByGender(gender: "M" | "F"): DivisionInfo[] {
  return Object.values(DIVISIONS).filter((d) => d.gender === gender)
}

export function getDivisionLabel(key: string): string {
  return DIVISIONS[key]?.label ?? key
}

export function getAllDivisionKeys(): string[] {
  return Object.keys(DIVISIONS)
}

export function isDivisionRx(divisionKey: string): boolean {
  return divisionKey.startsWith("rx_")
}

export function getDivisionBadge(divisionKey: string): { text: string; bgColor: string } {
  if (divisionKey.startsWith("rx_")) return { text: "RX", bgColor: "#16a34a" }
  if (divisionKey.startsWith("foundation_")) return { text: "Foundation", bgColor: "#2563eb" }
  if (divisionKey.startsWith("masters45_")) return { text: "Masters 45+", bgColor: "#9333ea" }
  if (divisionKey.startsWith("teens_")) return { text: "Teens", bgColor: "#ea580c" }
  return { text: divisionKey.replace(/_/g, " "), bgColor: "" }
}
