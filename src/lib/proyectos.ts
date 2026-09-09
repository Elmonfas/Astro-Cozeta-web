// Fuente única de la obra ejecutada: la usan /proyectos/ y el explorador de la
// home. Antes estaba duplicada en los dos sitios y ya empezaban a divergir.
import type { ImageMetadata } from 'astro';

import lowcost from '../assets/proyectos/lowcost.jpg';
import soex2 from '../assets/proyectos/soex2.jpg';
import autoilMuseros from '../assets/proyectos/autoil-museros.jpg';
import benzoil from '../assets/proyectos/benzoil.jpg';
import dieself from '../assets/proyectos/dieself.jpg';
import gasoprix from '../assets/proyectos/gasoprix.jpg';
import cooperativaSantJosep from '../assets/proyectos/cooperativa-sant-josep.jpg';

export interface Proyecto {
  img: ImageMetadata;
  title: string;
  tag: string;
  desc: string;
  alt: string;
}

export const proyectos: Proyecto[] = [
  {
    img: lowcost,
    title: 'Estación LOWCOST',
    tag: 'Gasolineras',
    desc: 'Construcción llave en mano de estación de servicio desatendida, con doble marquesina, isla accesible y cartelería multilingüe.',
    alt: 'Estación de servicio LOWCOST construida por COZETA, con doble marquesina blanca y surtidores desatendidos',
  },
  {
    img: soex2,
    title: 'SOEX 2',
    tag: 'Gasolineras',
    desc: 'Estación de servicio 24 horas de un solo surtidor, con tótem de precios y pago en efectivo o con tarjeta.',
    alt: 'Estación de servicio SOEX 2 de un solo surtidor con tótem de precios, ejecutada por COZETA',
  },
  {
    img: autoilMuseros,
    title: 'Autoil Lowcost Museros',
    tag: 'Gasolineras',
    desc: 'Estación de bajo coste con doble isla de repostaje y marquesina sobre pilares, en Museros (Valencia).',
    alt: 'Gasolinera Autoil Lowcost en Museros (Valencia) con doble isla de repostaje bajo marquesina',
  },
  {
    img: benzoil,
    title: 'Benzoil',
    tag: 'Gasolineras',
    desc: 'Estación de servicio con dos islas de repostaje, imagen corporativa integral y suministro 24 horas.',
    alt: 'Estación de servicio Benzoil con dos islas de repostaje e imagen corporativa en verde y blanco',
  },
  {
    img: dieself,
    title: 'Dieself',
    tag: 'Gasolineras',
    desc: 'Punto de suministro desatendido junto a nave industrial, con pago con tarjeta y efectivo las 24 horas.',
    alt: 'Punto de suministro desatendido Dieself junto a una nave industrial, con surtidor y terminal de pago',
  },
  {
    img: gasoprix,
    title: 'Gasoprix',
    tag: 'Gasolineras',
    desc: 'Estación de servicio en zona comercial, con marquesina de gran formato y tótems de precios digitales.',
    alt: 'Gasolinera Gasoprix en zona comercial, con marquesina de gran formato y tótem de precios digital',
  },
  {
    img: cooperativaSantJosep,
    title: 'Cooperativa Sant Josep',
    tag: 'Consumos propios',
    desc: 'Punto de repostaje para una cooperativa agraria, con marquesina e islas adaptadas a maquinaria y vehículos de sus socios.',
    alt: 'Punto de repostaje de la Cooperativa Sant Josep, dimensionado para maquinaria agrícola y vehículos de socios',
  },
];
