import type { Metadata } from "next";
import { DenkerLogo } from "@/components/denker-logo";

export const metadata: Metadata = {
  title: "Terms of Service — Denker",
  description: "Terms of service for Denker AI.",
};

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-primary">
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-secondary">{children}</p>;
}

function Ol({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mb-3 list-inside list-decimal space-y-2 text-sm text-secondary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-secondary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
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
          className="mb-2 text-3xl font-bold tracking-tight text-primary"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          Terms of Service
        </h1>
        <p className="mb-12 text-sm text-muted">Last updated: March 2026</p>

        <Section number="1" title="Scope">
          <Ol items={[
            `These Terms of Service apply to all contracts between Denker AI UG (haftungsbeschränkt), Fibigerstraße 141b, 22419 Hamburg (hereinafter \u201cProvider\u201d) and the Customer for the use of the AI-powered workflow automation platform \u201cDenker AI\u201d (hereinafter \u201cPlatform\u201d).`,
            "Deviating, conflicting, or supplementary general terms and conditions of the Customer shall only become part of the contract if and to the extent that the Provider has expressly agreed to their validity in writing.",
            "These Terms apply to both consumers and businesses, unless a differentiation is made in the respective clause.",
          ]} />
        </Section>

        <Section number="2" title="Subject Matter">
          <Ol items={[
            "The Provider provides the Customer with a web-based platform that enables the automation of business processes through natural language input.",
            "The exact scope of services is determined by the respective product description and the selected plan at the time of contract conclusion.",
            "The Provider is entitled to further develop and adapt the Platform at any time, provided that the essential functions are retained.",
          ]} />
        </Section>

        <Section number="3" title="Contract Formation">
          <Ol items={[
            "The presentation of the Platform on the website does not constitute a legally binding offer, but an invitation to submit an offer.",
            "By submitting the registration, the Customer makes a binding offer to conclude a usage contract.",
            "The contract is concluded when the Provider accepts the offer by sending a confirmation email or by enabling access to the Platform.",
          ]} />
        </Section>

        <Section number="4" title="Free Trial and Plans">
          <Ol items={[
            <>The Provider may offer a free trial period ("Free Tier"). During this period, the Customer can use the Platform with limited functionality.</>,
            "Paid use only begins when the Customer actively selects a paid plan and confirms the payment.",
            "Current prices and plan details can be viewed on the pricing page of the website.",
          ]} />
        </Section>

        <Section number="5" title="Customer Obligations">
          <P>(1) The Customer agrees to:</P>
          <Ul items={[
            "Provide truthful information during registration and keep it up to date;",
            "Keep their login credentials secret and protect them from third-party access;",
            "Not use the Platform for illegal purposes;",
            "Not process content that violates applicable law;",
            "Not overload the Platform or impair its functionality.",
          ]} />
          <P>(2) The Customer is responsible for all activities that occur through their user account.</P>
          <P>(3) The Customer is obligated to inform the Provider immediately if they become aware of any misuse of their account.</P>
        </Section>

        <Section number="6" title="Availability">
          <Ol items={[
            "The Provider strives for high availability of the Platform but does not guarantee uninterrupted use.",
            "Planned maintenance work will be announced if possible and scheduled during low-usage times.",
            "The Provider is not liable for disruptions that are outside its sphere of influence (e.g., force majeure, failure of third-party services).",
          ]} />
        </Section>

        <Section number="7" title="Data Protection and Security">
          <Ol items={[
            <>The Provider processes personal data in accordance with applicable data protection laws, in particular the GDPR. For details, please refer to our{" "}<a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.</>,
            "The Customer remains the owner of all data and content they enter.",
            "The Provider will not share customer data with third parties unless this is necessary for contract performance or required by law.",
          ]} />
        </Section>

        <Section number="8" title="Intellectual Property">
          <Ol items={[
            "All rights to the Platform, including software, designs, and documentation, remain with the Provider.",
            "The Customer receives a simple, non-transferable right of use for the duration of the contract.",
            "Workflows created by the Customer and their results remain the property of the Customer.",
          ]} />
        </Section>

        <Section number="9" title="Liability">
          <Ol items={[
            "The Provider is liable without limitation for damages resulting from injury to life, body, or health, as well as for intent and gross negligence.",
            "In case of slight negligence, the Provider is only liable for breach of essential contractual obligations. Liability in these cases is limited to the foreseeable, contract-typical damage.",
            "Liability for indirect damages and lost profits is excluded in case of slight negligence.",
            "The above limitations of liability do not apply to claims under the Product Liability Act.",
          ]} />
        </Section>

        <Section number="10" title="Contract Duration and Termination">
          <Ol items={[
            "Contracts for paid plans are concluded for the respective selected term (monthly or annually) and are automatically extended by the same period if they are not terminated in due time.",
            "Termination is possible at any time at the end of the respective term. For monthly billing, the notice period is 7 days; for annual billing, it is 30 days before the end of the term.",
            "The right to extraordinary termination for good cause remains unaffected.",
            "Termination requires text form (email is sufficient).",
          ]} />
        </Section>

        <Section number="11" title="Right of Withdrawal for Consumers">
          <P>
            Consumers have a 14-day right of withdrawal. The withdrawal instructions are provided to the Customer separately upon contract conclusion.
          </P>
          <P>
            The right of withdrawal expires prematurely if the Provider has begun the performance of the service with the express consent of the consumer before the expiry of the withdrawal period and the consumer has confirmed their knowledge that they will lose their right of withdrawal upon complete contract performance.
          </P>
        </Section>

        <Section number="12" title="Changes to Terms">
          <Ol items={[
            "The Provider reserves the right to change these Terms if this is necessary for factual reasons and the Customer is not unreasonably disadvantaged thereby.",
            "Changes will be communicated to the Customer by email at least 30 days before they take effect. If the Customer does not object within 30 days, the changes are deemed accepted.",
            "In case of objection, the Provider has the right to terminate the contract at the time the changes take effect.",
          ]} />
        </Section>

        <Section number="13" title="Final Provisions">
          <Ol items={[
            "The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods.",
            "The place of jurisdiction for all disputes arising from this contract is Hamburg, provided that the Customer is a merchant, legal entity under public law, or special fund under public law.",
            "Should individual provisions of these Terms be invalid, the validity of the remaining provisions shall remain unaffected.",
          ]} />
        </Section>

        <Section number="14" title="Contact">
          <P>
            Denker AI UG (haftungsbeschränkt)
            <br />
            Fibigerstraße 141b
            <br />
            22419 Hamburg
          </P>
          <P>
            Email:{" "}
            <a href="mailto:support@denker.ai" className="text-accent hover:underline">
              support@denker.ai
            </a>
            <br />
            Phone: +49 179 240 9963
          </P>
        </Section>
      </main>
    </div>
  );
}
