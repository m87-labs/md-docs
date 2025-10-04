# Repository Guidelines

## Project Structure & Module Organization

The site is a Docusaurus 3 project. Keep docs-focused updates in `docs/`, grouped by topic folders such as `advanced/` and `skills/`. Reusable UI pieces live in `src/components/`, while routed pages and MDX wrappers belong in `src/pages/`. Theme overrides and shared styles sit in `src/css/`. Global configuration stays in `docusaurus.config.ts`, navigation in `sidebars.ts`, and static assets in `static/`. When adding a new docs section, mirror the folder name in front matter `id` and `slug` so the sidebar remains predictable.

## Build, Test, and Development Commands

- `yarn install`: install Node dependencies; rerun when packages change.
- `yarn start`: launch the dev server with hot reload on <http://localhost:3000/>.
- `yarn build`: produce the production bundle in `build/`; run before merging structural or styling changes.
- `yarn serve`: preview the latest `build/` output locally.
- `yarn typecheck`: run the TypeScript compiler against MDX/TS sources to catch broken imports or props.
- `yarn deploy`: publish the generated site to GitHub Pages; ensure `docusaurus.config.ts` URLs are correct first.

## Coding Style & Naming Conventions

Use TypeScript and React 19 idioms: functional components, hooks, and PascalCase filenames in `src/components/`. Keep MDX headings sentence-cased and include concise intro paragraphs for placement in search. Favor 2-space indentation (default Prettier formatting) and wrap lines around 100 characters for readability. Import paths should be relative to the file unless a Docusaurus alias already exists. When adding CSS, extend selectors under `:root` tokens instead of overriding colors inline.

## Testing Guidelines

Run `yarn typecheck` before every PR and ensure `yarn build` completes cleanly; both catch most configuration regressions. For new or reorganized docs, confirm sidebar ordering locally and click through new links in `yarn start`. If you embed live code blocks, preview them in both light and dark mode. When adding interactive React components, prefer colocated unit tests beneath the component (e.g., `Example.test.tsx`) and ensure they execute via `yarn typecheck` or in a dedicated script before merging.

## Commit & Pull Request Guidelines

Follow the existing history: short, imperative summaries (e.g., “add quickstart note”). Reference related issues in the body when applicable and note any screenshot-worthy visual changes. Each PR description should list: purpose, key file touchpoints, validation steps (`yarn typecheck`, `yarn build`), and deployment impact. Request review from a docs maintainer when navigation or config files change, and include before/after screenshots for styling tweaks.
