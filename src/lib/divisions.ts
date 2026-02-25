import type { DivisionInfo } from "@/types"

export const DIVISIONS: Record<string, DivisionInfo> = {
  rx_male: { key: "rx_male", label: "RX Masculino", gender: "M", description: "Avanzado" },
  rx_female: { key: "rx_female", label: "RX Femenino", gender: "F", description: "Avanzado" },
  foundation_male: { key: "foundation_male", label: "Principiante", gender: "M", description: "Principiante" },
  foundation_female: { key: "foundation_female", label: "Foundation", gender: "F", description: "Principiante" },
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
  return { text: divisionKey.replace(/_/g, " "), bgColor: "" }
}
