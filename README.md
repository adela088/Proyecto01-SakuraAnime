# SakuraAnime

Aplicación web para explorar anime y manga, consultar sus detalles y guardar favoritos. El catálogo usa **Kitsu** para anime y manga, y muestra las películas de Studio Ghibli desde su API aparte.

## Funcionalidades

- Catálogo de anime y manga con búsqueda, filtros por estado y paginación.
- Detalles de cada título obtenidos desde Kitsu.
- Catálogo independiente de películas de Studio Ghibli.
- Favoritos persistidos localmente en el navegador.
- Tema claro/oscuro, diseño responsive y formulario de contacto validado.
- Modal con patrones oscuros intencionales como ejercicio explicativo.

## Tecnologías

- React 19, TypeScript y Vite
- React Router
- Tailwind CSS

## APIs

- [Kitsu API](https://kitsu.io/api/edge): catálogo y detalles de anime y manga.
- [Studio Ghibli API](https://ghibliapi.vercel.app): catálogo de películas.

Las APIs se consultan desde el navegador y no requieren una clave propia. Su disponibilidad depende de la conexión de red.

## Requisitos

- Node.js **20.19+** o **22.12+**
- [pnpm](https://pnpm.io/installation)

## Instalación y desarrollo

```bash
git clone <URL_DEL_REPOSITORIO>
cd SakuraAnime
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Si pnpm bloquea scripts de instalación de dependencias, ejecuta `pnpm approve-builds` y autoriza solo los paquetes que pnpm indique.

## Validación y compilación

```bash
pnpm lint
pnpm build
pnpm preview
```

`pnpm lint` ejecuta la verificación de tipos de TypeScript. `pnpm preview` sirve localmente la compilación de producción.

## Rutas principales

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/explorar` | Catálogo de anime y manga |
| `/anime/:id` | Detalle de anime |
| `/manga/:id` | Detalle de manga |
| `/favoritos` | Lista de favoritos |
| `/contacto` | Formulario de contacto |

## Despliegue

El proyecto puede desplegarse desde vercel en: https://proyecto01-sakura-anime.vercel.app/
