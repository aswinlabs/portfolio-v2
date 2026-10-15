# AswinOS

> Warning: System stability not guaranteed.

AswinOS is a retro-futuristic developer portfolio built with Next.js, presented as an unstable operating system running on the edge of collapse.

Behind the glitches, terminal windows, and strange system behavior is a portfolio showcasing my work, projects, and experiments in software engineering, AI, and interactive experiences.

## Features

- Simulated operating system environment
- AI-powered behavioral engine
- Interactive terminal-style experiences
- Project and portfolio showcase
- Retro-inspired visual design
- Built with Next.js and TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Chat setup

Set both `GROQ_API_KEY` and `GROQ_MODEL` in `.env.local`.
There is no default model: use an exact model ID available to your provider account.
If that model supports reasoning effort, optionally set `GROQ_REASONING_EFFORT`
to a value it accepts. Keep API keys on the server.
Alternatively, set both `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`;
OpenRouter takes priority when both providers are configured.

For Vercel, configure these variables for the Production environment and
redeploy. Local `.env` files do not update the deployment's environment.
An upstream 401 means the selected provider rejected the API key; 404 means
the configured model is unavailable or inaccessible; 429 indicates a rate or quota limit.
Use the provider's current model list to choose an accessible model.

## Contact email setup

The contact form sends enquiries to the email address in `src/config/site.json`
using Resend after server-side Turnstile verification. Configure:

- `RESEND_API_KEY`: a Resend key with permission to send email.
- `RESEND_FROM_EMAIL`: a sender on a domain verified in Resend.
  The `onboarding@resend.dev` test sender can only send to your Resend account's email address.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: your widget's public site key.
- `TURNSTILE_SECRET`: the matching server-side secret.
- `TURNSTILE_HOSTNAMES`: a comma-separated allowlist of frontend hostnames.
  Include `localhost,127.0.0.1` for local use and your frontend hostname for production.

Add the same hostnames to the widget's allowed domains in Cloudflare.
The widget and server both use the `contact` action. Keep security verification
enabled; missing widget keys prevent submission.

On Vercel, configure all five values for Production and redeploy.
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` must be present when the frontend is built.
Delivery failures are logged server-side by error type and status, without
logging the enquiry, recipient, or credentials. The success message means
Resend accepted the email; check Resend's dashboard for final delivery status.

## Why?

Traditional portfolios tell visitors who you are.

AswinOS lets them explore.

The project is an experiment in blending software engineering, storytelling, AI, and interface design into a single interactive experience.

---

Status: Operational (mostly)
<img width="1706" height="992" alt="image" src="https://github.com/user-attachments/assets/1721e5e9-fbf8-4f7f-bbaa-f3651d2739c7" />
<img width="1710" height="992" alt="image" src="https://github.com/user-attachments/assets/a0d78cb6-65ba-4148-a9d8-c1acdb61f3e8" />
<img width="313" height="674" alt="image" src="https://github.com/user-attachments/assets/9bb0f928-efb2-4057-a5bb-d243007ac715" />
<img width="1710" height="992" alt="image" src="https://github.com/user-attachments/assets/b2989532-9df0-4a8a-83b8-8b0b092aa600" />


