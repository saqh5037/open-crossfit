import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer"
import type { LeaderboardEntry } from "@/types"

Font.register({
  family: "BebasNeue",
  src: "/fonts/BebasNeue-Regular.ttf",
})

interface WodHeader {
  id: string
  name: string
  score_type: string
}

export interface LeaderboardExportData {
  entries: LeaderboardEntry[]
  wods: WodHeader[]
  divisionLabel: string
  eventName: string
}

const ORANGE = "#FF6600"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  headerText: {
    flex: 1,
  },
  brandName: {
    fontFamily: "BebasNeue",
    fontSize: 24,
    color: ORANGE,
    letterSpacing: 2,
  },
  eventTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },
  divisionText: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 1,
  },
  dateText: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "right",
    marginTop: 2,
  },
  // Orange line
  orangeLine: {
    height: 2,
    backgroundColor: ORANGE,
    marginBottom: 12,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: ORANGE,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 7,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableRowTop3: {
    backgroundColor: "#fff7ed",
  },
  // Column cells
  colRank: { width: 25, textAlign: "center" },
  colName: { width: 110 },
  colTotal: { width: 45, textAlign: "center" },
  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#d1d5db",
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
  },
})

function LeaderboardPDFDocument({ entries, wods, divisionLabel, eventName }: LeaderboardExportData) {
  const today = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
  const wodCount = wods.length
  // Calculate WOD column width dynamically
  const fixedWidth = 25 + 110 + 45 // rank + name + total
  const availableWidth = 735 - fixedWidth // 735 ≈ landscape letter width - padding
  const wodColWidth = Math.floor(availableWidth / wodCount)

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo-80.png" style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.brandName}>GRIZZLYS</Text>
            <Text style={styles.eventTitle}>{eventName}</Text>
            <Text style={styles.divisionText}>{divisionLabel}</Text>
          </View>
          <Text style={styles.dateText}>{today}</Text>
        </View>

        <View style={styles.orangeLine} />

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colRank]}>#</Text>
          <Text style={[styles.tableHeaderText, styles.colName]}>Atleta</Text>
          {wods.map((wod) => (
            <Text
              key={wod.id}
              style={[styles.tableHeaderText, { width: wodColWidth, textAlign: "center" }]}
            >
              {wod.name}
            </Text>
          ))}
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
        </View>

        {/* Table Body */}
        {entries.map((entry, i) => (
          <View
            key={entry.id}
            style={[
              styles.tableRow,
              i % 2 === 1 ? styles.tableRowAlt : {},
              entry.overall_rank <= 3 ? styles.tableRowTop3 : {},
            ]}
          >
            <Text style={[styles.colRank, { fontWeight: entry.overall_rank <= 3 ? "bold" : "normal" }]}>
              {entry.overall_rank}
            </Text>
            <Text style={[styles.colName, { fontWeight: entry.overall_rank <= 3 ? "bold" : "normal" }]}>
              {entry.full_name}
            </Text>
            {wods.map((wod) => {
              const result = entry.wod_results.find((r) => r.wod_id === wod.id)
              return (
                <View key={wod.id} style={{ width: wodColWidth, alignItems: "center" }}>
                  <Text style={{ fontSize: 7, color: "#374151" }}>
                    {result?.display_score || "—"}
                  </Text>
                  <Text style={{ fontSize: 6, color: ORANGE, fontWeight: "bold" }}>
                    {result?.points != null ? `${result.points} pts` : ""}
                  </Text>
                </View>
              )
            })}
            <Text
              style={[
                styles.colTotal,
                {
                  fontWeight: "bold",
                  fontSize: 9,
                  color: entry.overall_rank <= 3 ? ORANGE : "#111827",
                },
              ]}
            >
              {entry.total_points}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Designed by WBI México</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

export async function generateLeaderboardPDF(data: LeaderboardExportData): Promise<Blob> {
  const blob = await pdf(<LeaderboardPDFDocument {...data} />).toBlob()
  return blob
}
