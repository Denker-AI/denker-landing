import { SITE_URL, DESCRIPTION } from "@/lib/seo";

const CONTENT = `# Denker

> Your AI team, one canvas. ${DESCRIPTION}

Denker is a visual AI workspace where you direct a team of specialist agents instead of prompting one thing at a time. A Researcher, Writer, Coder, and Analyst work simultaneously on a shared canvas. You give direction; they handle execution. Every action is visible in real time — no black boxes, no waiting for one task to finish before the next begins.

Denker runs on your own CLI subscription (Claude Code, Codex, or OpenCode). You own the AI tokens and costs. Denker provides the canvas, the agent orchestration, the memory, and the integrations.

## Key capabilities

- Parallel agent execution: multiple specialist agents work simultaneously on one canvas
- Real-time visibility: every agent action appears live — research, writing, code, outreach, automation
- Knowledge graph memory: agents build and reuse a persistent memory across all your work
- 2000+ integrations: connect agents to Gmail, Slack, GitHub, Notion, and more via Composio
- Canvas-native workspace: work is organized spatially, not in a chat thread
- Bring your own AI: powered by Claude Code, Codex, or OpenCode — you control the model and cost

## Who it is for

Teams and individuals who want to delegate execution to AI agents while staying in control of direction. Replaces the pattern of prompting one AI repeatedly with directing a coordinated team that works in parallel.

## Pricing

- **Free**: €0 forever — 2 projects, 5 spaces, basic memory. No credit card required.
- **Pro**: €19/month or €199/year — unlimited projects, unlimited spaces, knowledge graph memory.
- **Max**: Coming soon — 24/7 cloud execution with persistent agents.

All plans require your own Claude Code, Codex, or OpenCode subscription for AI tokens.

## Links

- [Homepage](${SITE_URL}): Product overview, features, and sign-up
- [App](https://space.denker.ai): The canvas workspace (requires account)
- [Blog](${SITE_URL}/blog): Product updates and announcements
- [Docs](${SITE_URL}/docs): Documentation overview
- [Getting Started](${SITE_URL}/docs/getting-started): Setup guide
- [How Denker Works](${SITE_URL}/docs/how-denker-works): Architecture and agent model explained
- [Integrations](${SITE_URL}/docs/integrations): Supported tools and connected apps
- [Privacy Policy](${SITE_URL}/privacy): Data handling and privacy
- [Terms of Service](${SITE_URL}/terms): Terms and conditions
`;

export function GET() {
  return new Response(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
