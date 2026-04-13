import type { Metadata } from "next";
import { DenkerLogo } from "@/components/denker-logo";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Denker AI.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Denker",
    description: "Privacy policy for Denker AI.",
    url: "https://www.denker.ai/privacy",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-base font-semibold text-primary">{title}</h3>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-secondary">{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-secondary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-12">
        <a href="/">
          <DenkerLogo variant="wordmark" height={22} />
        </a>
        <a
          href="/"
          className="rounded-full border border-glass-stroke px-4 py-1.5 text-xs font-semibold text-secondary transition-colors hover:text-primary"
        >
          Back to home
        </a>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-12">
        <h1
          className="mb-2 text-3xl font-bold font-satoshi tracking-tight text-primary"
        >
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-muted">Last updated: March 2026</p>

        <Section title="1. Data Controller">
          <P>
            Denker AI UG (haftungsbeschränkt)
            <br />
            Fibigerstraße 141b
            <br />
            22419 Hamburg, Germany
          </P>
          <P>
            Email:{" "}
            <a href="mailto:support@denker.ai" className="text-accent underline underline-offset-2 hover:no-underline">
              support@denker.ai
            </a>
            <br />
            Phone: +49 179 240 9963
          </P>
        </Section>

        <Section title="2. Overview of Data Processing">
          <P>
            The following overview summarizes the types of data processed and the purposes of their
            processing and refers to the data subjects.
          </P>
          <Sub title="Types of Data Processed">
            <Ul
              items={[
                "Contact data (e.g., email addresses)",
                "Usage data (e.g., pages visited, access time)",
                "Meta/communication data (e.g., device information, IP addresses)",
              ]}
            />
          </Sub>
          <Sub title="Categories of Data Subjects">
            <Ul items={["Visitors to our website", "Newsletter subscribers"]} />
          </Sub>
          <Sub title="Purposes of Processing">
            <Ul
              items={[
                "Provision of our website and its content",
                "Responding to contact requests and communicating with users",
                "Security measures",
                "Reach measurement and analytics (only with your consent)",
                "Newsletter delivery (only with your consent)",
              ]}
            />
          </Sub>
        </Section>

        <Section title="3. Legal Bases">
          <P>
            Below we inform you about the legal bases of the GDPR on which we process personal data:
          </P>
          <Ul
            items={[
              "Consent (Art. 6(1)(a) GDPR) — You have given your consent to the processing (e.g., for cookies or newsletter).",
              "Contract Performance (Art. 6(1)(b) GDPR) — Processing is necessary for the performance of a contract.",
              "Legal Obligation (Art. 6(1)(c) GDPR) — Processing is necessary to comply with a legal obligation.",
              "Legitimate Interests (Art. 6(1)(f) GDPR) — Processing is necessary for the purposes of our legitimate interests.",
            ]}
          />
        </Section>

        <Section title="4. Security Measures">
          <P>
            We take appropriate technical and organizational measures in accordance with the legal
            requirements, taking into account the state of the art, the implementation costs and the
            nature, scope, circumstances and purposes of the processing, as well as the varying
            likelihood and severity of the risk to the rights and freedoms of natural persons, to
            ensure a level of protection appropriate to the risk.
          </P>
          <P>
            The measures include, in particular, ensuring the confidentiality, integrity and
            availability of data by controlling physical and electronic access to data, as well as
            access, input, disclosure, availability assurance and segregation of data.
          </P>
        </Section>

        <Section title="5. Data Processing on Our Website">
          <Sub title="5.1 Website Provision">
            <P>
              Each time you access our website, our system automatically collects data and information
              from the computer system of the accessing device. This data is temporarily stored in
              so-called server log files.
            </P>
            <P>The following data is collected:</P>
            <Ul
              items={[
                "IP address",
                "Date and time of the request",
                "Time zone difference from Greenwich Mean Time (GMT)",
                "Content of the request (specific page)",
                "Access status / HTTP status code",
                "Amount of data transferred",
                "Website from which the request originates",
                "Browser",
                "Operating system and its interface",
                "Language and version of the browser software",
              ]}
            />
            <P>
              The legal basis for processing is Art. 6(1)(f) GDPR. Our legitimate interest lies in
              the technical provision of the website.
            </P>
          </Sub>
          <Sub title="5.2 Hosting">
            <P>
              Our website is hosted by Vercel Inc. The servers are located in various regions
              worldwide, including Europe. Vercel processes personal data on our behalf as our data
              processor.
            </P>
            <P>
              For more information, see{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                Vercel&apos;s privacy policy
              </a>
              .
            </P>
          </Sub>
        </Section>

        <Section title="6. Cookies and Analytics">
          <Sub title="6.1 Essential Cookies">
            <P>
              We use technically necessary cookies to ensure the basic functions of our website. These
              cookies are set without your consent as they are essential for the operation of the
              website.
            </P>
          </Sub>
          <Sub title="6.2 Analytics Cookies (PostHog)">
            <P>
              With your consent, we use PostHog for website usage analysis. PostHog helps us
              understand how visitors use our website so we can improve it.
            </P>
            <P>The following data is processed:</P>
            <Ul
              items={[
                "Anonymized IP address",
                "Pages visited and time spent",
                "Device information (browser, operating system)",
                "Referrer URL",
              ]}
            />
            <P>
              Data is processed on servers in the EU (Frankfurt). The legal basis is your consent
              (Art. 6(1)(a) GDPR).
            </P>
            <P>
              You can withdraw your consent at any time by clicking on &ldquo;Cookies&rdquo; in the
              footer.
            </P>
          </Sub>
        </Section>

        <Section title="7. Newsletter">
          <P>
            With your consent, you can subscribe to our newsletter. For this we need your email
            address. Registration takes place using the double opt-in procedure.
          </P>
          <P>
            We use the Resend service for delivery. Data is processed on servers in the USA. The
            transfer is based on Standard Contractual Clauses.
          </P>
          <P>
            You can withdraw your consent to the newsletter at any time. You will find an unsubscribe
            link in every newsletter. The lawfulness of the data processing that has already taken
            place remains unaffected by the withdrawal.
          </P>
          <P>Legal basis: Art. 6(1)(a) GDPR (consent)</P>
        </Section>

        <Section title="8. Your Rights">
          <P>You have the following rights regarding your personal data:</P>
          <Ul
            items={[
              "Right of Access (Art. 15 GDPR) — You have the right to obtain information about your data stored with us.",
              "Right to Rectification (Art. 16 GDPR) — You have the right to have inaccurate data corrected.",
              "Right to Erasure (Art. 17 GDPR) — You have the right to request the deletion of your data.",
              "Right to Restriction (Art. 18 GDPR) — You have the right to request the restriction of processing.",
              "Right to Data Portability (Art. 20 GDPR) — You have the right to receive your data in a transferable format.",
              "Right to Object (Art. 21 GDPR) — You have the right to object to the processing of your data.",
              "Right to Withdraw Consent (Art. 7(3) GDPR) — You have the right to withdraw your consent at any time.",
              "Right to Complain (Art. 77 GDPR) — You have the right to lodge a complaint with a supervisory authority.",
            ]}
          />
        </Section>

        <Section title="9. Data Protection Contact">
          <P>If you have any questions about data protection, you can contact us at any time:</P>
          <P>
            Email:{" "}
            <a href="mailto:support@denker.ai" className="text-accent underline underline-offset-2 hover:no-underline">
              support@denker.ai
            </a>
            <br />
            Phone: +49 179 240 9963
          </P>
        </Section>

        <Section title="10. Changes to This Privacy Policy">
          <P>
            We reserve the right to adapt this privacy policy to ensure it always complies with
            current legal requirements or to implement changes to our services. The new privacy policy
            will then apply for your next visit.
          </P>
        </Section>
      </main>
    </div>
  );
}
