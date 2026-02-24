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

interface CertificateEmailProps {
  athleteName: string
  eventName: string
  position: number
  division: string
  totalPoints: number
  appUrl: string
}

export function CertificateEmail({
  athleteName,
  eventName,
  position,
  division,
  totalPoints,
  appUrl,
}: CertificateEmailProps) {
  const logoUrl = `${appUrl}/logo-200.png`
  const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : ""
  const isTop3 = position <= 3

  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>
        {`Certificado de participación — ${eventName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Img
              src={logoUrl}
              alt="GRIZZLYS"
              width="80"
              height="80"
              style={logo}
            />
            <Text style={brandName}>GRIZZLYS</Text>
            <Text style={brandSub}>CROSSFIT OPEN 2026</Text>
          </Section>

          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* Certificate title */}
          <Section style={titleSection}>
            <Text style={certLabel}>CERTIFICADO DE</Text>
            <Text style={certTitle}>PARTICIPACIÓN</Text>
          </Section>

          {/* Greeting */}
          <Text style={greeting}>
            Hola <strong style={{ color: "#fff" }}>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            ¡Gracias por ser parte de <strong style={{ color: "#FF6600" }}>{eventName}</strong>! Tu esfuerzo, dedicación y espíritu competitivo son lo que hacen grande a esta comunidad.
          </Text>

          {/* Position card */}
          <Section style={isTop3 ? positionCardTop3 : positionCard}>
            <Text style={posLabel}>TU POSICIÓN FINAL</Text>
            <Text style={isTop3 ? posValueTop3 : posValue}>
              {medal} #{position}
            </Text>
            <Section style={divisionBadgeSection}>
              <Text style={divisionBadge}>{division}</Text>
            </Section>
            <Section style={pointsSection}>
              <Text style={pointsValue}>{totalPoints}</Text>
              <Text style={pointsLabel}>PUNTOS TOTALES</Text>
            </Section>
          </Section>

          {/* PDF notice */}
          <Section style={pdfNotice}>
            <Text style={pdfIcon}>📄</Text>
            <Text style={pdfText}>
              Tu certificado en PDF está adjunto a este correo. Imprímelo o compártelo con orgullo.
            </Text>
          </Section>

          {/* Motivation */}
          <Text style={motivationText}>
            ¡Felicidades por tu esfuerzo y dedicación! Nos vemos en la próxima.
          </Text>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerEvent}>{eventName}</Text>
            <Text style={footerBrand}>GRIZZLYS — MÉRIDA, YUCATÁN</Text>
            <Text style={footerAddress}>
              AV 31 395B-X 78A, Plaza Benedetta, Local 12
            </Text>
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
  padding: "40px 32px 12px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
  borderRadius: "12px",
}

const brandName = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#FF6600",
  fontSize: "32px",
  fontWeight: "bold" as const,
  letterSpacing: "8px",
  textAlign: "center" as const,
  margin: "12px 0 0",
}

const brandSub = {
  color: "#666",
  fontSize: "11px",
  letterSpacing: "4px",
  textAlign: "center" as const,
  margin: "0 0 8px",
}

const goldBar = {
  background: "linear-gradient(90deg, #FF6600, #fbbf24, #FF6600)",
  backgroundColor: "#fbbf24",
  height: "3px",
  margin: "0 32px",
}

const titleSection = {
  textAlign: "center" as const,
  padding: "28px 32px 0",
}

const certLabel = {
  color: "#fbbf24",
  fontSize: "12px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  margin: "0",
}

const certTitle = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#fff",
  fontSize: "36px",
  fontWeight: "bold" as const,
  letterSpacing: "6px",
  margin: "0 0 8px",
}

const greeting = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 32px 4px",
}

const text = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 32px 16px",
}

const positionCard = {
  backgroundColor: "#111",
  border: "2px solid #fbbf24",
  borderRadius: "8px",
  margin: "8px 32px 24px",
  padding: "28px",
  textAlign: "center" as const,
}

const positionCardTop3 = {
  ...positionCard,
  border: "2px solid #fbbf24",
  boxShadow: "0 0 30px rgba(251, 191, 36, 0.15)",
}

const posLabel = {
  color: "#fbbf24",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0 0 8px",
}

const posValue = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#fff",
  fontSize: "64px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const posValueTop3 = {
  ...posValue,
  color: "#fbbf24",
}

const divisionBadgeSection = {
  textAlign: "center" as const,
  marginTop: "12px",
}

const divisionBadge = {
  backgroundColor: "#FF6600",
  color: "#fff",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  padding: "6px 16px",
  borderRadius: "4px",
  display: "inline-block",
  textTransform: "uppercase" as const,
  margin: "0",
}

const pointsSection = {
  borderTop: "1px solid #262626",
  marginTop: "16px",
  paddingTop: "16px",
}

const pointsValue = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#fff",
  fontSize: "32px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const pointsLabel = {
  color: "#666",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "4px 0 0",
}

const pdfNotice = {
  backgroundColor: "#111",
  border: "1px solid #262626",
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "0 32px 16px",
  textAlign: "center" as const,
}

const pdfIcon = {
  fontSize: "24px",
  margin: "0 0 4px",
}

const pdfText = {
  color: "#a3a3a3",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
}

const motivationText = {
  color: "#FF6600",
  fontSize: "14px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "8px 32px 24px",
}

const hr = {
  borderColor: "#1a1a1a",
  margin: "0 32px",
}

const footerSection = {
  padding: "20px 32px",
  textAlign: "center" as const,
}

const footerEvent = {
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

const footerAddress = {
  color: "#333",
  fontSize: "9px",
  margin: "4px 0 0",
}
