# Namewright

A strategic brand naming engine powered by AI, linguistic science, phonosemantics, and multi-track creative methodology.

**Live at:** [namewright.xyz](https://namewright.xyz)

## How It Works

Namewright guides you through a professional 5-phase naming process:

1. **Strategic Briefing** — Establishes the strategic foundation using the Diamond framework
2. **Territory Mapping** — Analyzes the competitive naming landscape to find white space
3. **Name Generation** — Produces 18-24 candidates across three independent creative tracks
4. **Evaluation** — Scores names using SMILE and SCRATCH frameworks
5. **Shortlist & Refinement** — Presents finalists in real-world context with decision guidance

## BYO API Key

Namewright runs entirely in the browser. You bring your own (free) API key from one of four supported providers:

| Provider | Free Tier | Best Model |
|----------|-----------|------------|
| [Groq](https://console.groq.com/keys) | Generous free tier | Llama 3.3 70B |
| [Together.ai](https://api.together.xyz/settings/api-keys) | Free credits on signup | Llama 3.3 70B |
| [OpenRouter](https://openrouter.ai/keys) | Some models free forever | Llama 3.3 70B |
| [Google AI Studio](https://aistudio.google.com/app/apikey) | Free tier | Gemini 2.0 Flash |

Your API key never leaves your browser — it's sent directly to the provider and is not stored.

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

The `dist/` folder is a static site ready for deployment to Vercel, Netlify, or any static host.

### Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Vercel auto-detects Vite — click Deploy
4. Add your custom domain in Settings → Domains

### Connect Dynadot Domain

1. In Vercel → project → Settings → Domains → add `namewright.xyz`
2. Copy the nameservers Vercel provides
3. In Dynadot → My Domains → `namewright.xyz` → DNS Settings → Name Servers
4. Paste Vercel nameservers → Save
5. Wait 10-30 min for propagation. SSL is automatic.

## Tech Stack

- React 18 + Vite
- Zero dependencies beyond React
- Runs 100% client-side (no backend)
- Multi-provider AI support (OpenAI-compatible + Google Gemini)

## License

MIT
