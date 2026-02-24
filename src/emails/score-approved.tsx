import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
  Preview,
} from "@react-email/components"

interface ScoreApprovedEmailProps {
  athleteName: string
  wodName: string
  displayScore: string
  placement: number
  totalInDivision: number
  eventName: string
  appUrl: string
}

export function ScoreApprovedEmail({
  athleteName,
  wodName,
  displayScore,
  placement,
  totalInDivision,
  eventName,
  appUrl,
}: ScoreApprovedEmailProps) {
  const logoUrl = `${appUrl}/logo-200.png`
  const medal = placement === 1 ? "🥇" : placement === 2 ? "🥈" : placement === 3 ? "🥉" : ""

  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>
        {`Score confirmado: ${wodName} — ${displayScore}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Img
              src={logoUrl}
              alt="GRIZZLYS"
              width="60"
              height="60"
              style={logo}
            />
            <Text style={brandName}>GRIZZLYS</Text>
          </Section>

          {/* Green accent bar */}
          <Section style={accentBar} />

          {/* Status badge */}
          <Section style={{ textAlign: "center" as const, padding: "24px 32px 0" }}>
            <Text style={statusBadge}>✓ SCORE CONFIRMADO</Text>
          </Section>

          <Text style={greeting}>
            Hola <strong style={{ color: "#fff" }}>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            Tu score en <strong style={{ color: "#FF6600" }}>{wodName}</strong> ha sido validado por el coach.
          </Text>

          {/* Score card */}
          <Section style={scoreCard}>
            <Text style={wodLabel}>{wodName}</Text>
            <Text style={scoreValue}>{displayScore}</Text>
            <Section style={placementSection}>
              <Text style={placementText}>
                {medal} #{placement} de {totalInDivision} en tu división
              </Text>
            </Section>
          </Section>

          <Text style={motivationText}>
            ¡Sigue así! Los resultados finales se publicarán al terminar el evento.
          </Text>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerText}>{eventName}</Text>
            <Text style={footerBrand}>GRIZZLYS — MÉRIDA</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// === STYLES ===

const main = {
  backgroundColor: "#000000",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #1a1a1a",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
}

const headerSection = {
  padding: "32px 32px 12px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
  borderRadius: "10px",
}

const brandName = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#FF6600",
  fontSize: "28px",
  fontWeight: "bold" as const,
  letterSpacing: "6px",
  textAlign: "center" as const,
  margin: "8px 0 0",
}

const accentBar = {
  backgroundColor: "#22c55e",
  height: "3px",
  margin: "0 32px",
}

const statusBadge = {
  backgroundColor: "#052e16",
  border: "1px solid #166534",
  borderRadius: "6px",
  color: "#22c55e",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  padding: "8px 20px",
}

const greeting = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "20px 32px 4px",
}

const text = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 32px",
}

const scoreCard = {
  backgroundColor: "#111",
  border: "2px solid #FF6600",
  borderRadius: "8px",
  margin: "24px 32px",
  padding: "24px",
  textAlign: "center" as const,
}

const wodLabel = {
  color: "#FF6600",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
}

const scoreValue = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#fff",
  fontSize: "48px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const placementSection = {
  backgroundColor: "#052e16",
  borderRadius: "4px",
  padding: "8px",
  marginTop: "16px",
}

const placementText = {
  color: "#86efac",
  fontSize: "14px",
  fontWeight: "bold" as const,
  margin: "0",
}

const motivationText = {
  color: "#666",
  fontSize: "13px",
  textAlign: "center" as const,
  margin: "0 32px 24px",
  fontStyle: "italic" as const,
}

const hr = {
  borderColor: "#1a1a1a",
  margin: "0 32px",
}

const footerSection = {
  padding: "20px 32px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#525252",
  fontSize: "11px",
  margin: "0",
}

const footerBrand = {
  color: "#404040",
  fontSize: "10px",
  letterSpacing: "2px",
  fontWeight: "bold" as const,
  margin: "4px 0 0",
}
