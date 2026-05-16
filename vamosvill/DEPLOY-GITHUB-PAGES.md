# GitHub Pages – VAMOSVILL

A GitHub Pages **csak a build kimenetét** szolgálja ki (statikus HTML, JS, CSS). Ne tölts fel `src/` mappát vagy forráskódot – a workflow automatikusan buildel és deployol.

## `npm error Missing script: "build:pages"`

1. **Jó mappa:** A parancsot ott futtasd, ahol a `package.json` van (a `scripts` szekcióban kell lennie: `"build:pages": "node scripts/build-pages.mjs"`). Ha a repo gyökere `vamosvill`, ne a szülő `VAMOSVILL` mappából.
2. **Helyes parancs:** `npm run build:pages` (kettőspont után **nincs** szóköz).
3. **Hiányzó fájlok a GitHubon:** Pushold a `package.json`-t, a `scripts/build-pages.mjs` és `scripts/gh-pages-postbuild.mjs` fájlokat, a `vite.config.ts` GitHub Pages részeit, és a `.github/workflows/deploy.yml`-t – különben a CI és a helyi clone is hibázik.

## Beállítás (egyszer)

1. Nyisd meg a repo **Settings → Pages** menüpontját.
2. **Build and deployment → Source**: válaszd a **GitHub Actions** opciót (ne „Deploy from a branch”).
3. Pushold a `main` (vagy `master`) ágat – a **Deploy to GitHub Pages** workflow lefut.

## Éles URL

https://ungvarymajor.github.io/vamosvill/

## Mit deployol a workflow?

A feltöltött artifact a `dist/client` mappa **tartalma** (a mappa maga nem). A projekt-oldal URL-je `username.github.io/REPO/`, ezért az artifact gyökerén kell lennie:

| Fájl / mappa | Szerep |
|--------------|--------|
| `index.html` | Főoldal → `/vamosvill/` |
| `404.html` | SPA fallback (ugyanaz, mint az index) |
| `.nojekyll` | Jekyll kikapcsolása |
| `assets/` | JS, CSS, képek (a HTML `/vamosvill/assets/...` útvonalakat használ) |

A Vite `base: '/vamosvill/'` beállítás miatt az asset URL-ek abszolút útvonalak (`/vamosvill/assets/...`) – ez helyes a projekt-oldalhoz.

## Helyi ellenőrzés

```bash
npm ci
npm run build:pages
```

Sikeres build után:

```bash
dir dist\client
# index.html, 404.html, .nojekyll, assets\ kell legyen

npx vite preview --outDir dist/client --base /vamosvill/
```

A böngészőben: http://localhost:4173/vamosvill/

## Gyakori 404 okok és megoldások

### 1. Pages forrás nem GitHub Actions

**Tünet:** 404, a böngésző „HTML fájlt keres”.

**Megoldás:** Settings → Pages → Source: **GitHub Actions**. Ne használj „Deploy from a branch” + `main` / `/(root)` beállítást – akkor a repo forráskódja kerül ki, nem a build.

### 2. A workflow nem futott vagy elbukott

**Ellenőrzés:** Repo → **Actions** → „Deploy to GitHub Pages”.

- Nincs futás → a `.github/workflows/deploy.yml` nincs a **repo gyökerében**, vagy még nem pusholtad.
- Piros X → nyisd meg a logot; gyakori: `npm ci` hiba, hiányzó `index.html` (prerender nem futott).

### 3. A workflow rossz mappában van

A GitHub **csak** a repo gyökerében lévő `.github/workflows/*.yml` fájlokat futtatja.

Ha a GitHub repo így néz ki:

```
vamosvill/
  pixel-perfect-playground-main/
    .github/workflows/deploy.yml   ← NEM fut le így!
```

**Megoldás:** A repo gyökerébe kell kerülnie a projekt fájljainak (package.json, src, .github a gyökérben), vagy állíts be `defaults.run.working-directory` a workflow-ban.

### 4. Hiányzó `index.html` a buildben

**Tünet:** A „Verify Pages artifact” lépés vagy a helyi `build:pages` hibával leáll.

**Ok:** `GITHUB_PAGES` nélkül futott a build (nincs prerender).

**Megoldás:** Mindig `npm run build:pages` parancsot használj (beállítja a környezeti változót). CI-ben a workflow ezt hívja.

### 5. Rossz artifact útvonal

A workflow feltölti: `path: dist/client` – **nem** `dist`, **nem** `dist/client/client`.

### 6. Repo név / base eltérés

A Vite base: `/vamosvill/` – a GitHub repo neve legyen **`vamosvill`** (kisbetű), különben az URL és az asset útvonalak nem egyeznek.

### 7. Cache / régi deploy

Settings → Pages alatt nézd meg az utolsó deploy időpontját. Újra: push `main`-re, vagy Actions → workflow → **Run workflow**.

## Push utáni ellenőrzőlista

1. [ ] Settings → Pages → Source = **GitHub Actions**
2. [ ] Actions: zöld „Deploy to GitHub Pages” futás
3. [ ] Deploy log: „Verify Pages artifact” OK
4. [ ] https://ungvarymajor.github.io/vamosvill/ betölt (hard refresh: Ctrl+F5)

## Fontos

- A projekt alapútvonala: `/vamosvill/` (`build:pages` beállítja a `GITHUB_PAGES` env-et).
- A `404.html` az `index.html` másolata (SPA fallback GitHub Pages-en).
- Cloudflare / Lovable deploy továbbra is a normál `npm run build` parancsot használja (worker, nem Pages).
