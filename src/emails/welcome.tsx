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
        <Container style={container}>
          {/* Header with logo */}
          <Section style={headerSection}>
            <Img
              src={logoUrl}
              alt="GRIZZLYS"
              width="80"
              height="80"
              style={logo}
            />
            <Text style={brandName}>GRIZZLYS</Text>
            <Text style={brandSub}>EST. 2021 — MÉRIDA</Text>
          </Section>

          {/* Orange accent bar */}
          <Section style={accentBar} />

          {/* Welcome message */}
          <Text style={title}>¡BIENVENIDO AL OPEN!</Text>

          <Text style={text}>
            Hola <strong style={{ color: "#fff" }}>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            Tu registro para <strong style={{ color: "#FF6600" }}>{eventName}</strong> ha sido confirmado. Prepárate para dar todo.
          </Text>

          {/* Participant info card */}
          <Section style={infoCard}>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={infoCell}>
                    <Text style={infoLabel}>PARTICIPANTE</Text>
                    <Text style={infoNumber}>#{participantNumber}</Text>
                  </td>
                  <td style={infoDivider} />
                  <td style={infoCell}>
                    <Text style={infoLabel}>DIVISIÓN</Text>
                    <Text style={infoDivisionValue}>{division}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
            {startDate && endDate && (
              <Section style={dateSection}>
                <Text style={dateLabel}>FECHAS DEL EVENTO</Text>
                <Text style={dateValue}>
                  {startDate} — {endDate}
                </Text>
              </Section>
            )}
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Link href={profileUrl} style={ctaButton}>
              VER MI PERFIL Y QR
            </Link>
          </Section>

          {/* Judge section */}
          {isJudge && (
            <>
              <Hr style={hr} />
              <Section style={judgeSection}>
                <Text style={judgeBadge}>JUEZ</Text>
                <Text style={text}>
                  También te registraste como juez. Podrás calificar WODs de otros atletas desde tu celular.
                </Text>
                <Section style={judgeInfoBox}>
                  <Text style={infoLabel}>ACCESO</Text>
                  <Text style={{ ...text, color: "#fff", margin: "4px 0 0" }}>
                    {judgeEmail}
                  </Text>
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

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footerText}>
              GRIZZLYS — Entrenamiento funcional en Mérida
            </Text>
            <Text style={footerAddress}>
              AV 31 395B-X 78A, Plaza Benedetta, Local 12
            </Text>
            <table cellPadding="0" cellSpacing="0" style={{ margin: "8px auto" }}>
              <tbody>
                <tr>
                  <td>
                    <Link href="https://instagram.com/grizzlysmerida" style={socialLink}>
                      @grizzlysmerida
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
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
  borderRadius: "0px",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
}

const headerSection = {
  backgroundColor: "#0a0a0a",
  padding: "40px 32px 16px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
  borderRadius: "12px",
}

const brandName = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#FF6600",
  fontSize: "36px",
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

const accentBar = {
  backgroundColor: "#FF6600",
  height: "3px",
  margin: "0 32px",
}

const title = {
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  color: "#fff",
  fontSize: "28px",
  fontWeight: "bold" as const,
  letterSpacing: "4px",
  textAlign: "center" as const,
  margin: "24px 32px 16px",
}

const text = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 32px",
}

const infoCard = {
  backgroundColor: "#111",
  border: "1px solid #262626",
  borderRadius: "8px",
  margin: "20px 32px",
  padding: "20px",
}

const infoCell = {
  textAlign: "center" as const,
  width: "48%",
  verticalAlign: "top" as const,
}

const infoDivider = {
  width: "4%",
  backgroundColor: "#FF6600",
  verticalAlign: "middle" as const,
}

const infoLabel = {
  color: "#FF6600",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "0",
}

const infoNumber = {
  color: "#fff",
  fontSize: "42px",
  fontWeight: "bold" as const,
  fontFamily: '"Bebas Neue", Impact, "Arial Black", sans-serif',
  margin: "4px 0 0",
  lineHeight: "1",
}

const infoDivisionValue = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "8px 0 0",
  textTransform: "uppercase" as const,
}

const dateSection = {
  borderTop: "1px solid #262626",
  marginTop: "16px",
  paddingTop: "16px",
  textAlign: "center" as const,
}

const dateLabel = {
  color: "#FF6600",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0",
}

const dateValue = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "4px 0 0",
}

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 32px",
}

const ctaButton = {
  backgroundColor: "#FF6600",
  borderRadius: "6px",
  color: "#fff",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  padding: "14px 32px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
}

const hr = {
  borderColor: "#1a1a1a",
  margin: "0 32px",
}

const judgeSection = {
  padding: "16px 0",
}

const judgeBadge = {
  backgroundColor: "#FF6600",
  color: "#fff",
  fontSize: "10px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  padding: "4px 12px",
  borderRadius: "4px",
  display: "inline-block",
  margin: "0 32px 8px",
}

const judgeInfoBox = {
  backgroundColor: "#111",
  border: "1px solid #262626",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "12px 32px",
}

const judgeButton = {
  backgroundColor: "#262626",
  border: "1px solid #404040",
  borderRadius: "6px",
  color: "#fff",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: "bold" as const,
  letterSpacing: "1px",
  padding: "12px 24px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
}

const footerSection = {
  padding: "24px 32px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#525252",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0",
}

const footerAddress = {
  color: "#404040",
  fontSize: "10px",
  margin: "4px 0 0",
}

const socialLink = {
  color: "#FF6600",
  fontSize: "11px",
  textDecoration: "none",
}
