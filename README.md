# nickgbuilds.com

My personal site. Plain HTML, CSS and JavaScript, no framework or build step.
It's self-hosted in an nginx container on my homelab, behind a Cloudflare Tunnel.

## Layout

```
public/              everything nginx serves
  index.html         home page
  about/             one folder per page, so URLs look like /about/
  contact/
  projects/
  build-log/
  css/style.css      all the styles
  js/main.js         theme toggle, mobile menu, footer year, contact form
  images/
  sitemap.xml
nginx.conf           server config (cache + security headers)
Dockerfile           copies public/ into nginx:alpine
```

## Running it locally

The pages use absolute paths (`/css/style.css`), so opening the files directly
won't work. Serve the folder instead:

```bash
python3 -m http.server 8000 -d public
```

Then open http://localhost:8000.

## Adding a build log post

1. Copy one of the folders in `public/build-log/` and rename it (the folder
   name becomes the URL).
2. Edit the title, date, status, tags and the text inside `<div class="prose">`.
3. Add a card for it at the top of `public/build-log/index.html`. The home page
   shows the 3 newest posts, so update the list in `public/index.html` too.
4. Add the URL to `public/sitemap.xml`.

Projects work the same way with `public/projects/`.

## Deploying

On the server:

```bash
git pull
docker compose up -d --build
```

The container listens on port 80 and cloudflared forwards the domain to it,
so nothing is opened on the router. On my server a local
`docker-compose.override.yml` (not in the repo) binds it to `127.0.0.1` only.

## Caching

nginx tells browsers and Cloudflare to cache CSS, JS and images for a year.
If you change `style.css` or `main.js` and the change doesn't show up, purge
the Cloudflare cache and hard refresh (Ctrl+Shift+R). HTML pages refresh
within an hour on their own.
