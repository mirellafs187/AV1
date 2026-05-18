/**
 * englishavatar — app.js
 *
 * Vanilla-JS equivalent of the __root.tsx runtime:
 *   • LanguageProvider  → LanguageContext (singleton)
 *   • Simple hash-based router with 404 / error handling
 *   • "Try again" / reset logic mirroring ErrorComponent
 */

/* ============================================================
   1. Language Context  (mirrors useLanguage / LanguageProvider)
   ============================================================ */
const LanguageContext = (() => {
  const STORAGE_KEY = 'ea_language';

  let _lang = localStorage.getItem(STORAGE_KEY) || 'pt'; // default: Portuguese UI
  const _listeners = new Set();

  return {
    get language() { return _lang; },

    setLanguage(lang) {
      _lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      _listeners.forEach(fn => fn(lang));
    },

    subscribe(fn)   { _listeners.add(fn);    return () => _listeners.delete(fn); },
  };
})();

/* ============================================================
   2. Minimal Router  (mirrors TanStack Router outlet / notFound / error)
   ============================================================ */
const Router = (() => {
  /** Map of path → async loader function.
   *  Add your real page loaders here as the app grows. */
  const routes = {
    '/':        () => loadPage('home'),
    // '/lessons': () => loadPage('lessons'),
    // '/practice':() => loadPage('practice'),
  };

  /** Renders HTML into #app.  Replace with real page components. */
  async function loadPage(name) {
    // In a real build this would import a JS module / web-component.
    // For now we just show a placeholder so the shell works end-to-end.
    document.getElementById('app').innerHTML = `
      <main style="display:flex;min-height:100vh;align-items:center;
                   justify-content:center;font-family:'Sora',sans-serif;">
        <div style="text-align:center">
          <h1 style="font-size:2rem;font-weight:700;margin-bottom:.5rem">
            englishavatar
          </h1>
          <p style="color:#71717a;font-size:.9rem">
            Page: <strong>${name}</strong> — add your component here.
          </p>
        </div>
      </main>`;
  }

  /** Show the static 404 block that lives in index.html */
  function show404() {
    document.getElementById('app').innerHTML =
      document.getElementById('page-not-found').outerHTML.replace(' hidden', '');
  }

  /** Show the static error block */
  function showError(err) {
    console.error('[Router]', err);
    document.getElementById('app').innerHTML =
      document.getElementById('page-error').outerHTML.replace(' hidden', '');

    // Wire up "Try again"
    document.getElementById('btn-retry')?.addEventListener('click', () => navigate(location.hash || '/'));
  }

  /** Navigate to a path (hash-based for zero-config GitHub Pages) */
  async function navigate(path) {
    // Strip leading # if using hash routing
    const clean = path.startsWith('#') ? path.slice(1) : path;
    const handler = routes[clean] ?? routes[clean.split('?')[0]];

    if (!handler) { show404(); return; }

    try {
      await handler();
    } catch (err) {
      showError(err);
    }
  }

  return { navigate, show404, showError };
})();

/* ============================================================
   3. Boot
   ============================================================ */
(function boot() {
  // Hash-based routing works on GitHub Pages without a server redirect.
  const getPath = () => location.hash.replace(/^#/, '') || '/';

  window.addEventListener('hashchange', () => Router.navigate(getPath()));
  window.addEventListener('load',       () => Router.navigate(getPath()));

  // Expose context globally so page modules can read / set language.
  window.LanguageContext = LanguageContext;
})();
