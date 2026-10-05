# OxYda2 — publicar en Hostinger

Ruta: `/oxyda2/docs/02-deploy-hostinger.md`

El sitio es estático (`output: 'static'`). Se publica el contenido de `dist/`
en la carpeta raíz del dominio `oxydados.muga.dev`.

## 1. Preparar la versión

1. Subir `version` en `package.json` siguiendo versionado semántico:
   - `0.x.Y` para correcciones;
   - `0.X.0` para cambios visibles o nuevas funciones.
2. Verificar:

   ```sh
   pnpm check
   pnpm test
   pnpm format:check
   pnpm build
   ```

3. Commit `chore: publicar la versión X.Y.Z`, tag anotado `vX.Y.Z` y push con
   `git push origin main --follow-tags`.

## 2. Generar el paquete

Desde una build limpia:

```powershell
Remove-Item -Recurse -Force dist; pnpm build
Compress-Archive -Path dist\* -DestinationPath oxyda2-vX.Y.Z.zip -Force
```

El `.zip` contiene los archivos en su raíz (sin la carpeta `dist`), incluido
`.htaccess`.

## 3. Subir

1. hPanel → Sitios web → `oxydados.muga.dev` → Administrador de archivos.
2. Abrir la carpeta raíz del dominio (`public_html` o la del subdominio).
3. Borrar el contenido anterior, en especial `_astro/`.
4. Subir el `.zip`, hacer clic derecho → Extraer en la misma carpeta y borrar
   el `.zip`.
5. Confirmar que `index.html` y `.htaccess` quedaron en la raíz (activar
   «Mostrar archivos ocultos» si no aparece `.htaccess`).

## 4. Verificar en producción

- `https://oxydados.muga.dev/` carga y el pie muestra la versión nueva.
- `http://` redirige a `https://`.
- Una dirección inexistente muestra la 404 de OxYda2.
- Un desafío se puede resolver y el progreso sigue al recargar.
- Si se ve la versión anterior, vaciar la caché de Hostinger (hPanel →
  Rendimiento → Caché) y recargar sin caché.

## `.htaccess`

Vive en `public/.htaccess` y Astro lo copia a `dist/` en cada build:

- 404 propia (`/404.html`);
- redirección a HTTPS;
- compresión de texto;
- caché: HTML revalidado, `_astro/` un año (nombres con hash), imágenes y
  fuentes un mes;
- cabeceras básicas de seguridad.
