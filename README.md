# Nishal Chintalapati — Neon Archive

Three interactive computer terminals on a modeled nighttime street. Click a terminal to smoothly zoom into its screen and open a file browser. About, Experience and Projects folders contain 13 files with scrollable detail windows. Back to street returns to the overview. Mobile layouts and reduced motion are supported.

The scene uses solid cherry-red housings, recessed screens, keyboards and neon signs. The pavement is matte; there is no mirrored floor or claw interaction.

Run locally with `python3 -m http.server 4173`.

Rebuild `src/scene.js` with Three.js 0.186.1 and esbuild 0.28.2:

```
npx esbuild src/scene.js --bundle --format=esm --minify --outfile=assets/scene.js
```

The connected main branch deploys the repository root to Vercel without a build step.
