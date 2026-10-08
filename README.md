# TechStore Perú — Parcial de Desarrollo de Aplicaciones Web

Proyecto académico de demostración con **Vite + JavaScript** y **Express + API REST**. Frontend de varias rutas, catálogo desde la API, búsqueda, filtros, detalles, carrito, formulario de pedido y consulta de pedidos.

## Inicio local

Necesitas Node.js instalado.

1. Abre esta carpeta en Visual Studio Code.
2. En la terminal ejecuta `npm install`.
3. Abre una terminal y ejecuta `npm run api` (puerto 3001).
4. Abre otra terminal y ejecuta `npm run dev` (puerto 5173).
5. Visita http://localhost:5173/ . **Mantén abiertas ambas terminales.**

## Rutas

`/` inicio; `/productos` catálogo; `/producto/:id` detalle; `/ofertas` promociones; `/carrito` carrito; `/checkout` pedido de prueba; `/pedidos` registros de prueba; `/nosotros` presentación; `/contacto` consulta ilustrativa.

## Recursos API

- `GET /api` descripción y rutas
- `GET /api/productos` (parámetros: `buscar`, `categoria`, `destacados`, `ordenar`)
- `GET /api/productos/:id`
- `GET /api/categorias`
- `GET /api/promociones`
- `GET /api/clientes` (solo nombres e IDs)
- `GET /api/pedidos`
- `POST /api/pedidos` con JSON `{ "nombre":"...", "email":"...", "direccion":"...", "articulos":[{"id":1,"cantidad":2}] }`

## Publicar en Render (un solo Web Service)

Sube el proyecto (sin `node_modules` ni `dist`) a GitHub. En Render crea un **Web Service** de Node.js: Build Command `npm install && npm run build`; Start Command `npm start`. Express sirve tanto `/api/*` como el frontend compilado. Render proporciona `PORT` automáticamente y la aplicación muestra en los logs la URL pública de la API. También puedes abrir la URL pública del servicio seguida de `/api` (por ejemplo, `https://tu-servicio.onrender.com/api`). No uses el enlace `localhost` de los logs cuando estés en Render: solo funciona en el propio equipo/entorno donde corre el servidor.

## Importante

Este proyecto es una **demostración**, no una tienda comercial. El carrito se guarda en el navegador y los pedidos/clientes en memoria del servidor: **se pierden al reiniciar la aplicación o el servicio de Render**. No se manejan pagos ni se deben ingresar datos personales reales en la demo. Las imágenes son referencias de Unsplash y dependen de conexión a internet. Los nombres, características y precios son ficticios. El formulario de contacto no envía correos. No se incluye autenticación ni base de datos persistente.

## Explicación para el parcial

- La API cuenta con 5 recursos: productos, categorías, promociones, clientes y pedidos.
- El frontend obtiene el catálogo mediante `fetch('/api/productos')`, recibe JSON y lo convierte en tarjetas HTML.
- Se muestran estados de carga, errores de conexión, listas vacías y errores HTTP.
- El recurso pedidos muestra una demostración del método POST con validación de servidor.
- La interfaz usa CSS Grid, media queries, navegación con History API y eventos delegados.
- Para el informe: documenta User Persona, propuesta de valor, estructura técnica, capturas, endpoints y despliegue.
