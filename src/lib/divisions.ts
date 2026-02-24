import type { DivisionInfo } from "@/types"

export const DIVISIONS: Record<string, DivisionInfo> = {
  rx_male: { key: "rx_male", label: "RX Masculino", gender: "M" },
  rx_female: { key: "rx_female", label: "RX Femenino", gender: "F" },
  scaled_male: { key: "scaled_male", label: "Scaled Masculino", gender: "M" },
  scaled_female: { key: "scaled_female", label: "Scaled Femenino", gender: "F" },
  foundation_male: { key: "foundation_male", label: "Foundation Masculino", gender: "M" },
  foundation_female: { key: "foundation_female", label: "Foundation Femenino", gender: "F" },
  masters35_male: { key: "masters35_male", label: "Masters 35+ Masculino", gender: "M" },
  masters35_female: { key: "masters35_female", label: "Masters 35+ Femenino", gender: "F" },
  masters45_male: { key: "masters45_male", label: "Masters 45+ Masculino", gender: "M" },
  masters45_female: { key: "masters45_female", label: "Masters 45+ Femenino", gender: "F" },
  teens_male: { key: "teens_male", label: "Teens Masculino", gender: "M" },
  teens_female: { key: "teens_female", label: "Teens Femenino", gender: "F" },
}

export function getDivisionsByGender(gender: "M" | "F" | "NB"): DivisionInfo[] {
  if (gender === "NB") return Object.values(DIVISIONS)
  return Object.values(DIVISIONS).filter((d) => d.gender === gender)
}

export function getDivisionLabel(key: string): string {
  return DIVISIONS[key]?.label ?? key
}

export function getAllDivisionKeys(): string[] {
  return Object.keys(DIVISIONS)
}
