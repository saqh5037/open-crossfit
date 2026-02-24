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

interface ScoreApprovedEmailProps {
  athleteName: string
  wodName: string
  displayScore: string
  placement: number
  totalInDivision: number
  eventName: string
}

export function ScoreApprovedEmail({
  athleteName,
  wodName,
  displayScore,
  placement,
  totalInDivision,
  eventName,
}: ScoreApprovedEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        Score confirmado: {wodName} — {displayScore}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>GRIZZLYS</Heading>
          <Text style={title}>Score Confirmado</Text>

          <Text style={text}>
            Hola <strong>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            Tu score en <strong>{wodName}</strong> ha sido validado por un coach.
          </Text>

          <Section style={scoreBox}>
            <Text style={wodLabel}>{wodName}</Text>
            <Text style={scoreValue}>{displayScore}</Text>
            <Text style={placementText}>
              Posición actual: #{placement} de {totalInDivision} en tu división
            </Text>
          </Section>

          <Text style={text}>
            ¡Sigue así! Los resultados finales se publicarán al terminar el evento.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>{eventName} — GRIZZLYS</Text>
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
  color: "#22c55e",
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

const scoreBox = {
  backgroundColor: "#052e16",
  border: "1px solid #166534",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  textAlign: "center" as const,
}

const wodLabel = {
  color: "#86efac",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 4px",
}

const scoreValue = {
  color: "#fff",
  fontSize: "32px",
  fontWeight: "bold" as const,
  margin: "0 0 8px",
}

const placementText = {
  color: "#86efac",
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
