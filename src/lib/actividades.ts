import { getCollection } from 'astro:content';

export interface Actividad {
  href: string;
  title: string;
  desc: string;
  icon: string;
}

// Las actividades en el orden de la web original. "Medios de pago" no tiene
// página dentro de /servicios/: es PAYWAY, que va aparte en /payway/.
export async function getActividades(): Promise<Actividad[]> {
  const servicios = (await getCollection('servicios')).sort((a, b) => a.data.order - b.data.order);
  const lista: (Actividad & { order: number })[] = servicios.map((s) => ({
    href: `/servicios/${s.id}/`,
    title: s.data.shortTitle,
    desc: s.data.intro,
    icon: s.data.icon,
    order: s.data.order,
  }));
  lista.push({
    href: '/payway/',
    title: 'Medios de pago',
    desc: 'Contamos con los medios de pago más rápidos y seguros del mercado.',
    icon: 'pago',
    order: 4,
  });
  return lista.sort((a, b) => a.order - b.order);
}
