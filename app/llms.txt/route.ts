import { SITE_URL, TAGLINE, DESCRIPTION } from "@/lib/seo";

const CONTENT = `# Denker

> ${TAGLINE} ${DESCRIPTION}

Denker is an AI agent workspace for founders. The macOS app is available today; Windows and Linux users have full access via the web app, with native desktop apps for both coming soon. Instead of scattering work across separate AI chats, you direct a team of specialist agents — Researcher, Writer, Coder, Analyst — from one shared canvas. Tasks, context, outputs, and review stay together so AI work can move business priorities forward.

Denker runs on your own CLI subscription (Claude Code, OpenAI Codex, or OpenCode). You own the AI tokens and costs. Denker provides the desktop app, the agent orchestration, the canvas, the memory, and the integrations.

## Key capabilities

- Desktop-native app on macOS today (signed and notarized universal binary); Windows and Linux available via web app, native desktop apps coming soon
- Agent cursors: each agent has a named cursor visible on your screen, alongside your own
- Parallel agent execution: multiple specialist agents work simultaneously on one canvas
- Around-your-cursor workflow: summon Denker with a global hotkey and dictate tasks from any app
- One canvas for outputs: research, drafts, code, decisions, and reviews stay in one place
- Taskboard: turn AI sessions into tracked tasks with next steps
- Knowledge graph memory: agents build and reuse a persistent memory across all your work
- 2000+ integrations: connect agents to Gmail, Slack, GitHub, Notion, and more via Composio
- Infinite canvas workspace: work is organized spatially, not trapped in separate chat threads
- Bring your own AI: Claude Code GUI, Codex GUI, or OpenCode — you control the model and the cost

## Who it is for

Solo founders, builders, and small teams who want more business progress from AI without scattering context across chat sessions and tools. Denker replaces the pattern of prompting one AI repeatedly with directing a coordinated agent team from one canvas.

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
