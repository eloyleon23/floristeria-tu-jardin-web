/**
 * Textos legales. Los de privacidad y cookies son los de la web original, que son
 * plantillas genéricas con datos de ejemplo: se han sustituido esos datos por TODO y
 * deben revisarse legalmente antes de producción (ver AUDIT_WEB_ACTUAL.md §8).
 */
export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export const PENDING = "TODO: información pendiente de confirmar";

export const legalNotice =
  "Texto heredado de la web anterior, pendiente de revisión legal antes de la publicación definitiva.";

export const privacyPolicy: LegalSection[] = [
  { title: "Quiénes somos", paragraphs: ["La dirección de nuestra web es: https://floristeriatujardin.es."] },
  { title: "Qué datos personales recogemos y por qué los recogemos" },
  {
    title: "Comentarios",
    paragraphs: [
      "Cuando los visitantes dejan comentarios en la web, recopilamos los datos que se muestran en el formulario de comentarios, así como la dirección IP del visitante y la cadena de agentes de usuario del navegador para ayudar a la detección de spam.",
      "Una cadena anónima creada a partir de tu dirección de correo electrónico (también llamada hash) puede ser proporcionada al servicio de Gravatar para ver si la estás usando. La política de privacidad del servicio Gravatar está disponible aquí: https://automattic.com/privacy/. Después de la aprobación de tu comentario, la imagen de tu perfil es visible para el público en el contexto de tu comentario.",
    ],
  },
  {
    title: "Medios",
    paragraphs: [
      "Si subes imágenes a la web, deberías evitar subir imágenes con datos de ubicación (GPS EXIF) incluidos. Los visitantes de la web pueden descargar y extraer cualquier dato de ubicación de las imágenes de la web.",
    ],
  },
  {
    title: "Formularios de contacto",
    paragraphs: [
      "El responsable del tratamiento de los datos de índole personal conforme al RGPD es:",
      `Razón social, NIF, domicilio, teléfono y correo del responsable: ${PENDING}.`,
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "Si dejas un comentario en nuestro sitio puedes elegir guardar tu nombre, dirección de correo electrónico y web en cookies. Esto es para tu comodidad, para que no tengas que volver a rellenar tus datos cuando dejes otro comentario. Estas cookies tendrán una duración de un año. Si tienes una cuenta y te conectas a este sitio, instalaremos una cookie temporal para determinar si tu navegador acepta cookies. Esta cookie no contiene datos personales y se elimina al cerrar el navegador.",
    ],
  },
  {
    title: "Contenido incrustado de otros sitios web",
    paragraphs: [
      "Los artículos de este sitio pueden incluir contenido incrustado (por ejemplo, vídeos, imágenes, artículos, etc.). El contenido incrustado de otras webs se comporta exactamente de la misma manera que si el visitante hubiera visitado la otra web. Estas web pueden recopilar datos sobre ti, utilizar cookies, incrustar un seguimiento adicional de terceros, y supervisar tu interacción con ese contenido incrustado, incluido el seguimiento de tu interacción con el contenido incrustado si tienes una cuenta y estás conectado a esa web.",
    ],
  },
  { title: "Analítica" },
  { title: "Con quién compartimos tus datos" },
  {
    title: "Cuánto tiempo conservamos tus datos",
    paragraphs: [
      "Si dejas un comentario, el comentario y sus metadatos se conservan indefinidamente. Esto es para que podamos reconocer y aprobar comentarios sucesivos automáticamente, en lugar de mantenerlos en una cola de moderación.",
    ],
  },
  {
    title: "Qué derechos tienes sobre tus datos",
    paragraphs: [
      "Si tienes una cuenta o has dejado comentarios en esta web, puedes solicitar recibir un archivo de exportación de los datos personales que tenemos sobre ti, incluyendo cualquier dato que nos hayas proporcionado. También puedes solicitar que eliminemos cualquier dato personal que tengamos sobre ti. Esto no incluye ningún dato que estemos obligados a conservar con fines administrativos, legales o de seguridad.",
    ],
  },
  {
    title: "Dónde enviamos tus datos",
    paragraphs: ["Los comentarios de los visitantes puede que los revise un servicio de detección automática de spam."],
    list: [
      "Tu información de contacto",
      "Información adicional",
      "Cómo protegemos tus datos",
      "Qué procedimientos utilizamos contra las brechas de datos",
      "De qué terceros recibimos datos",
      "Qué tipo de toma de decisiones automatizada y/o perfilado hacemos con los datos del usuario",
      "Requerimientos regulatorios de revelación de información del sector",
    ],
  },
];

export const cookiesPolicy: LegalSection[] = [
  {
    title: "Sobre nuestra política de cookies",
    paragraphs: [
      "Esta Política de cookies explica qué son las cookies y cómo las usamos. Debe leer esta política para comprender qué son las cookies, cómo las usamos, los tipos de cookies que usamos, es decir, la información que recopilamos mediante cookies y cómo se usa esa información y cómo controlar las preferencias de cookies. Para obtener más información sobre cómo usamos, almacenamos y mantenemos seguros sus datos personales, consulte nuestra Política de privacidad.",
      "En cualquier momento puede cambiar o retirar su consentimiento de la Declaración de cookies en nuestro sitio web. Obtenga más información sobre quiénes somos, cómo puede contactarnos y cómo procesamos los datos personales en nuestra Política de privacidad. Su consentimiento se aplica al dominio floristeriatujardin.es.",
    ],
  },
  {
    title: "¿Qué son las cookies?",
    paragraphs: [
      "Las cookies son pequeños archivos de texto que se utilizan para almacenar pequeños fragmentos de información. Las cookies se almacenan en su dispositivo cuando el sitio web se carga en su navegador. Estas cookies nos ayudan a hacer que el sitio web funcione correctamente, hacer que el sitio web sea más seguro, brindar una mejor experiencia de usuario y comprender cómo funciona el sitio web y analizar qué funciona y dónde necesita mejorar.",
    ],
  },
  {
    title: "¿Cómo usamos las cookies?",
    paragraphs: [
      "Como la mayoría de los servicios en línea, nuestro sitio web utiliza cookies propias y de terceros para varios propósitos. Las cookies de origen son principalmente necesarias para que el sitio web funcione correctamente y no recopilan ninguno de sus datos de identificación personal.",
      "Las cookies de terceros utilizadas en nuestros sitios web se utilizan principalmente para comprender cómo funciona el sitio web, cómo interactúa con nuestro sitio web, mantener nuestros servicios seguros, proporcionar anuncios que sean relevantes para usted y, en general, brindarle una mejor y mejor experiencia del usuario y ayudar a acelerar sus interacciones futuras con nuestro sitio web.",
    ],
  },
  {
    title: "¿Qué tipos de cookies utilizamos?",
    paragraphs: [
      "Esencial: Algunas cookies son esenciales para que pueda experimentar la funcionalidad completa de nuestro sitio. Nos permiten mantener las sesiones de los usuarios y prevenir cualquier amenaza a la seguridad. No recopilan ni almacenan ninguna información personal.",
      "Estadísticas: Estas cookies almacenan información como el número de visitantes al sitio web, el número de visitantes únicos, las páginas del sitio web que se han visitado, la fuente de la visita, etc. Estos datos nos ayudan a comprender y analizar qué tan bien funciona el sitio web y dónde necesita mejorar.",
      "Marketing: Nuestro sitio web muestra anuncios. Estas cookies se utilizan para personalizar los anuncios que le mostramos para que sean significativos para usted. Estas cookies también nos ayudan a realizar un seguimiento de la eficiencia de estas campañas publicitarias.",
      "Función: Estas son las cookies que ayudan a ciertas funcionalidades no esenciales en nuestro sitio web. Estas funcionalidades incluyen incrustar contenido como videos o compartir contenido en el sitio web en plataformas de redes sociales.",
      "Preferencias: Estas cookies nos ayudan a almacenar su configuración y preferencias de navegación, como las preferencias de idioma, para que tenga una experiencia mejor y más eficiente en futuras visitas al sitio web.",
    ],
  },
  {
    title: "¿Cómo puedo controlar las preferencias de las cookies?",
    paragraphs: [
      "Si decide cambiar sus preferencias más adelante a través de su sesión de navegación, puede hacer clic en el enlace “Configuración de cookies”. Esto mostrará el aviso de consentimiento nuevamente, lo que le permitirá cambiar sus preferencias o retirar su consentimiento por completo.",
      "Además de esto, diferentes navegadores proporcionan diferentes métodos para bloquear y eliminar las cookies utilizadas por los sitios web. Puede cambiar la configuración de su navegador para bloquear / eliminar las cookies. Para obtener más información sobre cómo administrar y eliminar cookies, visite wikipedia.org, www.allaboutcookies.org.",
    ],
  },
];

/** Aviso legal (LSSI-CE). No existía en la web original: estructura sin datos inventados. */
export const legalAdvice: LegalSection[] = [
  {
    title: "Datos identificativos",
    paragraphs: [
      "En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:",
    ],
    list: [
      `Titular / razón social: ${PENDING}`,
      `NIF/CIF: ${PENDING}`,
      "Domicilio: Plaza de la Constitución, 5 - 13170 Miguelturra (Ciudad Real)",
      "Correo electrónico: contacto@floristeriatujardin.es",
      "Teléfono: 926 24 15 23",
      `Datos registrales: ${PENDING}`,
    ],
  },
  { title: "Condiciones de uso", paragraphs: [PENDING] },
  { title: "Propiedad intelectual e industrial", paragraphs: [PENDING] },
  { title: "Legislación aplicable", paragraphs: [PENDING] },
];
