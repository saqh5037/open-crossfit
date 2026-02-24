import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Heading,
  Preview,
} from "@react-email/components"

interface CertificateEmailProps {
  athleteName: string
  eventName: string
  position: number
  division: string
  totalPoints: number
}

export function CertificateEmail({
  athleteName,
  eventName,
  position,
  division,
  totalPoints,
}: CertificateEmailProps) {
  const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : ""

  return (
    <Html lang="es">
      <Head />
      <Preview>
        Certificado de participación — {eventName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>GRIZZLYS</Heading>
          <Text style={title}>Certificado de Participación</Text>

          <Text style={text}>
            Hola <strong>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            ¡Gracias por participar en <strong>{eventName}</strong>!
            Adjuntamos tu certificado oficial de participación.
          </Text>

          <Section style={resultBox}>
            <Text style={positionLabel}>Tu posición final</Text>
            <Text style={positionValue}>
              {medal} #{position}
            </Text>
            <Text style={divisionText}>{division}</Text>
            <Text style={pointsText}>{totalPoints} puntos totales</Text>
          </Section>

          <Text style={text}>
            Tu certificado en PDF está adjunto a este correo.
            ¡Felicidades por tu esfuerzo y dedicación!
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            {eventName} — GRIZZLYS — Mérida, Yucatán
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "12px",
  margin: "40px auto",
  padding: "32px",
  maxWidth: "500px",
}

const heading = {
  color: "#DC2626",
  fontSize: "28px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  textAlign: "center" as const,
  margin: "0 0 8px",
}

const title = {
  color: "#fbbf24",
  fontSize: "22px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "0 0 24px",
}

const text = {
  color: "#d1d5db",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
}

const resultBox = {
  backgroundColor: "#1a1a1a",
  border: "2px solid #fbbf24",
  borderRadius: "12px",
  padding: "24px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const positionLabel = {
  color: "#9ca3af",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 4px",
}

const positionValue = {
  color: "#fbbf24",
  fontSize: "48px",
  fontWeight: "bold" as const,
  margin: "0 0 8px",
}

const divisionText = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "0 0 4px",
}

const pointsText = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "0",
}

const hr = {
  borderColor: "#333",
  margin: "24px 0",
}

const footer = {
  color: "#666",
  fontSize: "12px",
  textAlign: "center" as const,
}
