# WM Diagnostics — installable web app (PWA)

A mobile-first, offline-first progressive web app. HTML5 + vanilla JavaScript +
a compiled Tailwind CSS build. No framework, no bundler, no runtime dependencies,
no network calls. Installs to the home screen on Android and iOS.

Total size: **~250 KB**, all of it cached on first visit.

---

## What's in it

### Must-have

| Feature | Notes |
|---|---|
| **Installable** | Web app manifest, maskable icons, `standalone` display, app shortcuts |
| **Works offline** | Service worker precaches every file on first load; nothing is fetched after |
| **Instant search** | Matches code, cause, checks and fix — in both English and Sinhala at once |
| **Category filters** | Water, drain, door, motor, heating, sensors, balance, electrical, PCB |
| **Model filter** | Narrows the grid by drum type and stamps the model onto the job report |
| **Fault detail sheet** | Cause → things to check → usual fix, in a thumb-reachable bottom sheet |
| **Bilingual EN / සිංහල** | One tap, applies everywhere, remembered between sessions |
| **Technician checklist** | Persists, shows progress, one-tap reset between jobs |
| **Common faults panel** | No power / no drain / vibration / no heating |
| **Mobile-first layout** | 44–52 px touch targets, safe-area insets, no horizontal scroll, one-handed reach |
| **Accessible** | Semantic landmarks, ARIA states, visible focus rings, reduced-motion support, AA contrast |
| **Safety disclaimer** | Independence and "verify against the service manual" stated in-app |

### Nice-to-have

| Feature | Notes |
|---|---|
| **Pinned codes** | Star the ones you hit every week; they sit at the top |
| **Recently viewed** | Last 12 codes, auto-tracked |
| **Add your own codes** | Full create / edit / delete, stored on the device — no redeploy needed |
| **Share & copy** | Native share sheet via Web Share API, clipboard fallback |
| **Job report** | Customer, serial, selected code, checklist state and notes → one share action to WhatsApp/SMS/email |
| **Dark mode** | System / light / dark |
| **Text size control** | Four steps, for reading in a dim service bay |
| **Optional PIN lock** | Off by default. Honest about what it is — see below |
| **Backup & restore** | Export everything to a JSON file, restore on a new phone |
| **Update notification** | Toast with a reload button when a new version is deployed |
| **Offline indicator** | Amber bar when the device loses signal |
| **Android back button** | Closes the open sheet instead of leaving the app |
| **Haptics** | Short vibration on taps, where supported |
| **No-flash theming** | Theme applied before first paint |

### About the PIN lock

It's stored in `localStorage` and checked in JavaScript, so anyone who can open
devtools or clear site data gets past it. The app says so plainly in Settings. It
stops a customer idly poking at your phone; it is not access control. Real
per-technician access needs a server, which would also break the offline guarantee.

---

## Hosting it

A PWA must be served over **HTTPS** (or `localhost`) or the service worker won't
register and the install prompt won't appear. Opening `index.html` from the file
system will show the UI but won't install.

### GitHub Pages — free, and you already use it

1. Create a repo, e.g. `wm-diagnostics`.
2. Upload the contents of this folder to the repo root (`index.html` at the top level).
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
4. A minute later it's live at `https://<your-username>.github.io/wm-diagnostics/`.
5. Open it on a phone. Chrome shows an install banner; on iPhone use
   Safari → Share → *Add to Home Screen*.

Because `start_url` and `scope` are relative (`.`), it works from a subfolder like
this with no edits. If you later move it to a custom domain, nothing needs changing.

### Local testing

```bash
cd wm-diagnostics-pwa
python3 -m http.server 8080
# then open http://localhost:8080
```

`localhost` counts as a secure context, so installation works there too.

---

## Maintaining it

### Editing the fault codes

Everything lives in `assets/data.js` — a plain array. Add, edit or remove entries
and the whole UI rebuilds itself. The file is commented.

**Two things still need your input:**

- The `load` field is `"any"` on nearly every code, because the original dashboard
  never recorded model applicability. Until you set `"top"` or `"front"` per code
  from the service manuals, the model filter shows everything for every model.
- Verify each meaning. `OE`, `UE`, `de`, `LE` and `CL` follow other manufacturers'
  conventions, and `E1`–`E8` mean different things on different control boards. A
  wrong meaning sends a technician to replace the wrong part.

Technicians can also add their own codes in-app without you redeploying — useful
for capturing what they find in the field, and worth harvesting back into
`data.js` periodically.

### Deploying a change

**Bump the cache name in `sw.js`** every single time you change any file:

```js
const CACHE = 'wmdiag-v1.0.1';   // was v1.0.0
```

Skip this and phones keep serving the old cached copy forever. Also bump
`APP_VERSION` at the top of `assets/app.js` so the version shown in Settings
matches. Installed users get a toast with a reload button the next time they open
the app online.

### Rebuilding the CSS

The stylesheet is pre-built and committed, so you only need this if you change
classes in the HTML or JS:

```bash
npm install -D tailwindcss@3
npx tailwindcss -i src/input.css -o assets/app.css --minify
```

`tailwind.config.js` and `src/input.css` are included.

---

## Known limits

- **iOS**: no install banner (Safari requires the manual Share → Add to Home Screen
  route — the app detects iOS and explains it), no Web Share Target, no push. Each
  iOS home-screen app gets its own storage, so a backup exported from Safari won't
  appear in the installed app.
- **Storage is per-device and per-origin.** Clearing site data wipes custom codes,
  pins and notes. That's why Export backup exists.
- **A PWA can't be listed on the Play Store as-is.** If you still want a Play
  listing, the same URL can be wrapped as a Trusted Web Activity (Bubblewrap), which
  needs a verified domain — but that's a separate piece of work from the native
  WebView build.

---

## Files

```
index.html                 app shell and markup
assets/app.css             compiled Tailwind (purged, minified)
assets/app.js              all application logic
assets/data.js             the fault-code dataset — edit this
manifest.webmanifest       install metadata
sw.js                      offline cache — bump CACHE on every deploy
icons/                     192/512 standard + maskable, apple-touch, favicon
src/input.css              Tailwind source (only needed to rebuild)
tailwind.config.js         Tailwind config (only needed to rebuild)
```
