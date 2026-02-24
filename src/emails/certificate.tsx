import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
  Link,
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
  const positionColor = isTop3 ? "#fbbf24" : "#ffffff"

  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>
        {`Certificado de participación — ${eventName} | Posición #${position}`}
      </Preview>
      <Body style={main}>
        <Container style={outerContainer}>
          {/* ===== HERO HEADER ===== */}
          <Section style={heroSection}>
            <Img
              src={logoUrl}
              alt="GRIZZLYS"
              width="100"
              height="100"
              style={logoStyleEl}
            />
            <Text style={brandName}>GRIZZLYS</Text>
            <Text style={brandTagline}>CROSSFIT OPEN 2026</Text>
          </Section>

          {/* ===== GOLD BAR ===== */}
          <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "25%", height: "4px", backgroundColor: "#FF6600" }} />
                <td style={{ width: "25%", height: "4px", backgroundColor: "#fbbf24" }} />
                <td style={{ width: "25%", height: "4px", backgroundColor: "#fbbf24" }} />
                <td style={{ width: "25%", height: "4px", backgroundColor: "#FF6600" }} />
              </tr>
            </tbody>
          </table>

          {/* ===== CERTIFICATE TITLE ===== */}
          <Section style={titleSection}>
            <Text style={certLabel}>CERTIFICADO DE</Text>
            <Text style={certTitle}>PARTICIPACIÓN</Text>
            <table cellPadding="0" cellSpacing="0" style={{ margin: "8px auto" }}>
              <tbody>
                <tr>
                  <td style={{ width: "60px", height: "2px", backgroundColor: "#fbbf24" }} />
                  <td style={{ width: "16px" }} />
                  <td style={{ width: "8px", height: "8px", backgroundColor: "#FF6600", borderRadius: "50%" }} />
                  <td style={{ width: "16px" }} />
                  <td style={{ width: "60px", height: "2px", backgroundColor: "#fbbf24" }} />
                </tr>
              </tbody>
            </table>
          </Section>

          {/* ===== GREETING ===== */}
          <Section style={contentSection}>
            <Text style={greetingText}>
              Hola <strong style={{ color: "#ffffff" }}>{athleteName}</strong>,
            </Text>
            <Text style={bodyText}>
              ¡Gracias por ser parte de <strong style={{ color: "#FF6600" }}>{eventName}</strong>! Tu esfuerzo, dedicación y espíritu competitivo son lo que hacen grande a esta comunidad.
            </Text>
          </Section>

          {/* ===== POSITION CARD ===== */}
          <Section style={cardOuter}>
            <Section style={isTop3 ? positionCardTop3 : positionCardNormal}>
              {/* Position */}
              <Text style={posLabel}>TU POSICIÓN FINAL</Text>
              <Text style={{ ...posValue, color: positionColor }}>
                {medal} #{position}
              </Text>

              {/* Division badge */}
              <Section style={{ textAlign: "center" as const, margin: "16px 0" }}>
                <Text style={divisionBadge}>{division}</Text>
              </Section>

              {/* Points */}
              <Section style={pointsCard}>
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" as const }}>
                        <Text style={pointsValueStyle}>{totalPoints}</Text>
                        <Text style={pointsLabelStyle}>PUNTOS TOTALES</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            </Section>
          </Section>

          {/* ===== PDF NOTICE ===== */}
          <Section style={pdfSection}>
            <Section style={pdfCard}>
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "40px", textAlign: "center" as const, verticalAlign: "top" as const }}>
                      <Text style={pdfIcon}>📄</Text>
                    </td>
                    <td>
                      <Text style={pdfTitle}>CERTIFICADO PDF ADJUNTO</Text>
                      <Text style={pdfDescription}>
                        Tu certificado oficial en PDF está adjunto a este correo. Imprímelo o compártelo con orgullo.
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </Section>

          {/* ===== MOTIVATION ===== */}
          <Section style={motivationSection}>
            <Text style={motivationTextStyle}>
              ¡Felicidades por tu esfuerzo y dedicación!
            </Text>
            <Text style={motivationSub}>
              Nos vemos en la próxima. 💪
            </Text>
          </Section>

          {/* ===== CTA ===== */}
          <Section style={ctaSection}>
            <Link href={`${appUrl}/leaderboard`} style={ctaButton}>
              VER RESULTADOS FINALES
            </Link>
          </Section>

          {/* ===== FOOTER ===== */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerEvent}>{eventName}</Text>
            <table cellPadding="0" cellSpacing="0" style={{ margin: "8px auto" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "0 8px" }}>
                    <Link href="https://instagram.com/grizzlysmerida" style={socialLink}>
                      IG @grizzlysmerida
                    </Link>
                  </td>
                  <td style={{ color: "#333", fontSize: "10px" }}>|</td>
                  <td style={{ padding: "0 8px" }}>
                    <Link href="https://facebook.com/GrizzlysMerida" style={socialLink}>
                      FB GrizzlysMerida
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            <Text style={footerBrand}>GRIZZLYS — EST. 2021 — MÉRIDA, YUCATÁN</Text>
            <Text style={footerAddress}>AV 31 395B-X 78A, Plaza Benedetta, Local 12</Text>
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
  padding: "20px 0",
}

const outerContainer = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #1f1f1f",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
}

const heroSection = {
  padding: "48px 40px 20px",
  textAlign: "center" as const,
}

const logoStyleEl = {
  margin: "0 auto",
  borderRadius: "16px",
  border: "2px solid #fbbf24",
}

const brandName = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#FF6600",
  fontSize: "42px",
  fontWeight: "bold" as const,
  letterSpacing: "10px",
  textAlign: "center" as const,
  margin: "16px 0 0",
  lineHeight: "1",
}

const brandTagline = {
  color: "#fbbf24",
  fontSize: "11px",
  letterSpacing: "4px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "4px 0 0",
}

const titleSection = {
  padding: "32px 40px 8px",
  textAlign: "center" as const,
}

const certLabel = {
  color: "#fbbf24",
  fontSize: "12px",
  fontWeight: "bold" as const,
  letterSpacing: "6px",
  margin: "0",
}

const certTitle = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#ffffff",
  fontSize: "44px",
  fontWeight: "bold" as const,
  letterSpacing: "8px",
  margin: "0",
  lineHeight: "1",
}

const contentSection = {
  padding: "16px 40px 8px",
}

const greetingText = {
  color: "#a3a3a3",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "0 0 8px",
}

const bodyText = {
  color: "#a3a3a3",
  fontSize: "15px",
  lineHeight: "26px",
  margin: "0",
}

const cardOuter = {
  padding: "16px 32px 24px",
}

const positionCardNormal = {
  backgroundColor: "#111111",
  border: "2px solid #fbbf24",
  borderRadius: "12px",
  padding: "32px 24px",
  textAlign: "center" as const,
}

const positionCardTop3 = {
  ...positionCardNormal,
  border: "2px solid #fbbf24",
}

const posLabel = {
  color: "#fbbf24",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  margin: "0 0 12px",
}

const posValue = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  fontSize: "80px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const divisionBadge = {
  backgroundColor: "#FF6600",
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  padding: "8px 20px",
  borderRadius: "6px",
  display: "inline-block",
  textTransform: "uppercase" as const,
  margin: "0",
}

const pointsCard = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "8px",
}

const pointsValueStyle = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#ffffff",
  fontSize: "40px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const pointsLabelStyle = {
  color: "#525252",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "4px 0 0",
}

const pdfSection = {
  padding: "0 32px 16px",
}

const pdfCard = {
  backgroundColor: "#111111",
  border: "1px solid #262626",
  borderRadius: "8px",
  padding: "16px 20px",
}

const pdfIcon = {
  fontSize: "24px",
  margin: "0",
}

const pdfTitle = {
  color: "#fbbf24",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0 0 4px",
}

const pdfDescription = {
  color: "#a3a3a3",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
}

const motivationSection = {
  textAlign: "center" as const,
  padding: "8px 40px 24px",
}

const motivationTextStyle = {
  color: "#FF6600",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "0",
}

const motivationSub = {
  color: "#525252",
  fontSize: "14px",
  margin: "4px 0 0",
}

const ctaSection = {
  textAlign: "center" as const,
  padding: "0 40px 32px",
}

const ctaButton = {
  backgroundColor: "#fbbf24",
  borderRadius: "8px",
  color: "#000000",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  padding: "16px 36px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
}

const hr = {
  borderColor: "#1a1a1a",
  margin: "0",
}

const footerSection = {
  padding: "28px 40px",
  textAlign: "center" as const,
}

const footerEvent = {
  color: "#525252",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0 0 4px",
}

const socialLink = {
  color: "#FF6600",
  fontSize: "10px",
  textDecoration: "none",
  letterSpacing: "1px",
}

const footerBrand = {
  color: "#333333",
  fontSize: "9px",
  letterSpacing: "2px",
  fontWeight: "bold" as const,
  margin: "12px 0 0",
}

const footerAddress = {
  color: "#262626",
  fontSize: "9px",
  margin: "4px 0 0",
}
