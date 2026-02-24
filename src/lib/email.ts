import { getResend, FROM_EMAIL } from "@/lib/resend"
import { render } from "@react-email/components"
import type { ReactElement } from "react"

interface SendEmailParams {
  to: string
  subject: string
  react: ReactElement
  attachments?: { filename: string; content: Buffer }[]
}

export async function sendEmail({ to, subject, react, attachments }: SendEmailParams) {
  try {
    const resend = getResend()
    const html = await render(react)
    const { data, error } = await resend.emails.send({
      from: `GRIZZLYS Open <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Email error:", error)
    return { success: false, error }
  }
}

export async function sendEmailBatch(
  emails: SendEmailParams[],
  onProgress?: (sent: number, total: number) => void
) {
  const results: { to: string; success: boolean; error?: unknown }[] = []

  for (let i = 0; i < emails.length; i++) {
    const result = await sendEmail(emails[i])
    results.push({ to: emails[i].to, ...result })

    onProgress?.(i + 1, emails.length)

    // Rate limit: 500ms between sends = max 2/second
    if (i < emails.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return results
}
