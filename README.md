# Nishal Chintalapati — Neon Arcade

A Three.js portfolio with three red, physically modeled claw cabinets on a modeled nighttime street. The camera starts across the road and smoothly moves into the selected machine. Back returns to the street overview.

Cabinets, glass, metal hardware, controls, claws, and distinct collectible objects are real 3D geometry. The environment uses modeled pavement, a canopy, slatted walls and distant buildings, with ground reflections and restrained bloom. Click an object to operate the claw; click its prize chute to open the details. Arrow keys and Enter also operate a selected machine. Mobile tabs switch machines, and reduced-motion preferences are supported.

Run locally with `python3 -m http.server 4173` and visit http://localhost:4173. No runtime network dependencies: Three.js and its helpers are bundled into assets/scene.js.

To rebuild after changing src/scene.js:

```
npm install --no-save three@0.186.1 esbuild@0.28.2
npx esbuild src/scene.js --bundle --format=esm --minify --outfile=assets/scene.js
```

The connected main branch deploys the repository root to Vercel without a build step.
