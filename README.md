# Tejas Mhaske – React + Web3 portfolio

Vite + React portfolio with a browser-wallet panel (connect, balance and network, sign a hello message, optional ETH tip). No extra web3 library: it talks to `window.ethereum` (MetaMask and compatible wallets).

## Run
```bash
npm install
cp .env.example .env   # optional: set VITE_TIP_ADDRESS to enable tips
npm run dev
```
Build: `npm run build` (output in `dist/`), deploy to Vercel, Netlify or GitHub Pages.

## Edit content
Everything lives in `src/data.js` (experience, projects, skills, education). Update the repo list there as you add projects.
