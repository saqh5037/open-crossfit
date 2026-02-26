import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function PrivacidadPage() {
  const [config, session] = await Promise.all([
    prisma.eventConfig.findFirst(),
    getServerSession(authOptions),
  ])

  return (
    <>
      <Header
        registrationOpen={config?.registration_open ?? false}
        userRole={(session?.user as { role?: string } | undefined)?.role ?? null}
      />
      <main className="min-h-screen bg-black px-4 py-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Aviso de Privacidad
          </h1>

          <div className="flex flex-col gap-8 text-sm leading-relaxed text-gray-300">
            {/* Responsable */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Responsable del tratamiento de datos
              </h2>
              <p>
                <strong className="text-white">GRIZZLYS CrossFit</strong>, con domicilio en
                Av 31 395B-X 78A, Plaza Benedetta Local 12, Merida, Yucatan, C.P. 97314,
                Mexico, es responsable del tratamiento de los datos personales que nos
                proporcione, los cuales seran protegidos conforme a lo dispuesto por la Ley
                Federal de Proteccion de Datos Personales en Posesion de los Particulares
                (LFPDPPP) y demas normatividad aplicable.
              </p>
            </section>

            {/* Datos recabados */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Datos personales que recabamos
              </h2>
              <p className="mb-3">
                Para las finalidades senaladas en el presente aviso de privacidad,
                podemos recabar los siguientes datos personales:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Nombre completo</li>
                <li>Correo electronico</li>
                <li>Numero de telefono</li>
                <li>Fecha de nacimiento</li>
                <li>Genero</li>
                <li>Fotografia</li>
              </ul>
              <p className="mt-3">
                No recabamos datos personales sensibles. No recabamos datos financieros
                ni patrimoniales.
              </p>
            </section>

            {/* Finalidades */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Finalidades del tratamiento
              </h2>
              <p className="mb-3">
                Sus datos personales seran utilizados para las siguientes finalidades
                primarias, necesarias para el servicio que solicita:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Registro y participacion en el evento GRIZZLYS Open 2026</li>
                <li>Identificacion y asignacion de categoria/division deportiva</li>
                <li>Generacion de credenciales de participante</li>
                <li>Publicacion de resultados y posiciones en el leaderboard</li>
                <li>Generacion y envio de certificados de participacion</li>
                <li>Comunicacion relacionada al evento (confirmacion de scores, avisos)</li>
              </ul>
              <p className="mt-3">
                De manera adicional, sus datos podran ser utilizados para:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Difusion del evento en redes sociales y medios del box (fotografias del evento)</li>
                <li>Estadisticas internas y mejora de futuros eventos</li>
              </ul>
            </section>

            {/* Transferencias */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Transferencia de datos
              </h2>
              <p>
                Sus datos personales no seran compartidos, vendidos ni transferidos a
                terceros, salvo en los casos previstos por la ley. Unicamente utilizamos
                proveedores de servicios tecnologicos (infraestructura de servidores y
                envio de correos electronicos) que actuan bajo nuestras instrucciones y
                no tienen acceso a sus datos para fines propios.
              </p>
            </section>

            {/* Derechos ARCO */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Derechos ARCO
              </h2>
              <p className="mb-3">
                Usted tiene derecho a conocer que datos personales tenemos, para que los
                utilizamos y las condiciones de su uso (Acceso). Asimismo, es su derecho
                solicitar la correccion de su informacion personal en caso de que este
                desactualizada, sea inexacta o incompleta (Rectificacion); que la
                eliminemos de nuestros registros o bases de datos cuando considere que la
                misma no esta siendo utilizada adecuadamente (Cancelacion); asi como
                oponerse al uso de sus datos para fines especificos (Oposicion).
              </p>
              <p>
                Para ejercer cualquiera de estos derechos, puede enviar un correo
                electronico a{" "}
                <a
                  href="mailto:grizzlysmerida@gmail.com"
                  className="font-medium text-primary hover:underline"
                >
                  grizzlysmerida@gmail.com
                </a>{" "}
                o acudir directamente a nuestras instalaciones.
              </p>
            </section>

            {/* Conservación */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Conservacion de datos
              </h2>
              <p>
                Sus datos personales seran conservados durante la duracion del evento y
                un periodo razonable posterior para la emision de certificados y
                resultados finales. Una vez cumplida la finalidad, los datos seran
                eliminados de nuestros sistemas.
              </p>
            </section>

            {/* Cambios */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Cambios al aviso de privacidad
              </h2>
              <p>
                Nos reservamos el derecho de efectuar modificaciones o actualizaciones al
                presente aviso de privacidad. Cualquier cambio sera publicado en esta
                misma pagina.
              </p>
            </section>

            {/* Consentimiento */}
            <section>
              <h2 className="mb-3 text-xl uppercase tracking-wide text-primary">
                Consentimiento
              </h2>
              <p>
                Al registrarse en la plataforma GRIZZLYS Open, usted manifiesta su
                consentimiento para el tratamiento de sus datos personales conforme a lo
                descrito en el presente aviso de privacidad.
              </p>
            </section>

            {/* Fecha */}
            <section className="border-t border-gray-800 pt-6">
              <p className="text-xs text-gray-500">
                Ultima actualizacion: 26 de febrero de 2026
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
