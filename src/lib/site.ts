export const site = {
  name: 'COZETA',
  // Razón social: solo para textos legales, copyright y JSON-LD.
  legalName: 'COZETA Tecnología y Construcción SL',
  // Nombre comercial: el que ve el cliente en marca, alt de logos y redes.
  tradeName: 'COZETA Instalaciones Petrolíferas',
  cif: 'B97651905',
  registryInfo: 'Registro Mercantil de Valencia, Tomo 8407, Libro 5697, Folio 43, Hoja V-112321, inscripción 1ª',
  claim: 'Instalaciones de transferencia de carburantes',
  foundedYear: 1996,
  founder: 'Luis Joaquín Cuenca',
  phone: '963808762',
  phoneDisplay: '96 380 87 62',
  email: 'info@cozeta.es',
  address: {
    line1: 'Calle 6, nave 12',
    line2: "P.I. L'Horta Vella",
    postalCode: '46117',
    city: 'Bétera',
    province: 'Valencia',
    country: 'España',
  },
  // Coordenadas tomadas de la ficha real de Google Business Profile
  // ("Cozeta Instalaciones Petroliferas", plus code HHJ6+85 Bétera).
  geo: { lat: 39.580822, lng: -0.4395272 },
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  mapsEmbedQuery: "COZETA Instalaciones Petrolíferas, Calle 6, nave 12, P.I. L'Horta Vella, 46117 Bétera, Valencia",
  social: {
    // Sin redes sociales activas por el momento.
  },
} as const;

export const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.postalCode} ${site.address.city} (${site.address.province})`;

export const team = [
  { name: 'Luis J. Cuenca', role: 'Gerente' },
  { name: 'Daniel Laínez', role: 'Ejecución' },
  { name: 'Luis Cuenca', role: 'Finanzas' },
  { name: 'Mª Ángeles Ibáñez', role: 'Proyectos' },
] as const;

export const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios/', label: 'Servicios' },
  { href: '/proyectos/', label: 'Proyectos' },
  { href: '/empresa/', label: 'Empresa' },
  { href: '/contacto/', label: 'Contacto' },
] as const;

// Páginas independientes (fuera de la lista de servicios), agrupadas en el
// desplegable "Productos" del menú. Netoil está pendiente de contenido real.
export const productLinks = [
  { href: '/payway/', label: 'PAYWAY' },
  { href: '/netoil/', label: 'Netoil' },
] as const;

export const stats = [
  { target: 30, suffix: '+', label: 'años de experiencia', icon: 'clock' },
  { target: 55, suffix: '+', label: 'estaciones realizadas', icon: 'gasolinera' },
  { target: 100, suffix: '%', label: 'instalaciones legalizadas', icon: 'shield' },
] as const;

// Se usa una sola vez, en la home (fusionado con los servicios). No repetir en /empresa/.
export const whyCozeta = [
  {
    title: 'Cumplimiento normativo',
    text: 'Proyectos y ejecución conforme a la ITC MI-IP04 y la normativa autonómica, con toda la documentación en regla desde el primer día.',
  },
  {
    title: 'Plazos que se cumplen',
    text: 'Planificamos cada obra con calendario cerrado y un único interlocutor, para que sepáis en todo momento en qué fase está vuestra instalación.',
  },
  {
    title: 'Equipo técnico propio',
    text: 'No subcontratamos la parte crítica de la obra: nuestros propios técnicos ejecutan la instalación y responden ante cualquier incidencia.',
  },
] as const;

// Marcas reales para las que hemos construido instalaciones — franja de prueba social en la home.
export const clientBrands = [
  'LOWCOST',
  'SOEX 2',
  'Autoil',
  'Benzoil',
  'Dieself',
  'Gasoprix',
  'Cooperativa Sant Josep',
] as const;
