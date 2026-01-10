export interface WeightPoint {
  dateISO: string
  kg: number
}

// Simple mock of last 8 entries (approx. weekly)
export const weightSeries: WeightPoint[] = [
  { dateISO: '2025-11-15', kg: 78.4 },
  { dateISO: '2025-11-22', kg: 78.0 },
  { dateISO: '2025-11-29', kg: 77.6 },
  { dateISO: '2025-12-06', kg: 77.4 },
  { dateISO: '2025-12-13', kg: 77.1 },
  { dateISO: '2025-12-20', kg: 76.9 },
  { dateISO: '2025-12-27', kg: 76.7 },
  { dateISO: '2026-01-03', kg: 76.5 },
]

