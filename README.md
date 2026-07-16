# Kumara Vijay — 3D Portfolio (photo avatar, voice, Netlify-ready)

Your real photo on a cinematic 3D stage (Three.js voice-reactive rings,
particles, orbiting shapes) with GSAP animations. Click "Meet me" and your
avatar speaks the intro with captions.

## Deploy: GitHub → Netlify (NO terminal, NO localhost)

1. Go to github.com → sign in → New repository → name it `vj-3d-portfolio`
   → Create.
2. Click "uploading an existing file" → drag ALL files/folders from this
   project (app, components, lib, public, package.json, next.config.mjs,
   jsconfig.json, netlify.toml) → Commit.
3. Go to app.netlify.com → Add new site → Import an existing project →
   GitHub → pick `vj-3d-portfolio`. Netlify auto-detects Next.js.
   Click Deploy. ~2 minutes later your site is LIVE on a netlify.app URL.

Every time you edit a file on GitHub, Netlify redeploys automatically.

## Voice upgrades (optional, both free)

The site works immediately with the browser's built-in male voice.
Two upgrades, in order of impact:

- **EXACT lip sync with YOUR face** → heygen.com or d-id.com (free tier):
  upload the same photo, paste the greeting text, pick a male voice,
  download the video. Rename it `avatar-talking.mp4` and upload it into
  the `public` folder on GitHub. The site auto-detects it — now your
  actual photo talks with ML-perfect lip sync.
- **Natural voice only** → elevenlabs.io: generate the greeting with a
  male voice, save as `public/audio/greeting.mp3`, upload to GitHub.

## Edit
- Text/greeting: `lib/config.js`
- Your photo: replace `public/me-cutout.png` (transparent PNG)
- Colors: `app/globals.css` · Animations: `components/Hero.jsx`
