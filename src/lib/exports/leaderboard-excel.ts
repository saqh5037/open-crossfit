import type { LeaderboardEntry } from "@/types"

interface WodHeader {
  id: string
  name: string
  score_type: string
}

export interface LeaderboardExcelData {
  entries: LeaderboardEntry[]
  wods: WodHeader[]
  divisionKey: string
  divisionLabel: string
  eventName: string
}

const ORANGE_FILL = { fgColor: { rgb: "FF6600" } }
const LIGHT_ORANGE_FILL = { fgColor: { rgb: "FFF3E0" } }
const WHITE_FILL = { fgColor: { rgb: "FFFFFF" } }
const HEADER_FONT = { bold: true, color: { rgb: "FFFFFF" }, sz: 11 }
const TITLE_FONT = { bold: true, color: { rgb: "FFFFFF" }, sz: 18 }
const BOLD_FONT = { bold: true, sz: 10 }
const ORANGE_BOLD_FONT = { bold: true, color: { rgb: "FF6600" }, sz: 10 }

export async function generateLeaderboardExcel(data: LeaderboardExcelData): Promise<void> {
  const XLSX = (await import("xlsx-js-style")).default

  const { entries, wods, divisionLabel, eventName, divisionKey } = data
  const today = new Date().toISOString().split("T")[0]

  const wb = XLSX.utils.book_new()

  // Build column structure: #, Atleta, [WOD Score, WOD Pts] x N, Total
  const wodCols = wods.flatMap((w) => [`${w.name} Score`, `${w.name} Pts`])
  const allCols = ["#", "Atleta", ...wodCols, "Total Pts"]
  const totalCols = allCols.length

  // Row 1: Title (merged)
  // Row 2: Division
  // Row 3: Date
  // Row 4: empty
  // Row 5: Headers
  // Row 6+: Data

  const rows: Record<string, unknown>[][] = []

  // Row 0 (title)
  const titleRow: Record<string, unknown>[] = [
    { v: eventName, s: { font: TITLE_FONT, fill: ORANGE_FILL, alignment: { horizontal: "center", vertical: "center" } } },
  ]
  for (let i = 1; i < totalCols; i++) titleRow.push({ v: "", s: { fill: ORANGE_FILL } })
  rows.push(titleRow)

  // Row 1 (division)
  const divRow: Record<string, unknown>[] = [
    { v: `División: ${divisionLabel}`, s: { font: BOLD_FONT } },
  ]
  rows.push(divRow)

  // Row 2 (date)
  const dateRow: Record<string, unknown>[] = [
    { v: `Generado: ${today}`, s: { font: { color: { rgb: "9ca3af" }, sz: 9 } } },
  ]
  rows.push(dateRow)

  // Row 3 (spacer)
  rows.push([])

  // Row 4 (headers)
  const headerRow = allCols.map((col) => ({
    v: col,
    s: {
      font: HEADER_FONT,
      fill: ORANGE_FILL,
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        bottom: { style: "thin", color: { rgb: "CC5500" } },
      },
    },
  }))
  rows.push(headerRow)

  // Data rows
  entries.forEach((entry, i) => {
    const isTop3 = entry.overall_rank <= 3
    const rowFill = i % 2 === 0 ? WHITE_FILL : LIGHT_ORANGE_FILL
    const baseCellStyle = {
      fill: isTop3 ? { fgColor: { rgb: "FFF7ED" } } : rowFill,
      alignment: { horizontal: "center" as const, vertical: "center" as const },
      border: { bottom: { style: "thin" as const, color: { rgb: "E5E7EB" } } },
    }

    const row: Record<string, unknown>[] = [
      { v: entry.overall_rank, s: { ...baseCellStyle, font: isTop3 ? BOLD_FONT : {} } },
      {
        v: entry.full_name,
        s: {
          ...baseCellStyle,
          alignment: { horizontal: "left", vertical: "center" },
          font: isTop3 ? BOLD_FONT : {},
        },
      },
    ]

    // WOD columns
    for (const wod of wods) {
      const result = entry.wod_results.find((r) => r.wod_id === wod.id)
      row.push({
        v: result?.display_score || "—",
        s: { ...baseCellStyle, font: { sz: 9 } },
      })
      row.push({
        v: result?.points ?? 0,
        s: { ...baseCellStyle, font: { bold: true, color: { rgb: "FF6600" }, sz: 9 } },
      })
    }

    // Total
    row.push({
      v: entry.total_points,
      s: { ...baseCellStyle, font: isTop3 ? ORANGE_BOLD_FONT : BOLD_FONT },
    })

    rows.push(row)
  })

  // Create worksheet from array of arrays
  const ws = XLSX.utils.aoa_to_sheet(rows.map((row) => row.map((cell) => {
    if (cell && typeof cell === "object" && "v" in cell) return cell
    return cell
  })))

  // Merge title row
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
  ]

  // Column widths
  const colWidths: { wch: number }[] = [
    { wch: 5 },  // #
    { wch: 28 }, // Atleta
  ]
  for (let i = 0; i < wods.length; i++) {
    colWidths.push({ wch: 14 }) // Score
    colWidths.push({ wch: 8 })  // Pts
  }
  colWidths.push({ wch: 10 }) // Total
  ws["!cols"] = colWidths

  // Row heights
  ws["!rows"] = [
    { hpt: 30 }, // Title
    { hpt: 18 }, // Division
    { hpt: 15 }, // Date
    { hpt: 10 }, // Spacer
    { hpt: 22 }, // Headers
  ]

  // Freeze panes (freeze header row and first two columns)
  ws["!freeze"] = { xSplit: 2, ySplit: 5 }

  // Add sheet
  const sheetName = divisionLabel.substring(0, 31) // Excel max sheet name is 31 chars
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Download
  XLSX.writeFile(wb, `leaderboard-${divisionKey}-${today}.xlsx`)
}
