import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
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
  isJudge,
  judgeEmail,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        {`Bienvenido a ${eventName} — Participante #${participantNumber}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>GRIZZLYS</Heading>
          <Text style={title}>¡Bienvenido al Open!</Text>

          <Text style={text}>
            Hola <strong>{athleteName}</strong>,
          </Text>
          <Text style={text}>
            Tu registro para <strong>{eventName}</strong> ha sido confirmado.
          </Text>

          <Section style={infoBox}>
            <Text style={infoLabel}>Número de participante</Text>
            <Text style={infoValue}>#{participantNumber}</Text>
            <Text style={infoLabel}>División</Text>
            <Text style={infoValue}>{division}</Text>
            {startDate && endDate && (
              <>
                <Text style={infoLabel}>Fechas</Text>
                <Text style={infoValue}>
                  {startDate} — {endDate}
                </Text>
              </>
            )}
          </Section>

          <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
            <Link href={profileUrl} style={button}>
              Ver mi perfil y QR
            </Link>
          </Section>

          {isJudge && (
            <>
              <Hr style={hr} />
              <Text style={text}>
                También te registraste como <strong>juez</strong>. Podrás
                calificar WODs de otros atletas desde tu celular.
              </Text>
              <Section style={infoBox}>
                <Text style={infoLabel}>Email de acceso</Text>
                <Text style={infoValue}>{judgeEmail}</Text>
                <Text style={{ ...infoLabel, marginTop: "4px" }}>
                  Contraseña
                </Text>
                <Text style={infoValue}>La que elegiste al registrarte</Text>
              </Section>
              {loginUrl && (
                <Section style={{ textAlign: "center" as const, margin: "16px 0" }}>
                  <Link href={loginUrl} style={{ ...button, backgroundColor: "#374151" }}>
                    Iniciar sesión como juez
                  </Link>
                </Section>
              )}
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            GRIZZLYS — Entrenamiento funcional en Mérida
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
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
  color: "#fff",
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

const infoBox = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
}

const infoLabel = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
}

const infoValue = {
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "2px 0 12px",
}

const button = {
  backgroundColor: "#DC2626",
  borderRadius: "8px",
  color: "#fff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold" as const,
  padding: "12px 24px",
  textDecoration: "none",
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
