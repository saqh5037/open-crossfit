import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"

interface CertificateData {
  athleteName: string
  position: number
  division: string
  totalPoints: number
  eventName: string
  eventDate: string
}

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: "#0a0a0a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    border: "3px solid #DC2626",
    borderRadius: 12,
    padding: 40,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#DC2626",
    letterSpacing: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: "#fbbf24",
    fontWeight: "bold",
    marginBottom: 30,
    letterSpacing: 3,
  },
  awardedTo: {
    fontSize: 14,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 8,
  },
  athleteName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  divider: {
    width: 200,
    height: 2,
    backgroundColor: "#DC2626",
    marginBottom: 24,
  },
  positionLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 4,
  },
  positionValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fbbf24",
    marginBottom: 8,
  },
  division: {
    fontSize: 16,
    color: "#d1d5db",
    marginBottom: 4,
  },
  points: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 30,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  footer: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 20,
  },
})

function CertificateDocument({
  athleteName,
  position,
  division,
  totalPoints,
  eventName,
  eventDate,
}: CertificateData) {
  const medal = position === 1 ? "1er" : position === 2 ? "2do" : position === 3 ? "3er" : `${position}o`

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.brand}>GRIZZLYS</Text>
          <Text style={styles.title}>CERTIFICADO DE PARTICIPACIÓN</Text>

          <Text style={styles.awardedTo}>Se otorga a</Text>
          <Text style={styles.athleteName}>{athleteName}</Text>

          <View style={styles.divider} />

          <Text style={styles.positionLabel}>Posición Final</Text>
          <Text style={styles.positionValue}>#{medal} Lugar</Text>
          <Text style={styles.division}>{division}</Text>
          <Text style={styles.points}>{totalPoints} puntos totales</Text>

          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.eventDate}>{eventDate}</Text>
          <Text style={styles.footer}>Mérida, Yucatán — Entrenamiento Funcional</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateCertificatePDF(
  data: CertificateData
): Promise<Buffer> {
  return renderToBuffer(
    <CertificateDocument {...data} />
  ) as Promise<Buffer>
}
