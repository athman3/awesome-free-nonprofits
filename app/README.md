# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Production SEO

Run `npm run build` from the repository root to regenerate the service data and build the site. The production build renders the existing React directory into `dist/index.html` and generates JSON-LD from the same service data. Temporary server bundles are removed before deployment; hosting remains entirely static.

The homepage hydrates its generated HTML. Search and category query URLs retain their existing client rendering so the complete directory does not flash before the selected results appear. Visible copy, layout, filters, and theme behavior stay the same.

Search entered before React loads is applied at startup while preserving focus and selection. JSON-LD is rendered by React alongside the directory, so its service list follows the visible results after navigation, searching, and filtering.

After building, run `npm --prefix app run test:seo` from the repository root to check the generated HTML, structured data, sitemap, and deployment output. These checks also run before the GitHub Pages deployment.

For browser regression checks, install Chromium with `cd app && npx playwright install chromium`, then run `npm run test:browser`. Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Google Chrome instead. The browser checks cover typing before hydration and structured data synchronization, and also run before deployment.
