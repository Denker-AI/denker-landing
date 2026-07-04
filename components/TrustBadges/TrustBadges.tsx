import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// NOTE: Figma repeats the same "Google" placeholder logo 14x — swap in real
// integration logos/names once the client provides their partner list.
const integrations = [
  { name: "Google", logo: "/logos/google.svg" },
  { name: "Gmail", logo: "/logos/gmail.svg" },
  { name: "Out look", logo: "/logos/outlook.svg" },
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

export function TrustBadges() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Built in Public. Trusted by Builders."
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-14">
        <div className="flex w-full flex-col items-start gap-2">
          <BlurText
            as="h2"
            className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
            text="Built in Public. Trusted by Builders."
          />
          <FadeIn as="p" delay={0.1} className="max-w-[800px] font-heading text-xl font-medium leading-7 text-grey-500">
            Explore Denker across the platforms where founders and product
            builders discover, collaborate, and contribute.
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="trustbadges-grid grid w-full gap-2">
          {integrations.map((integration, i) => (
            <div
              key={i}
              className="flex aspect-auto h-full flex-col items-center justify-center gap-3 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-grey-100 bg-white p-6"
            >
              <img src={integration.logo} alt="" className="size-10" />
              <p className="w-full text-center font-heading text-base font-medium text-grey-500">
                {integration.name}
              </p>
            </div>
          ))}
          <div className="trustbadges-more-card flex aspect-video flex-col items-center justify-center rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-grey-100 bg-white p-6">
            <p className="text-center font-heading text-base font-normal leading-6 text-grey-950">
              More than 500+ integrations are available
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
