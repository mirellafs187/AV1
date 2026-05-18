# englishavatar

> Aprenda inglês com IA — conversação real, pronúncia e gamificação.

Static HTML/CSS/JS port of the `__root.tsx` TanStack Router shell.  
Runs on **GitHub Pages** (or any static host) with zero build step.

---

## File Structure

```
.
├── index.html   ← HTML shell (head meta, 404 & error pages)
├── styles.css   ← Design tokens + component styles (mirrors Tailwind theme)
├── app.js       ← Runtime: LanguageContext + hash router + page loader
└── README.md
```

---

## How it maps to `__root.tsx`

| React / TSX                         | Static equivalent                        |
|-------------------------------------|------------------------------------------|
| `<head>` meta tags                  | `<head>` in `index.html`                 |
| Google Fonts `<link>`               | `<link>` in `index.html`                 |
| `NotFoundComponent`                 | `#page-not-found` block in `index.html`  |
| `ErrorComponent` + `router.invalidate()` | `#page-error` + `btn-retry` in `app.js` |
| `LanguageProvider` / `useLanguage`  | `LanguageContext` singleton in `app.js`  |
| `QueryClientProvider` + `<Outlet />`| Hash router in `app.js`                  |
| Tailwind CSS classes                | CSS variables + classes in `styles.css`  |

---

## Adding Pages

1. Add a route entry in `app.js → routes`:
   ```js
   '/lessons': () => loadPage('lessons'),
   ```
2. Replace the `loadPage()` stub with real HTML or a web component import.

---

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Source** and pick the `main` branch / `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

Since routing is hash-based (`/#/lessons`), no server redirect config is needed.

---

## License

MIT
