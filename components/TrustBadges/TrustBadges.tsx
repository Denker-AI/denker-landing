import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn, FadeInStagger } from "@/components/ui/FadeIn";

// NOTE: Figma repeats the same "Google" placeholder logo 14x — swap in real
// integration logos/names once the client provides their partner list.
const integrations = [
  { name: "Google", logo: "/logos/google.svg" },
  { name: "Gmail", logo: "/logos/gmail.svg" },
  { name: "Outlook", logo: "/logos/outlook.svg" },
  { name: "Google Calendar", logo: "/logos/google-calendar.svg" },
  { name: "Google Drive", logo: "/logos/google-drive.svg" },
  { name: "Twitter X", logo: "/logos/x.svg" },
  { name: "Google Sheet", logo: "/logos/google-sheet.svg" },
  { name: "Notion", logo: "/logos/notion.svg" },
  { name: "Slack", logo: "/logos/slack.svg" },
  { name: "Google Docs", logo: "/logos/google-docs.svg" },
  { name: "Linear", logo: "/logos/linear.svg" },
  { name: "GitHub", logo: "/logos/github.svg" },
  { name: "Google Task", logo: "/logos/google-tasks.svg" },
  { name: "Salesforce", logo: "/logos/salesforce.svg" },
  // ... up to 14 entries total
];

// Hard cap on visible integration tiles — any logos beyond this roll into the
// trailing "500+ more" cell so the grid always fits one screenful. Kept at 14
// because the more-card's column-span tuning (.trustbadges-more-card in
// globals.css) assumes exactly 14 tiles ahead of it.
const MAX_VISIBLE_INTEGRATIONS = 14;

export function TrustBadges() {
  return (
    <section
      className="section-tint flex w-full flex-col items-center px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Built in Public. Trusted by Builders."
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-copy-media">
        <div className="flex w-full flex-col items-start gap-title-lead">
          <BlurText
            as="h2"
            className="t-display text-grey-950"
            text="Built in Public. Trusted by Builders."
          />
          <FadeIn as="p" delay={0.1} className="t-lead max-w-[800px] text-grey-500">
            Explore Denker across the platforms where founders and product
            builders discover, collaborate, and contribute.
          </FadeIn>
        </div>

        <FadeInStagger delay={0.2} className="trustbadges-grid grid w-full gap-2">
          {integrations.slice(0, MAX_VISIBLE_INTEGRATIONS).map((integration, i) => (
            <FadeIn
              key={i}
              className="flex aspect-auto h-full flex-col items-center justify-center gap-3 radius-card bg-white p-6"
            >
              <img src={integration.logo} alt="" className="size-10" />
              <p className="t-title w-full text-center text-grey-500">
                {integration.name}
              </p>
            </FadeIn>
          ))}
          <FadeIn className="trustbadges-more-card flex aspect-video flex-col items-center justify-center radius-card bg-white p-6">
            <p className="t-body text-center text-grey-950">
              More than 500+ integrations are available
            </p>
          </FadeIn>
        </FadeInStagger>
      </Container>
    </section>
  );
}
