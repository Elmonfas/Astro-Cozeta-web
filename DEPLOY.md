# Despliegue en AWS — cozeta.es

Sitio 100 % estático (Astro, sin servidor). Arquitectura: **S3 privado + CloudFront con
Origin Access Control (OAC) + ACM + Route 53**.

El bucket **no** se publica como website de S3: se mantiene privado y solo CloudFront puede
leerlo. Eso evita exponer el bucket y permite servir el 404 correctamente.

Variables usadas en los ejemplos:

```bash
DOMINIO=cozeta.es
BUCKET=cozeta-web-prod
REGION=eu-west-1          # el bucket puede estar en Europa
PERFIL=cozeta             # perfil de AWS CLI
```

---

## 0. Antes de empezar

```bash
node -v          # debe ser >= 22.12
cp .env.example .env    # y rellenar PUBLIC_FORMSPREE_ID
npm ci
npm run build
npm run preview  # comprobar en http://localhost:4321 que se ve igual que en dev
```

El contenido a subir es todo lo que hay dentro de `dist/`.

---

## 1. Certificado en ACM (obligatoriamente en us-east-1)

CloudFront solo acepta certificados de **us-east-1**, aunque el bucket esté en Europa.

```bash
aws acm request-certificate \
  --region us-east-1 \
  --domain-name "$DOMINIO" \
  --subject-alternative-names "www.$DOMINIO" \
  --validation-method DNS \
  --profile "$PERFIL"
```

Copiar los registros CNAME de validación que devuelve el comando y crearlos en Route 53. El
certificado pasa a `ISSUED` en unos minutos.

---

## 2. Bucket S3 privado

```bash
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION" \
  --profile "$PERFIL"

# Bloquear todo acceso público: el bucket solo se lee a través de CloudFront
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
      BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
  --profile "$PERFIL"
```

**No** activar «Static website hosting». Con OAC no hace falta y además obligaría a abrir el bucket.

---

## 3. Distribución de CloudFront

Crear la distribución con:

| Ajuste | Valor |
|---|---|
| Origin domain | `cozeta-web-prod.s3.eu-west-1.amazonaws.com` (el endpoint REST, no el de website) |
| Origin access | **Origin access control (OAC)**, firmando las peticiones |
| Viewer protocol policy | Redirect HTTP to HTTPS |
| Allowed methods | GET, HEAD |
| Compress objects automatically | **Sí** (activa gzip y Brotli) |
| Default root object | `index.html` |
| Alternate domain names (CNAMEs) | `cozeta.es` y `www.cozeta.es` |
| Custom SSL certificate | el emitido en el paso 1 |
| Price class | Solo Europa y Norteamérica (el público es local) |

### 3.1 Política del bucket para OAC

Al crear el OAC, la consola ofrece copiar esta política. Sustituir `ID_DISTRIBUCION` y `CUENTA`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitirLecturaSoloDesdeCloudFront",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cozeta-web-prod/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::CUENTA:distribution/ID_DISTRIBUCION"
        }
      }
    }
  ]
}
```

### 3.2 URLs con barra final (`trailingSlash: 'always'`)

El sitio se genera como `servicios/gasolineras/index.html`. S3 no resuelve solo el
`index.html` de un «directorio», así que hace falta una **CloudFront Function** en el evento
*viewer request*:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // /servicios/gasolineras/  ->  /servicios/gasolineras/index.html
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
    return request;
  }

  // /servicios/gasolineras  ->  redirección 301 a la versión con barra,
  // que es la que declara la etiqueta canonical. Sin esto habría dos URLs
  // servibles para el mismo contenido.
  if (!uri.includes('.')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: uri + '/' } }
    };
  }

  return request;
}
```

### 3.3 Página 404

Sin esto, una URL inexistente devuelve el **AccessDenied de S3** (403) en vez del 404 del sitio.
En *Error pages* de la distribución, crear las dos entradas:

| HTTP error code | Response page path | HTTP Response code | TTL |
|---|---|---|---|
| 403 | `/404.html` | 404 | 10 |
| 404 | `/404.html` | 404 | 10 |

S3 devuelve 403 (no 404) para objetos inexistentes cuando el bucket es privado: por eso hay que
mapear también el 403.

### 3.4 Redirección de www a dominio principal

Solo debe haber **una** URL canónica. `astro.config.mjs` declara `https://www.cozeta.es`, así que
la canónica es **con www** y `cozeta.es` redirige a `www.cozeta.es`.

Lo más limpio es una segunda CloudFront Function (o ampliar la del punto 3.2):

```js
var host = request.headers.host.value;
if (host === 'cozeta.es') {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: 'https://www.cozeta.es' + request.uri } }
  };
}
```

> Si se prefiere la canónica **sin** www, hay que cambiar `site` en `astro.config.mjs` e invertir
> la redirección. Lo importante es no dejar las dos accesibles.

---

## 4. Cabeceras de caché

El build de Astro pone hash en el nombre de los assets de `_astro/`, así que son inmutables.
El HTML **no** lleva hash y debe revalidarse siempre, o los usuarios verán páginas viejas.

| Contenido | `Cache-Control` |
|---|---|
| `/_astro/*` (JS y CSS con hash) | `public, max-age=31536000, immutable` |
| Imágenes, modelos `.glb`, fuentes | `public, max-age=2592000` (30 días) |
| `*.html` | `public, max-age=0, must-revalidate` |
| `sitemap*.xml`, `robots.txt` | `public, max-age=3600` |

Se aplican al subir a S3 (ver el script del punto 6).

---

## 5. Cabeceras de seguridad (Response Headers Policy)

Crear una *Response headers policy* en CloudFront y asociarla al comportamiento por defecto:

| Cabecera | Valor |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |

### Content-Security-Policy

Ajustada a lo que el sitio usa de verdad: Formspree para el formulario y Google Maps solo si el
visitante acepta cookies. Las tipografías están autoalojadas, así que **no** hace falta abrir
ningún dominio de fuentes.

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'self';
form-action 'self' https://formspree.io;
connect-src 'self' https://formspree.io;
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
font-src 'self';
img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://maps.google.com;
frame-src https://www.google.com https://maps.google.com;
upgrade-insecure-requests
```

Notas de por qué está así:

- `'unsafe-inline'` en `script-src`: Astro inserta el JSON-LD y algún script en línea. Quitarlo
  exigiría hashes por página; con un sitio estático sin entrada de usuario el riesgo es bajo.
- `blob:` en `img-src`: lo necesita `<model-viewer>` para renderizar el modelo 3D.
- `frame-src` y los dominios de Google en `img-src`: son el mapa de contacto, que solo se carga
  con consentimiento. Si algún día se retira el mapa, se pueden quitar las tres entradas.
- No hay analítica de ningún tipo, por eso no aparece ningún dominio de medición.

---

## 6. Desplegar

Script incluido en el repositorio: `./deploy.sh`. Hace build, sincroniza con las cabeceras de
caché correctas e invalida CloudFront.

```bash
./deploy.sh
```

Lo que hace por dentro:

```bash
npm run build

# 1) Assets con hash: caché de un año, inmutables
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude "*" --include "_astro/*" \
  --cache-control "public, max-age=31536000, immutable"

# 2) Resto de estáticos: 30 días
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude "_astro/*" --exclude "*.html" --exclude "*.xml" --exclude "robots.txt" \
  --cache-control "public, max-age=2592000"

# 3) HTML: nunca cachear en el navegador
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude "*" --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"

# 4) Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
```

> El orden importa: el `--delete` del primer `sync` no borra nada indebido porque cada pasada
> filtra su propio subconjunto, pero conviene no reordenarlas sin pensarlo.

---

## 7. Checklist final antes de dar por buena la producción

- [ ] `https://www.cozeta.es` carga con candado y certificado válido.
- [ ] `http://www.cozeta.es` redirige a HTTPS (301).
- [ ] `https://cozeta.es` redirige a `https://www.cozeta.es` (301).
- [ ] `https://www.cozeta.es/servicios/gasolineras` (sin barra) redirige a la versión con barra.
- [ ] Una URL inventada (`/no-existe/`) devuelve la página 404 del sitio con **código 404**, no un
      403 de S3. Comprobar con `curl -I`.
- [ ] `https://www.cozeta.es/sitemap-index.xml` accesible y con las 15 URLs.
- [ ] `https://www.cozeta.es/robots.txt` accesible y apuntando al sitemap.
- [ ] Formulario de contacto: envío real de prueba y **el correo llega a `info@cozeta.es`**.
- [ ] El aviso de cookies aparece en la primera visita y el mapa de contacto **no** carga hasta
      aceptarlo (comprobar en la pestaña Red que no hay peticiones a `google.com` antes).
- [ ] Aviso legal, privacidad y cookies enlazados desde el footer y accesibles.
- [ ] Comprobado en un móvil real: menú, botón de llamada y formulario.
- [ ] Dominio dado de alta en Google Search Console y sitemap enviado.
- [ ] PageSpeed Insights en móvil: LCP < 2,5 s, CLS < 0,1.

---

## 8. Si algo va mal

| Síntoma | Causa habitual |
|---|---|
| Todo devuelve 403 | Falta la política de bucket del OAC, o el origin apunta al endpoint de *website* en vez del REST |
| Sale la versión antigua tras desplegar | Falta invalidar CloudFront, o el HTML se subió con caché larga |
| `/servicios/` da 403 | Falta la CloudFront Function que añade `index.html` |
| El 404 sale como 403 | Falta mapear el error 403 a `/404.html` en *Error pages* |
| Las fuentes no cargan | La CSP no incluye `fonts.googleapis.com` / `fonts.gstatic.com` |
| El formulario no envía | La CSP no incluye `formspree.io` en `form-action` y `connect-src` |
