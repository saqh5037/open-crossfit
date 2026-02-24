import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
  Preview,
} from "@react-email/components"

interface WelcomeEmailProps {
  athleteName: string
  participantNumber: number
  division: string
  eventName: string
  startDate: string
  endDate: string
  profileUrl: string
  appUrl: string
  isJudge?: boolean
  judgeEmail?: string
  loginUrl?: string
}

export function WelcomeEmail({
  athleteName,
  participantNumber,
  division,
  eventName,
  startDate,
  endDate,
  profileUrl,
  appUrl,
  isJudge,
  judgeEmail,
  loginUrl,
}: WelcomeEmailProps) {
  const logoUrl = `${appUrl}/logo-200.png`

  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>
        {`Bienvenido a ${eventName} — Participante #${participantNumber}`}
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

          {/* ===== ORANGE BAR ===== */}
          <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={gradientBarLeft} />
                <td style={gradientBarCenter} />
                <td style={gradientBarRight} />
              </tr>
            </tbody>
          </table>

          {/* ===== WELCOME BANNER ===== */}
          <Section style={welcomeBanner}>
            <Text style={welcomeTitle}>¡BIENVENIDO AL OPEN!</Text>
            <Text style={welcomeSub}>TU REGISTRO HA SIDO CONFIRMADO</Text>
          </Section>

          {/* ===== GREETING ===== */}
          <Section style={contentSection}>
            <Text style={greetingText}>
              Hola <strong style={{ color: "#ffffff" }}>{athleteName}</strong>,
            </Text>
            <Text style={bodyText}>
              Estás oficialmente registrado para <strong style={{ color: "#FF6600" }}>{eventName}</strong>. Prepárate para dar todo en la competencia.
            </Text>
          </Section>

          {/* ===== PARTICIPANT CARD ===== */}
          <Section style={cardOuter}>
            <Section style={participantCard}>
              {/* Number section */}
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={numberCell}>
                      <Text style={numberLabel}>PARTICIPANTE</Text>
                      <Text style={numberValue}>#{participantNumber}</Text>
                    </td>
                    <td style={dividerCell}>
                      <div style={verticalDivider} />
                    </td>
                    <td style={divisionCell}>
                      <Text style={divisionLabel}>DIVISIÓN</Text>
                      <Text style={divisionValue}>{division}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Dates */}
              {startDate && endDate && (
                <Section style={datesSection}>
                  <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "center" as const }}>
                          <Text style={datesLabel}>FECHAS DEL EVENTO</Text>
                          <Text style={datesValue}>{startDate} — {endDate}</Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>
              )}
            </Section>
          </Section>

          {/* ===== CTA ===== */}
          <Section style={ctaSection}>
            <Link href={profileUrl} style={ctaButton}>
              VER MI PERFIL Y QR
            </Link>
            <Text style={ctaNote}>
              Presenta tu QR el día del evento para un check-in rápido
            </Text>
          </Section>

          {/* ===== JUDGE SECTION ===== */}
          {isJudge && (
            <>
              <Hr style={hr} />
              <Section style={judgeOuter}>
                <Section style={judgeBannerSection}>
                  <Text style={judgeBadge}>⚖️ TAMBIÉN ERES JUEZ</Text>
                </Section>
                <Section style={contentSection}>
                  <Text style={bodyText}>
                    Podrás calificar los WODs de otros atletas directamente desde tu celular. Tu participación como juez es clave para el éxito del evento.
                  </Text>
                </Section>
                <Section style={judgeCard}>
                  <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>
                          <Text style={judgeInfoLabel}>EMAIL DE ACCESO</Text>
                          <Text style={judgeInfoValue}>{judgeEmail}</Text>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingTop: "12px" }}>
                          <Text style={judgeInfoLabel}>CONTRASEÑA</Text>
                          <Text style={judgeInfoValue}>La que elegiste al registrarte</Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>
                {loginUrl && (
                  <Section style={ctaSection}>
                    <Link href={loginUrl} style={judgeButton}>
                      INICIAR SESIÓN COMO JUEZ
                    </Link>
                  </Section>
                )}
              </Section>
            </>
          )}

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

const gradientBarLeft = { width: "33%", height: "4px", backgroundColor: "#FF6600" }
const gradientBarCenter = { width: "34%", height: "4px", backgroundColor: "#FF8533" }
const gradientBarRight = { width: "33%", height: "4px", backgroundColor: "#FF6600" }

const welcomeBanner = {
  backgroundColor: "#1a0a00",
  padding: "24px 40px",
  textAlign: "center" as const,
}

const welcomeTitle = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#FF6600",
  fontSize: "32px",
  fontWeight: "bold" as const,
  letterSpacing: "6px",
  margin: "0",
  lineHeight: "1",
}

const welcomeSub = {
  color: "#FF8533",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  margin: "8px 0 0",
}

const contentSection = {
  padding: "24px 40px 8px",
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

const participantCard = {
  backgroundColor: "#111111",
  border: "2px solid #FF6600",
  borderRadius: "12px",
  overflow: "hidden" as const,
  padding: "24px",
}

const numberCell = {
  textAlign: "center" as const,
  width: "45%",
  verticalAlign: "top" as const,
}

const dividerCell = {
  width: "10%",
  verticalAlign: "middle" as const,
  textAlign: "center" as const,
}

const verticalDivider = {
  width: "2px",
  height: "60px",
  backgroundColor: "#FF6600",
  margin: "0 auto",
}

const divisionCell = {
  textAlign: "center" as const,
  width: "45%",
  verticalAlign: "top" as const,
}

const numberLabel = {
  color: "#FF6600",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0",
}

const numberValue = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#ffffff",
  fontSize: "56px",
  fontWeight: "bold" as const,
  margin: "0",
  lineHeight: "1",
}

const divisionLabel = {
  color: "#FF6600",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0",
}

const divisionValue = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "bold" as const,
  textTransform: "uppercase" as const,
  margin: "8px 0 0",
  lineHeight: "1.3",
}

const datesSection = {
  borderTop: "1px solid #262626",
  marginTop: "20px",
  paddingTop: "16px",
}

const datesLabel = {
  color: "#FF6600",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0",
}

const datesValue = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "4px 0 0",
}

const ctaSection = {
  textAlign: "center" as const,
  padding: "0 40px 28px",
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

const ctaNote = {
  color: "#525252",
  fontSize: "11px",
  margin: "12px 0 0",
}

const hr = {
  borderColor: "#1a1a1a",
  margin: "0",
}

const judgeOuter = {
  padding: "0",
}

const judgeBannerSection = {
  backgroundColor: "#1a1a00",
  padding: "16px 40px",
  textAlign: "center" as const,
}

const judgeBadge = {
  color: "#fbbf24",
  fontSize: "13px",
  fontWeight: "bold" as const,
  letterSpacing: "3px",
  margin: "0",
}

const judgeCard = {
  backgroundColor: "#111111",
  border: "1px solid #333333",
  borderRadius: "8px",
  margin: "8px 40px 16px",
  padding: "16px 20px",
}

const judgeInfoLabel = {
  color: "#FF6600",
  fontSize: "9px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0",
}

const judgeInfoValue = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold" as const,
  margin: "2px 0 0",
}

const judgeButton = {
  backgroundColor: "#333333",
  border: "1px solid #525252",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  padding: "14px 28px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
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
