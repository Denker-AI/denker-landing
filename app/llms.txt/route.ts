import { SITE_URL, DESCRIPTION } from "@/lib/seo";

const CONTENT = `# Denker

> Your AI agent team, on your desktop. ${DESCRIPTION}

Denker is a desktop AI agent workspace. The macOS app is available today; Windows and Linux users have full access via the web app, with native desktop apps for both coming soon. Instead of prompting one AI at a time, you direct a team of specialist agents — Researcher, Writer, Coder, Analyst — each with a named cursor that lives on your screen, working in parallel on a shared canvas around your active cursor. You give direction; they handle execution. Every action is visible in real time — no black boxes, no waiting for one task to finish before the next begins.

Denker runs on your own CLI subscription (Claude Code, OpenAI Codex, or OpenCode). You own the AI tokens and costs. Denker provides the desktop app, the agent orchestration, the canvas, the memory, and the integrations.

## Key capabilities

- Desktop-native app on macOS today (signed and notarized universal binary); Windows and Linux available via web app, native desktop apps coming soon
- Agent cursors: each agent has a named cursor visible on your screen, alongside your own
- Parallel agent execution: multiple specialist agents work simultaneously on one canvas
- Around-your-cursor workflow: summon Denker with a global hotkey and dictate tasks from any app
- Real-time visibility: every agent action appears live — research, writing, code, outreach, automation
- Knowledge graph memory: agents build and reuse a persistent memory across all your work
- 2000+ integrations: connect agents to Gmail, Slack, GitHub, Notion, and more via Composio
- Infinite canvas workspace: work is organized spatially, not in a chat thread
- Bring your own AI: Claude Code GUI, Codex GUI, or OpenCode — you control the model and the cost

## Who it is for

Solo founders, builders, and small teams who want to delegate execution to an AI agent team while staying in control of direction. Replaces the pattern of prompting one AI repeatedly with directing a coordinated team of agents that work in parallel, directly on your desktop.

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
