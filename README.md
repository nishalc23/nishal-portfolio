# Nishal Chintalapati — The Arcade

Three interactive futuristic claw machines contain About Me, Experience, and Projects. The cabinets, glass, claw, joystick, prizes, and collection chute are implemented in HTML, CSS, SVG, and JavaScript. The scene uses a generated atmospheric background.

Click a cabinet, then an object. The claw grabs it, carries it to the drop hole, and releases a prize into the chute. Click the collected prize to open its details. The joystick cycles selections and the Grab button operates the claw. Phone tabs switch between cabinets; arrow keys cycle items; Escape returns to the overview. Reduced-motion preferences are supported.

Run `python3 -m http.server 4173` and visit http://localhost:4173. No dependencies or build step. The main branch deploys to the existing Vercel portfolio project.
