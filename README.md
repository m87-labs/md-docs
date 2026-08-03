# Moondream Docs

Source for [docs.moondream.ai](https://docs.moondream.ai), built with
[Docusaurus](https://docusaurus.io/).

## Local development

```bash
npm ci
npm start
```

The development server runs at `http://localhost:3005`.

## Validation

```bash
npm run typecheck
npm run build
```

Merges to `main` deploy through the GitHub Pages workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
