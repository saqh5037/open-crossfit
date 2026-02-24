export const POINTS_FIRST_PLACE = 100
export const POINTS_DECREMENT = 3

export function placementToPoints(placement: number): number {
  if (placement <= 0) return 0
  return Math.max(0, POINTS_FIRST_PLACE - (placement - 1) * POINTS_DECREMENT)
}

export function getPointsTable(maxPlaces: number = 15): { place: number; points: number }[] {
  return Array.from({ length: maxPlaces }, (_, i) => ({
    place: i + 1,
    points: placementToPoints(i + 1),
  }))
}
