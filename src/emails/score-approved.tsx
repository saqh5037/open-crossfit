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
  const medal = placement === 1 ? "🥇" : placement === 2 ? "🥈" : placement === 3 ? "🥉" : "💪"

  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>
        {`✓ Score confirmado: ${wodName} — ${displayScore} | #${placement} en tu división`}
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
              style={logoStyle}
            />
            <Text style={brandName}>GRIZZLYS</Text>
            <Text style={brandTagline}>ENTRENAMIENTO FUNCIONAL · MÉRIDA</Text>
          </Section>

          {/* ===== ORANGE GRADIENT BAR ===== */}
          <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={gradientBarLeft} />
                <td style={gradientBarCenter} />
                <td style={gradientBarRight} />
              </tr>
            </tbody>
          </table>

          {/* ===== STATUS BANNER ===== */}
          <Section style={statusBanner}>
            <Text style={statusIcon}>✓</Text>
            <Text style={statusText}>SCORE CONFIRMADO</Text>
          </Section>

          {/* ===== CONTENT ===== */}
          <Section style={contentSection}>
            <Text style={greetingText}>
              Hola <strong style={{ color: "#ffffff" }}>{athleteName}</strong>,
            </Text>
            <Text style={bodyText}>
              Tu score en <strong style={{ color: "#FF6600" }}>{wodName}</strong> ha sido <strong style={{ color: "#22c55e" }}>validado</strong> oficialmente por el coach.
            </Text>
          </Section>

          {/* ===== SCORE CARD ===== */}
          <Section style={scoreCardOuter}>
            <Section style={scoreCardInner}>
              {/* WOD name banner */}
              <Section style={wodBanner}>
                <Text style={wodNameText}>{wodName}</Text>
              </Section>

              {/* Big score */}
              <Text style={scoreDisplay}>{displayScore}</Text>

              {/* Divider */}
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%", margin: "16px 0" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "30%", height: "1px", backgroundColor: "#333" }} />
                    <td style={{ width: "40%", textAlign: "center" as const }}>
                      <Text style={dividerText}>{medal}</Text>
                    </td>
                    <td style={{ width: "30%", height: "1px", backgroundColor: "#333" }} />
                  </tr>
                </tbody>
              </table>

              {/* Placement */}
              <Section style={placementCard}>
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" as const, width: "50%", borderRight: "1px solid #1a3a1a" }}>
                        <Text style={placementLabel}>POSICIÓN</Text>
                        <Text style={placementNumber}>#{placement}</Text>
                      </td>
                      <td style={{ textAlign: "center" as const, width: "50%" }}>
                        <Text style={placementLabel}>DE</Text>
                        <Text style={placementTotal}>{totalInDivision}</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Text style={placementSub}>EN TU DIVISIÓN</Text>
              </Section>
            </Section>
          </Section>

          {/* ===== MOTIVATION ===== */}
          <Section style={motivationSection}>
            <Text style={motivationQuote}>
              &quot;No midas tu progreso con los demás, mídelo con quien eras ayer.&quot;
            </Text>
            <Text style={motivationNote}>
              Los resultados finales se publicarán al terminar el evento.
            </Text>
          </Section>

          {/* ===== CTA ===== */}
          <Section style={ctaSection}>
            <Link href={`${appUrl}/leaderboard`} style={ctaButton}>
              VER LEADERBOARD COMPLETO
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
  backgroundColor: "#0a0a0a",
  padding: "48px 40px 20px",
  textAlign: "center" as const,
}

const logoStyle = {
  margin: "0 auto",
  borderRadius: "16px",
  border: "2px solid #FF6600",
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
  color: "#525252",
  fontSize: "10px",
  letterSpacing: "4px",
  textAlign: "center" as const,
  margin: "4px 0 0",
}

const gradientBarLeft = {
  width: "33%",
  height: "4px",
  backgroundColor: "#FF6600",
}

const gradientBarCenter = {
  width: "34%",
  height: "4px",
  backgroundColor: "#FF8533",
}

const gradientBarRight = {
  width: "33%",
  height: "4px",
  backgroundColor: "#FF6600",
}

const statusBanner = {
  backgroundColor: "#052e16",
  padding: "16px 40px",
  textAlign: "center" as const,
}

const statusIcon = {
  color: "#22c55e",
  fontSize: "24px",
  margin: "0 0 4px",
}

const statusText = {
  color: "#22c55e",
  fontSize: "14px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  margin: "0",
}

const contentSection = {
  padding: "28px 40px 8px",
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

const scoreCardOuter = {
  padding: "8px 32px 24px",
}

const scoreCardInner = {
  backgroundColor: "#111111",
  border: "2px solid #FF6600",
  borderRadius: "12px",
  overflow: "hidden" as const,
}

const wodBanner = {
  backgroundColor: "#FF6600",
  padding: "10px 20px",
  textAlign: "center" as const,
}

const wodNameText = {
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  margin: "0",
}

const scoreDisplay = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#ffffff",
  fontSize: "64px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "24px 0 0",
  lineHeight: "1",
}

const dividerText = {
  fontSize: "20px",
  margin: "0",
  lineHeight: "1",
}

const placementCard = {
  backgroundColor: "#071a0e",
  border: "1px solid #166534",
  borderRadius: "8px",
  margin: "0 20px 20px",
  padding: "16px",
}

const placementLabel = {
  color: "#86efac",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0",
}

const placementNumber = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#22c55e",
  fontSize: "36px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1.1",
}

const placementTotal = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#86efac",
  fontSize: "36px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1.1",
}

const placementSub = {
  color: "#166534",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  textAlign: "center" as const,
  margin: "8px 0 0",
}

const motivationSection = {
  padding: "0 40px 24px",
  textAlign: "center" as const,
}

const motivationQuote = {
  color: "#FF6600",
  fontSize: "14px",
  fontStyle: "italic" as const,
  lineHeight: "22px",
  margin: "0 0 8px",
}

const motivationNote = {
  color: "#525252",
  fontSize: "12px",
  margin: "0",
}

const ctaSection = {
  textAlign: "center" as const,
  padding: "0 40px 32px",
}

const ctaButton = {
  backgroundColor: "#FF6600",
  borderRadius: "8px",
  color: "#ffffff",
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
  padding: "24px 40px",
  textAlign: "center" as const,
}

const footerEvent = {
  color: "#525252",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0 0 8px",
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
