# Prompt para Claude Code — visor 3D del terminal PAYWAY

He añadido al proyecto dos archivos:

- `public/models/payway-classic.glb` — modelo 3D del terminal de pago desatendido PAYWAY Classic (glTF binario, ~160 KB).
- `public/images/payway-poster.png` — imagen estática del modelo (fondo transparente) para usar como poster mientras carga y como fallback.

Quiero mostrar el modelo en 3D interactivo en la web usando `<model-viewer>` (Google). Haz lo siguiente:

## 1. Componente `src/components/PaywayViewer.astro`

```astro
---
interface Props { class?: string; height?: string }
const { class: cls = "", height = "520px" } = Astro.props;
---
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>

<model-viewer
  class={cls}
  src="/models/payway-classic.glb"
  poster="/images/payway-poster.png"
  alt="Terminal de pago desatendido PAYWAY Classic"
  camera-controls
  auto-rotate
  auto-rotate-delay="1500"
  rotation-per-second="20deg"
  camera-orbit="-25deg 82deg 1.1m"
  min-camera-orbit="auto 60deg auto"
  max-camera-orbit="auto 100deg auto"
  field-of-view="28deg"
  shadow-intensity="1"
  shadow-softness="0.8"
  exposure="1.05"
  environment-image="neutral"
  interaction-prompt="auto"
  loading="lazy"
  style={`width:100%; height:${height}; background:transparent; --poster-color: transparent;`}
></model-viewer>
```

## 2. Dónde usarlo

- En `/servicios/medios-de-pago/`: sustituye la imagen del hero por `<PaywayViewer />` a la derecha del texto (grid de dos columnas en escritorio, apilado en móvil con `height="380px"`). Debajo del visor, un texto pequeño en gris: "Arrastra para girar el equipo".
- En la home, en el bloque de "Medios de pago" / pago desatendido, usa `<PaywayViewer height="420px" />` con el título "Pago desatendido PAYWAY", el texto "Aceptador de pagos en caja de acero inoxidable, diseñado para trabajar ininterrumpidamente de forma intensiva." y un enlace a la página de medios de pago.

## 3. Detalles

- Carga el script de `model-viewer` una sola vez por página (si el componente se usa dos veces, no dupliques el `<script>`; muévelo al layout o usa `is:inline` con comprobación).
- Si el navegador no soporta WebGL o falla la carga, `model-viewer` muestra el poster; asegúrate de que el poster se vea bien centrado.
- Comprueba que el `.glb` se sirve con `Content-Type: model/gltf-binary` en `npm run preview`.
- Ejecuta `npm run build` y verifica que no hay errores.
