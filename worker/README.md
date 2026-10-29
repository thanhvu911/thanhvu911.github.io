# "Ask about Thanh" assistant worker

The portfolio is a static site on GitHub Pages, so it can't hold an API key. This small
Cloudflare Worker holds the Gemini key, reads the site's facts from
`/assistant-knowledge.json`, and answers visitors' questions. Both services have free
tiers, so it costs $0.

Until the worker is set up, the site's assistant uses prewritten answers and says so.

## One-time setup

1. **Gemini API key.** Sign in at [Google AI Studio](https://aistudio.google.com/apikey)
   with your personal Google account and create an API key. Keep the project on the free
   tier (don't add billing) so it can never charge you. In AI Studio, check that the model
   in `wrangler.toml` (`GEMINI_MODEL`) is still offered on the free tier, and change it if
   not.
2. **Cloudflare account.** Sign up free at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
3. **Deploy** from this folder:

   ```bash
   cd worker
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler deploy
   ```

   `wrangler deploy` prints the worker's URL, like
   `https://thanh-portfolio-assistant.<your-subdomain>.workers.dev`.
4. Put that URL in `assistantEndpoint` in `src/data/portfolio.ts` and redeploy the site.

## Notes

- Only requests from `ALLOWED_ORIGINS` (the live site and local dev) are answered.
- The assistant only knows what is in `src/data/portfolio.ts`. Update that file (for
  example after a resume sync), redeploy the site, and the worker picks up the new facts
  within an hour.
- On the free tier, Google may use prompts to improve its products. Visitors' questions
  are about your public portfolio, so nothing private is sent.
